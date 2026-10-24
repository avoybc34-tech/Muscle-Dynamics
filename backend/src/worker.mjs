import { setTimeout as delay } from "node:timers/promises";
import { db } from "./db.mjs";
import { notify } from "./notifications.mjs";
import { preferenceAllows } from "./domain.mjs";
export async function tick(db, send = fetch, shouldStop = () => false) {
  const now = new Date();
  let after;
  while (!shouldStop()) {
    const memberships = await db.membership.findMany({
      where: {
        ...(after ? { id: { gt: after } } : {}),
        status: "ACTIVE",
        endsAt: { gt: now, lte: new Date(Date.now() + 8 * 86400000) },
      },
      take: 500,
      orderBy: { id: "asc" },
    });
    for (const m of memberships) {
      const days = Math.ceil((m.endsAt - now) / 86400000);
      if ([1, 3, 7].includes(days))
        await notify(db, {
          userId: m.userId,
          eventKey: `renew:${m.id}:${m.endsAt.toISOString().slice(0, 10)}:${days}`,
          title: "Membership reminder",
          message: `Your ${m.planName} membership expires in ${days} day${days === 1 ? "" : "s"}. Review renewal options.`,
          category: "membership",
          route: "Membership",
        });
    }
    if (memberships.length < 500) break;
    after = memberships.at(-1).id;
  }
  if (shouldStop()) return;
  // Reclaim a worker lease after a crash; no event is silently discarded.
  await db.pushJob.updateMany({
    where: {
      status: "PROCESSING",
      lockedAt: { lt: new Date(Date.now() - 5 * 60000) },
    },
    data: { status: "PENDING", lockedAt: null },
  });
  const expired = await db.membership.findMany({
    where: { status: "ACTIVE", endsAt: { lte: now } },
    take: 500,
  });
  for (const m of expired)
    await db.$transaction(async (tx) => {
      const changed = await tx.membership.updateMany({
        where: { id: m.id, status: "ACTIVE", endsAt: m.endsAt },
        data: { status: "EXPIRED" },
      });
      if (changed.count && now - m.endsAt < 86400000)
        await notify(tx, {
          userId: m.userId,
          eventKey: "expired:" + m.id + ":" + m.endsAt.toISOString(),
          title: "Membership expired",
          message:
            "Your membership has expired. Review published renewal options.",
          category: "membership",
          route: "Membership",
        });
    });
  if (process.env.PUSH_ENABLED !== "true") return;
  const jobs = await db.pushJob.findMany({
    where: {
      status: "PENDING",
      nextAttemptAt: { lte: now },
      attempts: { lt: 5 },
    },
    include: { notification: { include: { user: true } } },
    take: 50,
  });
  for (const job of jobs) {
    if (shouldStop()) return;
    const lock = await db.pushJob.updateMany({
      where: { id: job.id, status: "PENDING" },
      data: { status: "PROCESSING", lockedAt: now, attempts: { increment: 1 } },
    });
    if (lock.count !== 1) continue;
    try {
      const n = job.notification;
      const devices =
        n.user.active && preferenceAllows(n.user.preferences, n.category)
          ? await db.device.findMany({
              where: { userId: n.userId, enabled: true },
            })
          : [];
      const active = devices.length
        ? await db.session.findMany({
            where: {
              id: { in: devices.map((x) => x.sessionId) },
              userId: n.userId,
              revokedAt: null,
              refreshExpiresAt: { gt: new Date() },
            },
            select: { id: true },
          })
        : [];
      const sessionIds = new Set(active.map((x) => x.id));
      const eligible = devices.filter((x) => sessionIds.has(x.sessionId));
      if (eligible.length) {
        const response = await send("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(process.env.EXPO_ACCESS_TOKEN
              ? { Authorization: "Bearer " + process.env.EXPO_ACCESS_TOKEN }
              : {}),
          },
          body: JSON.stringify(
            eligible.map((d) => ({
              to: d.token,
              title: n.title,
              body: "Open Muscle Dynamics to view this update.",
              sound: "default",
              channelId: "gym-updates",
              data: { route: n.route, notificationId: n.id },
            })),
          ),
          signal: AbortSignal.timeout(12000),
        });
        if (!response.ok) throw Error("provider_http_error");
        const result = await response.json();
        if (
          !Array.isArray(result.data) ||
          result.data.length !== eligible.length
        )
          throw Error("provider_invalid_response");
        let retry = false;
        for (let i = 0; i < result.data.length; i++) {
          const t = result.data[i],
            device = eligible[i];
          if (t.status === "ok" && t.id)
            await db.pushReceipt.upsert({
              where: { ticketId: t.id },
              update: {},
              create: {
                ticketId: t.id,
                deviceId: device.id,
                checkAt: new Date(Date.now() + 15 * 60000),
              },
            });
          else if (t.details?.error === "DeviceNotRegistered")
            await db.device.update({
              where: { id: device.id },
              data: { enabled: false },
            });
          else retry = true;
        }
        if (retry) throw Error("provider_ticket_error");
      }
      await db.pushJob.update({
        where: { id: job.id },
        data: { status: "SENT", lockedAt: null, lastError: null },
      });
    } catch {
      await db.pushJob.update({
        where: { id: job.id },
        data: {
          status: job.attempts >= 4 ? "FAILED" : "PENDING",
          lockedAt: null,
          lastError: "Delivery failed; inspect provider configuration.",
          nextAttemptAt: new Date(
            Date.now() + Math.pow(2, job.attempts + 1) * 60000,
          ),
        },
      });
    }
  }
  const receipts = await db.pushReceipt.findMany({
    where: { checkAt: { lte: now } },
    take: 100,
  });
  if (receipts.length) {
    try {
      const r = await send("https://exp.host/--/api/v2/push/getReceipts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.EXPO_ACCESS_TOKEN
            ? { Authorization: "Bearer " + process.env.EXPO_ACCESS_TOKEN }
            : {}),
        },
        body: JSON.stringify({ ids: receipts.map((x) => x.ticketId) }),
        signal: AbortSignal.timeout(12000),
      });
      if (!r.ok) return;
      const report = await r.json();
      for (const receipt of receipts) {
        const result = report.data?.[receipt.ticketId];
        if (result?.details?.error === "DeviceNotRegistered")
          await db.device.updateMany({
            where: { id: receipt.deviceId },
            data: { enabled: false },
          });
        if (result || Date.now() - receipt.createdAt > 24 * 3600000)
          await db.pushReceipt.delete({ where: { id: receipt.id } });
        else
          await db.pushReceipt.update({
            where: { id: receipt.id },
            data: { checkAt: new Date(Date.now() + 15 * 60000) },
          });
      }
    } catch {
      /* next scheduled run retries; never print device tokens */
    }
  }
}
if (
  process.argv[1]?.endsWith("/worker.mjs") ||
  process.argv[1]?.endsWith("\\worker.mjs")
) {
  let stopping = false;
  const shutdown = new AbortController();
  for (const s of ["SIGTERM", "SIGINT"])
    process.on(s, () => {
      stopping = true;
      shutdown.abort();
    });
  console.log(
    "Membership/push worker started. Delivery is gated by PUSH_ENABLED.",
  );
  while (!stopping) {
    try {
      await tick(db, fetch, () => stopping);
    } catch {
      console.error(
        "Worker cycle failed; check database/provider configuration.",
      );
    }
    if (!stopping)
      await delay(60000, undefined, { signal: shutdown.signal }).catch((e) => {
        if (e.name !== "AbortError") throw e;
      });
  }
  await db.$disconnect();
}
