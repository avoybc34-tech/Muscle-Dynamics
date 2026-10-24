import test from "node:test";
import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";
import sharp from "sharp";
import { createApp } from "../src/app.mjs";
import { tick } from "../src/worker.mjs";
try {
  process.loadEnvFile(".env");
} catch {}
const url = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
if (!url || !new URL(url).pathname.endsWith("_test"))
  throw Error("Require dedicated empty MariaDB database ending _test.");
test("real MariaDB API acceptance and security boundaries", async (t) => {
  const db = new PrismaClient({ datasources: { db: { url } } });
  assert.equal(await db.user.count(), 0, "Test DB must be empty");
  let mailToken = "";
  process.env.BOOTSTRAP_TOKEN = "f".repeat(64);
  const app = await createApp({
    db,
    mailConfigured: () => true,
    resetMail: async (_, token) => {
      mailToken = token;
    },
  });
  await app.ready();
  const req = async (path, method = "GET", body, token) => {
    const r = await app.inject({
      method,
      url: "/v1/" + path,
      headers: token ? { authorization: "Bearer " + token } : {},
      ...(body ? { payload: body } : {}),
    });
    return { status: r.statusCode, data: r.json() };
  };
  const ok = (r, code = 200) => {
    assert.equal(r.status, code, JSON.stringify(r.data));
    return r.data;
  };
  let owner, member, other, plan, account, payment;
  const password = "Test-only-password-123";
  const signup = (email) => ({
    name: "Test Member",
    email,
    phone: "00000000",
    password,
    acceptTerms: true,
  });
  async function upload(id, who = member) {
    const b = "test-boundary",
      image = await sharp({
        create: { width: 20, height: 20, channels: 3, background: "#334455" },
      })
        .png()
        .toBuffer();
    const raw = Buffer.concat([
      Buffer.from(
        `--${b}\r\nContent-Disposition: form-data; name="file"; filename="test.png"\r\nContent-Type: image/png\r\n\r\n`,
      ),
      image,
      Buffer.from(`\r\n--${b}--\r\n`),
    ]);
    const r = await app.inject({
      method: "POST",
      url: "/v1/payments/" + id + "/proof",
      headers: {
        authorization: "Bearer " + who.accessToken,
        "content-type": "multipart/form-data; boundary=" + b,
      },
      payload: raw,
    });
    assert.equal(r.statusCode, 200, r.body);
    return r.json();
  }
  async function pending(who = member) {
    const p = ok(
      await req(
        "payments",
        "POST",
        { planId: plan.id, accountId: account.id },
        who.accessToken,
      ),
    );
    await upload(p.id, who);
    ok(
      await req(
        "payments/" + p.id + "/submit",
        "POST",
        { proofNote: "TEST ONLY NO REAL TRANSFER" },
        who.accessToken,
      ),
    );
    return p;
  }
  const approve = (p, ref) =>
    req(
      "admin/payments/" + p.id + "/review",
      "POST",
      {
        decision: "APPROVED",
        note: "Test actual-funds simulation only",
        actualFundsConfirmed: true,
        verifiedReference: ref,
      },
      owner.accessToken,
    );
  try {
    await t.test(
      "private one-time owner setup and registration gating",
      async () => {
        assert.equal(
          (await req("auth/register", "POST", signup("m@example.invalid")))
            .status,
          409,
        );
        assert.equal(
          (
            await req("setup", "POST", {
              ...signup("owner@example.invalid"),
              setupToken: "x".repeat(64),
            })
          ).status,
          403,
        );
        owner = ok(
          await req("setup", "POST", {
            ...signup("owner@example.invalid"),
            setupToken: process.env.BOOTSTRAP_TOKEN,
          }),
        );
        assert.equal(
          (
            await req("setup", "POST", {
              ...signup("owner2@example.invalid"),
              setupToken: process.env.BOOTSTRAP_TOKEN,
            })
          ).status,
          409,
        );
        ok(
          await req(
            "admin/settings",
            "PUT",
            {
              gymName: "TEST GYM",
              phone: "00000000",
              email: "test@example.invalid",
              address: "Test only address",
              hours: "Test hours",
              privacyText: "Test-only policy. ".repeat(6),
              termsText: "Test-only terms. ".repeat(6),
              paymentInstructions: "TEST ONLY DO NOT TRANSFER",
            },
            owner.accessToken,
          ),
        );
        member = ok(
          await req("auth/register", "POST", signup("member@example.invalid")),
        );
        other = ok(
          await req("auth/register", "POST", signup("other@example.invalid")),
        );
      },
    );
    await t.test(
      "owner-only financial records and actual plan/account creation",
      async () => {
        assert.equal(
          (await req("admin/payments", "GET", null, member.accessToken)).status,
          403,
        );
        plan = ok(
          await req(
            "admin/plans",
            "POST",
            {
              name: "TEST PLAN",
              description: "Test",
              pricePaise: 100000,
              durationDays: 30,
              benefits: ["Test"],
              active: true,
            },
            owner.accessToken,
          ),
        );
        account = ok(
          await req(
            "admin/accounts",
            "POST",
            {
              label: "TEST NO PAYMENT",
              type: "BANK",
              active: true,
              details: {
                accountName: "TEST",
                accountNumber: "NOT-A-REAL-ACCOUNT",
                bankName: "TEST",
                instructions: "Test only",
              },
            },
            owner.accessToken,
          ),
        );
      },
    );
    await t.test(
      "private receipt + pending do not activate membership",
      async () => {
        payment = ok(
          await req(
            "payments",
            "POST",
            { planId: plan.id, accountId: account.id },
            member.accessToken,
          ),
        );
        assert.equal(
          (
            await req(
              "payments/" + payment.id + "/submit",
              "POST",
              { proofNote: "Test" },
              member.accessToken,
            )
          ).status,
          409,
        );
        const f = await upload(payment.id);
        const denied = await app.inject({
          url: "/v1/files/" + f.id,
          headers: { authorization: "Bearer " + other.accessToken },
        });
        assert.equal(denied.statusCode, 404);
        ok(
          await req(
            "payments/" + payment.id + "/submit",
            "POST",
            { proofNote: "TEST ONLY NO REAL FUNDS" },
            member.accessToken,
          ),
        );
        assert.equal(
          ok(await req("dashboard", "GET", null, member.accessToken))
            .membership,
          null,
        );
      },
    );
    await t.test(
      "actual funds required and concurrent review activates exactly once",
      async () => {
        assert.equal(
          (
            await req(
              "admin/payments/" + payment.id + "/review",
              "POST",
              {
                decision: "APPROVED",
                note: "Test note",
                actualFundsConfirmed: false,
              },
              owner.accessToken,
            )
          ).status,
          400,
        );
        const r = await Promise.all([
          approve(payment, "TEST-REF-1"),
          approve(payment, "TEST-REF-1"),
        ]);
        assert.deepEqual(r.map((x) => x.status).sort(), [200, 409]);
      },
    );
    await t.test(
      "renewal extends expiry and duplicate settled reference rolls back",
      async () => {
        const before = ok(
          await req("dashboard", "GET", null, member.accessToken),
        ).membership;
        ok(await approve(await pending(), "TEST-REF-2"));
        const after = ok(
          await req("dashboard", "GET", null, member.accessToken),
        ).membership;
        assert.equal(
          new Date(after.endsAt) - new Date(before.endsAt),
          30 * 86400000,
        );
        assert.equal(
          (await approve(await pending(), "TEST-REF-2")).status,
          409,
        );
        assert.equal(
          ok(await req("dashboard", "GET", null, member.accessToken)).membership
            .endsAt,
          after.endsAt,
        );
      },
    );
    await t.test(
      "workout history is private; completed sessions cannot be rewritten",
      async () => {
        const w = ok(
          await req(
            "admin/workouts",
            "POST",
            {
              title: "TEST WORKOUT",
              description: "Test",
              category: "Strength",
              durationMinutes: 20,
              level: "Beginner",
              active: true,
              exercises: [
                {
                  name: "Test exercise",
                  sets: 2,
                  reps: "5",
                  restSeconds: 60,
                  instructions: "Test",
                },
              ],
            },
            owner.accessToken,
          ),
        );
        const a = ok(
          await req(
            "workouts/" + w.id + "/start",
            "POST",
            {},
            member.accessToken,
          ),
        );
        assert.equal(
          (
            await req(
              "activity/" + a.id,
              "PATCH",
              { sets: [], complete: true },
              other.accessToken,
            )
          ).status,
          404,
        );
        ok(
          await req(
            "activity/" + a.id,
            "PATCH",
            {
              sets: [{ exerciseIndex: 0, setIndex: 0, reps: 5, weight: 10 }],
              complete: true,
            },
            member.accessToken,
          ),
        );
        assert.equal(
          (
            await req(
              "activity/" + a.id,
              "PATCH",
              { sets: [], complete: true },
              member.accessToken,
            )
          ).status,
          409,
        );
      },
    );
    await t.test(
      "profile, support and progress are isolated per user",
      async () => {
        ok(
          await req(
            "profile",
            "PATCH",
            { name: "Updated Test", phone: "11111111" },
            member.accessToken,
          ),
        );
        ok(
          await req(
            "progress",
            "POST",
            { weight: 75, waist: null, notes: "Test" },
            member.accessToken,
          ),
        );
        ok(
          await req(
            "support",
            "POST",
            { subject: "Test support", message: "Test only message" },
            member.accessToken,
          ),
        );
        const a = ok(await req("dashboard", "GET", null, member.accessToken)),
          b = ok(await req("dashboard", "GET", null, other.accessToken));
        assert.equal(a.user.name, "Updated Test");
        assert.equal(a.progress.length, 1);
        assert.equal(b.progress.length, 0);
        assert.equal(b.tickets.length, 0);
      },
    );
    await t.test(
      "refresh token rotation invalidates replay and access expiry is enforced",
      async () => {
        const old = member.refreshToken;
        member = {
          ...member,
          ...ok(await req("auth/refresh", "POST", { refreshToken: old })),
        };
        assert.equal(
          (await req("auth/refresh", "POST", { refreshToken: old })).status,
          401,
        );
        const s = await db.session.findFirst({
          where: { userId: member.user.id, revokedAt: null },
        });
        assert.notEqual(s.refreshHash, member.refreshToken);
        await db.session.update({
          where: { id: s.id },
          data: { accessExpiresAt: new Date(0) },
        });
        assert.equal(
          (await req("dashboard", "GET", null, member.accessToken)).status,
          401,
        );
        member = {
          ...member,
          ...ok(
            await req("auth/refresh", "POST", {
              refreshToken: member.refreshToken,
            }),
          ),
        };
      },
    );
    await t.test(
      "class capacity and restricted staff financial boundaries",
      async () => {
        ok(await approve(await pending(other), "TEST-OTHER-CLASS"));
        const c = ok(
          await req(
            "admin/classes",
            "POST",
            {
              title: "TEST CLASS",
              trainer: "Test trainer",
              startsAt: new Date(Date.now() + 86400000).toISOString(),
              endsAt: new Date(Date.now() + 90000000).toISOString(),
              capacity: 1,
            },
            owner.accessToken,
          ),
        );
        const results = await Promise.all([
          req("classes/" + c.id + "/book", "POST", {}, member.accessToken),
          req("classes/" + c.id + "/book", "POST", {}, other.accessToken),
        ]);
        assert.deepEqual(results.map((x) => x.status).sort(), [200, 409]);
        ok(
          await req(
            "admin/members/" + other.user.id,
            "PATCH",
            { role: "STAFF", active: true },
            owner.accessToken,
          ),
        );
        ok(await req("admin/members", "GET", null, other.accessToken));
        assert.equal(
          (await req("admin/payments", "GET", null, other.accessToken)).status,
          403,
        );
        const f = await db.storedFile.findFirst({
          where: { userId: member.user.id },
        });
        const response = await app.inject({
          url: "/v1/files/" + f.id,
          headers: { authorization: "Bearer " + other.accessToken },
        });
        assert.equal(response.statusCode, 404);
        ok(
          await req(
            "admin/members/" + other.user.id,
            "PATCH",
            { role: "MEMBER", active: true },
            owner.accessToken,
          ),
        );
      },
    );
    await t.test(
      "rejection never changes paid-through dates and unconfigured email fails honestly",
      async () => {
        const before = ok(
          await req("dashboard", "GET", null, member.accessToken),
        ).membership;
        const p = await pending();
        ok(
          await req(
            "admin/payments/" + p.id + "/review",
            "POST",
            {
              decision: "REJECTED",
              note: "TEST rejection reason: funds not confirmed",
            },
            owner.accessToken,
          ),
        );
        assert.equal(
          ok(await req("dashboard", "GET", null, member.accessToken)).membership
            .endsAt,
          before.endsAt,
        );
        const unconfigured = await createApp({
          db,
          mailConfigured: () => false,
        });
        const response = await unconfigured.inject({
          method: "POST",
          url: "/v1/auth/forgot",
          payload: { email: "member@example.invalid" },
        });
        assert.equal(response.statusCode, 503);
        await unconfigured.close();
      },
    );
    await t.test(
      "payment and owner cursor pages preserve isolation and avoid duplicate rows",
      async () => {
        const first = ok(
          await req("payment-history?limit=1", "GET", null, member.accessToken),
        );
        assert.equal(first.items.length, 1);
        assert(first.nextCursor);
        assert(first.items.every((x) => x.userId === member.user.id));
        const second = ok(
          await req(
            "payment-history?limit=1&cursor=" + first.nextCursor,
            "GET",
            null,
            member.accessToken,
          ),
        );
        assert.equal(second.items.length, 1);
        assert.notEqual(first.items[0].id, second.items[0].id);
        const isolated = ok(
          await req(
            "payment-history?cursor=" + first.nextCursor,
            "GET",
            null,
            other.accessToken,
          ),
        );
        assert(isolated.items.every((x) => x.userId === other.user.id));
        const users = ok(
            await req("admin/members?limit=1", "GET", null, owner.accessToken),
          ),
          next = ok(
            await req(
              "admin/members?limit=1&cursor=" + users[0].id,
              "GET",
              null,
              owner.accessToken,
            ),
          );
        assert.notEqual(users[0].id, next[0].id);
        assert(!("passwordHash" in users[0]));
        assert(!("preferences" in users[0]));
        assert.equal(
          (
            await req(
              "admin/members?cursor=INVALID",
              "GET",
              null,
              owner.accessToken,
            )
          ).status,
          400,
        );
      },
    );
    await t.test(
      "one-time password reset invalidates prior sessions",
      async () => {
        ok(
          await req("auth/forgot", "POST", { email: "other@example.invalid" }),
        );
        assert.match(mailToken, /^[a-f0-9]{64}$/);
        ok(
          await req("auth/reset", "POST", {
            token: mailToken,
            password: "New-test-password-123",
          }),
        );
        assert.equal(
          (
            await req("auth/reset", "POST", {
              token: mailToken,
              password: "New-test-password-123",
            })
          ).status,
          400,
        );
        assert.equal(
          (await req("dashboard", "GET", null, other.accessToken)).status,
          401,
        );
      },
    );
    await t.test(
      "push registration, reminder deduplication and mocked ticket creation",
      async () => {
        ok(
          await req(
            "devices",
            "PUT",
            { token: "ExpoPushToken[TEST_ONLY]", platform: "android" },
            member.accessToken,
          ),
        );
        await db.membership.update({
          where: { userId: member.user.id },
          data: { endsAt: new Date(Date.now() + 7 * 86400000 - 1000) },
        });
        process.env.PUSH_ENABLED = "false";
        await tick(db);
        await tick(db);
        assert.equal(
          await db.notification.count({
            where: {
              userId: member.user.id,
              eventKey: { startsWith: "renew:" },
            },
          }),
          1,
        );
        let calls = 0;
        process.env.PUSH_ENABLED = "true";
        await tick(db, async (_, opts) => {
          calls++;
          const messages = JSON.parse(opts.body);
          assert(
            messages.every(
              (x) => x.body === "Open Muscle Dynamics to view this update.",
            ),
          );
          return {
            ok: true,
            json: async () => ({
              data: messages.map((_, i) => ({
                status: "ok",
                id: "test-ticket-" + calls + "-" + i,
              })),
            }),
          };
        });
        assert(calls > 0);
        assert((await db.pushReceipt.count()) > 0);
        process.env.PUSH_ENABLED = "false";
      },
    );
    await t.test("logout actually revokes the server session", async () => {
      ok(await req("auth/logout", "POST", {}, member.accessToken));
      assert.equal(
        (await req("dashboard", "GET", null, member.accessToken)).status,
        401,
      );
    });
  } finally {
    await app.close();
    await db.$disconnect();
  }
});
