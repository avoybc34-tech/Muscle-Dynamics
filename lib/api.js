import { z } from "zod";
import { db } from "./db.js";
import {
  defaults,
  signupSchema,
  loginSchema,
  profileSchema,
  settingsSchema,
  planSchema,
  accountSchema,
  trainerSchema,
  classSchema,
  progressSchema,
  idSchema,
  passwordSchema,
  emailSchema,
  phoneSchema,
  membershipStatus,
  karachiDay,
  csvCell,
  reference,
} from "./domain.js";
import {
  HttpError,
  digest,
  hashPassword,
  verifyPassword,
  publicUser,
  authenticate,
  sessionFor,
  sessionCookie,
  jsonBody,
  checkOrigin,
  limit,
  audit,
  transaction,
} from "./security.js";
import { readImage, saveImage, removeFile, loadImage } from "./files.js";
import { activatePayment } from "./payments.js";
const R = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
const uuid = (value) => {
  if (!idSchema.safeParse(value).success)
    throw new HttpError(400, "Invalid record ID.");
  return value;
};
const staff = ["OWNER", "STAFF"],
  owner = ["OWNER"];
const detail = (p) => ({ ...p, reference: reference(p.refNo) });
const memberData = (u) => ({
  ...publicUser(u),
  membership: u.membership
    ? { ...u.membership, status: membershipStatus(u.membership) }
    : null,
});
async function settings() {
  const row = await db.setting.findUnique({ where: { key: "website" } });
  return { ...defaults, ...(row?.value || {}) };
}
const ready = (s) =>
  !!(
    s.address &&
    s.phone &&
    s.email &&
    s.privacyText.length >= 50 &&
    s.termsText.length >= 50
  );
async function publicFileIds(ids) {
  if (!ids.length) return;
  const n = await db.storedFile.count({
    where: { id: { in: ids }, kind: "PUBLIC" },
  });
  if (n !== new Set(ids).size)
    throw new HttpError(400, "Choose images from the public media library.");
}
const textSchema = z.string().trim().min(1).max(1000);
export async function handleApi(req, parts) {
  const method = req.method,
    url = new URL(req.url),
    p = parts.join("/");
  try {
    checkOrigin(req);
    if (method === "GET" && p === "health") {
      await db.$queryRaw`SELECT 1`;
      return R({ ok: true, service: "Muscle Dynamics" });
    }
    if (method === "GET" && p === "config") {
      const s = await settings();
      const { paymentInstructions, ...publicSettings } = s;
      return R({ ...publicSettings, registrationOpen: ready(s) });
    }
    if (method === "GET" && p === "auth/setup-status")
      return R({
        ownerExists: !!(await db.user.findFirst({
          where: { role: "OWNER" },
          select: { id: true },
        })),
      });
    if (method === "POST" && p === "auth/setup") {
      await limit(req, "setup", 10);
      const body = await jsonBody(
        req,
        z.object({
          token: z.string().min(32).max(500),
          name: z.string().trim().min(1).max(100),
          email: emailSchema,
          phone: phoneSchema,
          password: passwordSchema,
        }),
      );
      if (
        !process.env.BOOTSTRAP_TOKEN ||
        process.env.BOOTSTRAP_TOKEN.startsWith("REPLACE_") ||
        digest(body.token) !== digest(process.env.BOOTSTRAP_TOKEN)
      )
        throw new HttpError(
          403,
          "The setup token is incorrect or has not been configured.",
        );
      const hashed = await hashPassword(body.password);
      const user = await transaction(async (tx) => {
        if (await tx.user.findFirst({ where: { role: "OWNER" } }))
          throw new HttpError(
            409,
            "An owner account already exists. Log in instead.",
          );
        await tx.setting.create({
          data: { key: "owner-created", value: true },
        });
        const u = await tx.user.create({
          data: {
            name: body.name,
            email: body.email,
            phone: body.phone,
            passwordHash: hashed,
            role: "OWNER",
          },
        });
        await tx.setting.upsert({
          where: { key: "website" },
          update: {},
          create: { key: "website", value: defaults },
        });
        await audit(tx, u, "OWNER_CREATED", "User", u.id);
        return u;
      });
      const s = await sessionFor(user);
      return R(s, 201, { "Set-Cookie": sessionCookie(s.token) });
    }
    if (method === "POST" && p === "auth/register") {
      await limit(req, "register", 20);
      const s = await settings();
      if (!ready(s))
        throw new HttpError(
          409,
          "Member registration opens after the gym publishes its contact details, privacy notice and membership terms.",
        );
      const body = await jsonBody(req, signupSchema),
        user = await db.user.create({
          data: {
            name: body.name,
            email: body.email,
            phone: body.phone,
            passwordHash: await hashPassword(body.password),
          },
        });
      const session = await sessionFor(user);
      return R(session, 201, { "Set-Cookie": sessionCookie(session.token) });
    }
    if (method === "POST" && p === "auth/login") {
      await limit(req, "login", 30);
      const b = await jsonBody(req, loginSchema);
      const u = await db.user.findUnique({ where: { email: b.email } });
      const correct = await verifyPassword(b.password, u?.passwordHash);
      if (!u || !correct || u.status !== "ACTIVE")
        throw new HttpError(
          401,
          "Email or password is incorrect, or this account is inactive.",
        );
      const session = await sessionFor(u);
      return R(session, 200, { "Set-Cookie": sessionCookie(session.token) });
    }
    if (method === "GET" && p === "plans")
      return R(
        await db.plan.findMany({
          where: { active: true },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        }),
      );
    if (method === "GET" && p === "trainers")
      return R(
        await db.trainer.findMany({
          where: { active: true },
          orderBy: { name: "asc" },
        }),
      );
    if (method === "GET" && p === "classes")
      return R(
        await db.gymClass.findMany({
          where: { active: true, startsAt: { gt: new Date() } },
          include: {
            trainer: true,
            _count: {
              select: { bookings: { where: { status: "CONFIRMED" } } },
            },
          },
          orderBy: { startsAt: "asc" },
          take: 60,
        }),
      );
    if (method === "GET" && parts[0] === "files" && parts.length === 2) {
      const f = await db.storedFile.findUnique({
        where: { id: uuid(parts[1]) },
      });
      if (!f) throw new HttpError(404, "Image not found.");
      if (f.kind === "PROOF") {
        const u = await authenticate(req);
        if (u.role !== "OWNER" && u.id !== f.userId)
          throw new HttpError(403, "This payment proof is private.");
      }
      const image = await loadImage(f.storageKey);
      return new Response(image, {
        headers: {
          "Content-Type": "image/jpeg",
          "Content-Length": String(image.length),
          "X-Content-Type-Options": "nosniff",
          "Cache-Control":
            f.kind === "PROOF" ? "private, no-store" : "public, max-age=3600",
        },
      });
    }
    const u = await authenticate(
      req,
      p.startsWith("admin/") ? staff : undefined,
    );
    if (method === "POST" && p === "auth/logout") {
      await db.session.deleteMany({ where: { userId: u.id } });
      return R({ ok: true }, 200, { "Set-Cookie": sessionCookie("", true) });
    }
    if (method === "GET" && p === "me") return R(publicUser(u));
    if (method === "PATCH" && p === "profile") {
      const b = await jsonBody(req, profileSchema);
      return R(
        publicUser(await db.user.update({ where: { id: u.id }, data: b })),
      );
    }
    if (method === "POST" && p === "password") {
      const b = await jsonBody(
        req,
        z.object({
          currentPassword: z.string().min(1).max(128),
          newPassword: passwordSchema,
        }),
      );
      if (!(await verifyPassword(b.currentPassword, u.passwordHash)))
        throw new HttpError(400, "Your current password is incorrect.");
      await transaction(async (tx) => {
        await tx.user.update({
          where: { id: u.id },
          data: { passwordHash: await hashPassword(b.newPassword) },
        });
        await tx.session.deleteMany({ where: { userId: u.id } });
        await audit(tx, u, "PASSWORD_CHANGED", "User", u.id);
      });
      return R({ message: "Password changed. Please log in again." }, 200, {
        "Set-Cookie": sessionCookie("", true),
      });
    }
    if (method === "GET" && p === "dashboard") {
      const [
        m,
        payments,
        progress,
        notifications,
        attendance,
        bookings,
        tickets,
        announcements,
      ] = await Promise.all([
        db.membership.findUnique({ where: { userId: u.id } }),
        db.paymentRequest.findMany({
          where: { userId: u.id },
          orderBy: { createdAt: "desc" },
          take: 50,
        }),
        db.progressLog.findMany({
          where: { userId: u.id },
          orderBy: { createdAt: "desc" },
          take: 100,
        }),
        db.notification.findMany({
          where: { userId: u.id },
          orderBy: { createdAt: "desc" },
          take: 50,
        }),
        db.attendance.findMany({
          where: { userId: u.id },
          orderBy: { createdAt: "desc" },
          take: 60,
        }),
        db.booking.findMany({
          where: {
            userId: u.id,
            status: "CONFIRMED",
            gymClass: { endsAt: { gt: new Date() } },
          },
          include: { gymClass: { include: { trainer: true } } },
          orderBy: { createdAt: "desc" },
        }),
        db.supportTicket.findMany({
          where: { userId: u.id },
          orderBy: { createdAt: "desc" },
          take: 30,
        }),
        db.announcement.findMany({
          where: { active: true },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
      ]);
      return R({
        user: publicUser(u),
        membership: m ? { ...m, status: membershipStatus(m) } : null,
        payments: payments.map(detail),
        progress,
        notifications,
        attendance,
        bookings,
        tickets,
        announcements,
      });
    }
    if (method === "GET" && p === "payment-options") {
      const s = await settings();
      return R({
        instructions: s.paymentInstructions,
        whatsapp: s.whatsapp,
        accounts: await db.paymentAccount.findMany({
          where: { active: true },
          orderBy: { createdAt: "asc" },
        }),
      });
    }
    if (method === "POST" && p === "payments") {
      const b = await jsonBody(
        req,
        z.object({ planId: idSchema, accountId: idSchema }),
      );
      const s = await settings();
      if (!ready(s) || s.paymentInstructions.length < 10)
        throw new HttpError(
          409,
          "The gym has not finished configuring payment instructions.",
        );
      const [plan, account] = await Promise.all([
        db.plan.findFirst({ where: { id: b.planId, active: true } }),
        db.paymentAccount.findFirst({
          where: { id: b.accountId, active: true },
        }),
      ]);
      if (!plan || !account)
        throw new HttpError(
          400,
          "Choose an available plan and payment method.",
        );
      const existing = await db.paymentRequest.count({
        where: { userId: u.id, status: { in: ["DRAFT", "PENDING"] } },
      });
      if (existing >= 5)
        throw new HttpError(
          409,
          "You already have several open requests. Contact the gym before creating another.",
        );
      return R(
        detail(
          await db.paymentRequest.create({
            data: {
              userId: u.id,
              planId: plan.id,
              accountId: account.id,
              planName: plan.name,
              durationDays: plan.durationDays,
              amountPaise: plan.pricePaise,
              accountSnapshot: {
                label: account.label,
                type: account.type,
                bankName: account.bankName,
                accountName: account.accountName,
                accountNumber: account.accountNumber,
                iban: account.iban,
                note: account.note,
              },
            },
          }),
        ),
        201,
      );
    }
    if (parts[0] === "payments" && parts.length === 3 && method === "POST") {
      const id = uuid(parts[1]),
        payment = await db.paymentRequest.findUnique({ where: { id } });
      if (!payment || payment.userId !== u.id)
        throw new HttpError(404, "Payment request not found.");
      if (payment.status !== "DRAFT")
        throw new HttpError(409, "Submitted requests cannot be changed.");
      if (parts[2] === "proof") {
        const image = await readImage(req),
          key = await saveImage(image);
        let saved;
        try {
          saved = await transaction(async (tx) => {
            const latest = await tx.paymentRequest.findUnique({
              where: { id },
            });
            if (latest.status !== "DRAFT")
              throw new HttpError(
                409,
                "This request has already been submitted.",
              );
            const f = await tx.storedFile.create({
              data: {
                userId: u.id,
                storageKey: key,
                kind: "PROOF",
                bytes: image.length,
              },
            });
            await tx.paymentRequest.update({
              where: { id },
              data: { proofId: f.id },
            });
            return f;
          });
        } catch (e) {
          await removeFile(key);
          throw e;
        }
        return R({ proofId: saved.id, url: "/api/files/" + saved.id }, 201);
      }
      if (parts[2] === "submit") {
        const b = await jsonBody(
          req,
          z.object({ proofNote: z.string().trim().min(3).max(500) }),
        );
        const result = await transaction(async (tx) => {
          const latest = await tx.paymentRequest.findUnique({ where: { id } });
          if (latest.status !== "DRAFT")
            throw new HttpError(
              409,
              "This request has already been submitted.",
            );
          if (!latest.proofId)
            throw new HttpError(
              400,
              "Upload a payment receipt before submitting.",
            );
          const updated = await tx.paymentRequest.update({
            where: { id },
            data: {
              status: "PENDING",
              submittedAt: new Date(),
              proofNote: b.proofNote,
            },
          });
          await audit(tx, u, "PAYMENT_SUBMITTED", "PaymentRequest", id);
          return updated;
        });
        return R(detail(result));
      }
    }
    if (method === "POST" && p === "progress")
      return R(
        await db.progressLog.create({
          data: { ...(await jsonBody(req, progressSchema)), userId: u.id },
        }),
        201,
      );
    if (method === "POST" && p === "notifications/read") {
      const b = await jsonBody(
        req,
        z.object({ ids: z.array(idSchema).max(100) }),
      );
      await db.notification.updateMany({
        where: { id: { in: b.ids }, userId: u.id },
        data: { readAt: new Date() },
      });
      return R({ ok: true });
    }
    if (method === "POST" && p === "support") {
      const b = await jsonBody(
        req,
        z.object({
          subject: z.string().trim().min(3).max(150),
          message: z.string().trim().min(5).max(5000),
        }),
      );
      await limit(req, "support", 30);
      return R(
        await db.supportTicket.create({ data: { ...b, userId: u.id } }),
        201,
      );
    }
    if (
      parts[0] === "classes" &&
      parts.length === 3 &&
      parts[2] === "book" &&
      method === "POST"
    ) {
      const id = uuid(parts[1]);
      const result = await transaction(async (tx) => {
        await tx.$queryRaw`SELECT id FROM GymClass WHERE id=${id} FOR UPDATE`;
        const cls = await tx.gymClass.findUnique({ where: { id } });
        if (!cls || !cls.active || cls.startsAt <= new Date())
          throw new HttpError(409, "This class is not open for booking.");
        const m = await tx.membership.findUnique({ where: { userId: u.id } });
        if (membershipStatus(m) !== "ACTIVE" || m.endsAt < cls.startsAt)
          throw new HttpError(
            403,
            "You need a membership covering the class date.",
          );
        const existing = await tx.booking.findUnique({
          where: { userId_classId: { userId: u.id, classId: id } },
        });
        if (existing?.status === "CONFIRMED")
          throw new HttpError(409, "You are already booked into this class.");
        const count = await tx.booking.count({
          where: { classId: id, status: "CONFIRMED" },
        });
        if (count >= cls.capacity)
          throw new HttpError(409, "This class is full.");
        return tx.booking.upsert({
          where: { userId_classId: { userId: u.id, classId: id } },
          create: { userId: u.id, classId: id },
          update: { status: "CONFIRMED" },
        });
      });
      return R(result, 201);
    }
    if (parts[0] === "bookings" && parts.length === 2 && method === "DELETE") {
      const b = await db.booking.findUnique({
        where: { id: uuid(parts[1]) },
        include: { gymClass: true },
      });
      if (!b || b.userId !== u.id)
        throw new HttpError(404, "Booking not found.");
      if (b.gymClass.startsAt <= new Date())
        throw new HttpError(409, "Past classes cannot be cancelled here.");
      await db.booking.update({
        where: { id: b.id },
        data: { status: "CANCELLED" },
      });
      return R({ ok: true });
    }
    // Staff may access member operations. All financial, role, content and configuration changes are owner-only.
    if (p.startsWith("admin/")) {
      const isOwner = u.role === "OWNER";
      if (method === "GET" && p === "admin/overview") {
        const now = new Date(),
          today = karachiDay(),
          month = new Date(today.slice(0, 7) + "-01T00:00:00+05:00");
        const [members, active, expiring, visits, tickets] = await Promise.all([
          db.user.count({ where: { role: "MEMBER" } }),
          db.membership.count({
            where: {
              cancelledAt: null,
              endsAt: { gt: now },
              user: { status: "ACTIVE" },
            },
          }),
          db.membership.count({
            where: {
              cancelledAt: null,
              endsAt: { gt: now, lte: new Date(Date.now() + 7 * 86400000) },
            },
          }),
          db.attendance.count({ where: { day: today } }),
          db.supportTicket.count({ where: { status: "OPEN" } }),
        ]);
        const finances = isOwner
          ? {
              pending: await db.paymentRequest.count({
                where: { status: "PENDING" },
              }),
              monthRevenuePaise:
                (
                  await db.paymentRequest.aggregate({
                    where: { status: "APPROVED", reviewedAt: { gte: month } },
                    _sum: { amountPaise: true },
                  })
                )._sum.amountPaise || 0,
            }
          : {};
        const recent = await db.user.findMany({
          where: { role: "MEMBER" },
          include: { membership: true },
          orderBy: { createdAt: "desc" },
          take: 6,
        });
        return R({
          members,
          active,
          expiring,
          visits,
          tickets,
          ...finances,
          recent: recent.map(memberData),
          setup: {
            settings: ready(await settings()),
            plans: await db.plan.count({ where: { active: true } }),
            accounts: await db.paymentAccount.count({
              where: { active: true },
            }),
          },
        });
      }
      if (method === "GET" && p === "admin/members") {
        const q = (url.searchParams.get("q") || "").slice(0, 100),
          page = Math.max(
            1,
            Math.min(10000, Number(url.searchParams.get("page")) || 1),
          );
        const where = {
          ...(isOwner && url.searchParams.get("roles") === "all"
            ? {}
            : { role: "MEMBER" }),
          ...(q
            ? {
                OR: [
                  { name: { contains: q } },
                  { email: { contains: q } },
                  { phone: { contains: q } },
                ],
              }
            : {}),
        };
        const [rows, total] = await Promise.all([
          db.user.findMany({
            where,
            include: { membership: true },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * 30,
            take: 30,
          }),
          db.user.count({ where }),
        ]);
        return R({ rows: rows.map(memberData), total, page });
      }
      if (parts[1] === "members" && parts.length === 3) {
        const id = uuid(parts[2]);
        const target = await db.user.findUnique({
          where: { id },
          include: { membership: true },
        });
        if (!target || (!isOwner && target.role !== "MEMBER"))
          throw new HttpError(404, "Member not found.");
        if (method === "GET")
          return R({
            user: memberData(target),
            payments: isOwner
              ? (
                  await db.paymentRequest.findMany({
                    where: { userId: id },
                    orderBy: { createdAt: "desc" },
                    take: 50,
                  })
                ).map(detail)
              : [],
            attendance: await db.attendance.findMany({
              where: { userId: id },
              orderBy: { createdAt: "desc" },
              take: 60,
            }),
          });
        if (method === "PATCH") {
          if (!isOwner)
            throw new HttpError(
              403,
              "Only the owner can edit member accounts.",
            );
          const b = await jsonBody(
            req,
            profileSchema.extend({
              role: z.enum(["MEMBER", "STAFF"]).optional(),
              status: z.enum(["ACTIVE", "SUSPENDED"]).optional(),
            }),
          );
          if (target.role === "OWNER" && (b.role || b.status === "SUSPENDED"))
            throw new HttpError(
              403,
              "The owner account cannot be demoted or suspended here.",
            );
          const result = await transaction(async (tx) => {
            const changed = await tx.user.update({ where: { id }, data: b });
            if (b.status === "SUSPENDED" || b.role)
              await tx.session.deleteMany({ where: { userId: id } });
            await audit(tx, u, "MEMBER_UPDATED", "User", id, {
              role: b.role || target.role,
              status: b.status || target.status,
            });
            return changed;
          });
          return R(publicUser(result));
        }
      }
      if (method === "POST" && p === "admin/attendance") {
        const b = await jsonBody(req, z.object({ userId: idSchema }));
        const m = await db.membership.findUnique({
          where: { userId: b.userId },
          include: { user: true },
        });
        if (membershipStatus(m) !== "ACTIVE" || m.user.status !== "ACTIVE")
          throw new HttpError(
            409,
            "This member does not have active gym access.",
          );
        const row = await db.attendance.upsert({
          where: { userId_day: { userId: b.userId, day: karachiDay() } },
          create: { userId: b.userId, recordedById: u.id, day: karachiDay() },
          update: {},
        });
        await audit(db, u, "CHECK_IN", "Attendance", row.id);
        return R(row, 201);
      }
      if (method === "GET" && p === "admin/attendance") {
        const day = url.searchParams.get("day") || karachiDay();
        if (!/^\d{4}-\d{2}-\d{2}$/.test(day))
          throw new HttpError(400, "Use YYYY-MM-DD.");
        return R(
          await db.attendance.findMany({
            where: { day },
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 500,
          }),
        );
      }
      if (method === "GET" && p === "admin/classes")
        return R(
          await db.gymClass.findMany({
            include: {
              trainer: true,
              _count: {
                select: { bookings: { where: { status: "CONFIRMED" } } },
              },
            },
            orderBy: { startsAt: "desc" },
            take: 150,
          }),
        );
      if (method === "GET" && p === "admin/trainers")
        return R(await db.trainer.findMany({ orderBy: { name: "asc" } }));
      if (method === "GET" && p === "admin/support")
        return R(
          await db.supportTicket.findMany({
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 100,
          }),
        );
      if (method === "PATCH" && parts[1] === "support" && parts.length === 3) {
        const b = await jsonBody(
          req,
          z.object({
            reply: z.string().trim().min(1).max(5000),
            status: z.enum(["OPEN", "RESOLVED"]),
          }),
        );
        const ticket = await db.supportTicket.findUnique({
          where: { id: uuid(parts[2]) },
        });
        if (!ticket) throw new HttpError(404, "Ticket not found.");
        return R(
          await transaction(async (tx) => {
            const t = await tx.supportTicket.update({
              where: { id: ticket.id },
              data: b,
            });
            await tx.notification.create({
              data: {
                userId: ticket.userId,
                title: "A reply from your gym",
                message: b.reply,
              },
            });
            await audit(tx, u, "SUPPORT_REPLIED", "SupportTicket", t.id);
            return t;
          }),
        );
      }
      if (
        method === "GET" &&
        parts[1] === "classes" &&
        parts.length === 4 &&
        parts[3] === "bookings"
      ) {
        const id = uuid(parts[2]);
        return R(
          await db.booking.findMany({
            where: { classId: id, status: "CONFIRMED" },
            include: {
              user: {
                select: { id: true, name: true, email: true, phone: true },
              },
            },
          }),
        );
      }
      if (!isOwner)
        throw new HttpError(403, "Only the owner can access this section.");
      if (method === "GET" && p === "admin/settings")
        return R(await settings());
      if (method === "PATCH" && p === "admin/settings") {
        const b = await jsonBody(req, settingsSchema);
        await publicFileIds(
          [b.heroPhotoId, ...b.gallery.map((f) => f.id)].filter(Boolean),
        );
        return R(
          await transaction(async (tx) => {
            const row = await tx.setting.upsert({
              where: { key: "website" },
              create: { key: "website", value: b },
              update: { value: b },
            });
            await audit(tx, u, "SETTINGS_UPDATED", "Setting", "website");
            return row.value;
          }),
        );
      }
      if (method === "GET" && p === "admin/plans")
        return R(
          await db.plan.findMany({
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
          }),
        );
      if (parts[1] === "plans" && ["POST", "PATCH"].includes(method)) {
        const b = await jsonBody(req, planSchema);
        const { price, ...fields } = b;
        const data = {
          ...fields,
          pricePaise: Math.round(price * 100),
          currency: "PKR",
        };
        const id = parts[2] ? uuid(parts[2]) : null;
        if (method === "PATCH" && !id)
          throw new HttpError(400, "Choose a plan.");
        return R(
          await transaction(async (tx) => {
            const row = id
              ? await tx.plan.update({ where: { id }, data })
              : await tx.plan.create({ data });
            await audit(
              tx,
              u,
              id ? "PLAN_UPDATED" : "PLAN_CREATED",
              "Plan",
              row.id,
            );
            return row;
          }),
          id ? 200 : 201,
        );
      }
      if (method === "GET" && p === "admin/accounts")
        return R(
          await db.paymentAccount.findMany({ orderBy: { createdAt: "asc" } }),
        );
      if (parts[1] === "accounts" && ["POST", "PATCH"].includes(method)) {
        const b = await jsonBody(req, accountSchema);
        const id = parts[2] ? uuid(parts[2]) : null;
        if (method === "PATCH" && !id)
          throw new HttpError(400, "Choose an account.");
        return R(
          await transaction(async (tx) => {
            const row = id
              ? await tx.paymentAccount.update({ where: { id }, data: b })
              : await tx.paymentAccount.create({ data: b });
            await audit(
              tx,
              u,
              "PAYMENT_ACCOUNT_SAVED",
              "PaymentAccount",
              row.id,
            );
            return row;
          }),
          id ? 200 : 201,
        );
      }
      if (method === "GET" && p === "admin/payments") {
        const filter = url.searchParams.get("status") || "PENDING";
        if (
          !["DRAFT", "PENDING", "APPROVED", "REJECTED", "ALL"].includes(filter)
        )
          throw new HttpError(400, "Invalid payment filter.");
        return R(
          (
            await db.paymentRequest.findMany({
              where: filter === "ALL" ? {} : { status: filter },
              include: {
                user: {
                  select: { id: true, name: true, email: true, phone: true },
                },
              },
              orderBy: { createdAt: "desc" },
              take: 150,
            })
          ).map(detail),
        );
      }
      if (
        method === "POST" &&
        parts[1] === "payments" &&
        parts.length === 4 &&
        parts[3] === "review"
      ) {
        const b = await jsonBody(
          req,
          z.object({
            decision: z.enum(["APPROVED", "REJECTED"]),
            note: z.string().trim().min(3).max(1000),
            fundsVerified: z.boolean().default(false),
          }),
        );
        if (b.decision === "APPROVED" && !b.fundsVerified)
          throw new HttpError(
            400,
            "Check the actual receiving account and confirm the funds before approval.",
          );
        const id = uuid(parts[2]);
        return R(
          await transaction(async (tx) => {
            await tx.$queryRaw`SELECT id FROM PaymentRequest WHERE id=${id} FOR UPDATE`;
            const payment = await tx.paymentRequest.findUnique({
              where: { id },
              include: { user: true },
            });
            if (!payment)
              throw new HttpError(404, "Payment request not found.");
            if (payment.status !== "PENDING")
              throw new HttpError(
                409,
                "This request has already been reviewed or has not been submitted.",
              );
            if (payment.user.status !== "ACTIVE")
              throw new HttpError(409, "This account is inactive.");
            if (payment.userId === u.id)
              throw new HttpError(
                403,
                "You cannot review your own payment request.",
              );
            const updated = await tx.paymentRequest.update({
              where: { id },
              data: {
                status: b.decision,
                adminNote: b.note,
                reviewedById: u.id,
                reviewedAt: new Date(),
              },
            });
            if (b.decision === "APPROVED")
              await activatePayment(tx, payment, u, b.note);
            else {
              await tx.notification.create({
                data: {
                  userId: payment.userId,
                  title: "Payment needs attention",
                  message: `${reference(payment.refNo)} was rejected: ${b.note}`,
                },
              });
              await audit(tx, u, "PAYMENT_REJECTED", "PaymentRequest", id, {
                note: b.note,
              });
            }
            return detail(updated);
          }),
        );
      }
      if (method === "POST" && p === "admin/payments/cash") {
        const b = await jsonBody(
          req,
          z.object({
            userId: idSchema,
            planId: idSchema,
            accountId: idSchema,
            note: z.string().trim().min(5).max(1000),
            fundsVerified: z.literal(true),
          }),
        );
        if (b.userId === u.id)
          throw new HttpError(403, "You cannot record your own payment.");
        return R(
          await transaction(async (tx) => {
            const [member, plan, account] = await Promise.all([
              tx.user.findUnique({ where: { id: b.userId } }),
              tx.plan.findFirst({ where: { id: b.planId, active: true } }),
              tx.paymentAccount.findFirst({
                where: { id: b.accountId, active: true, type: "CASH" },
              }),
            ]);
            if (!member || member.status !== "ACTIVE" || !plan || !account)
              throw new HttpError(
                400,
                "Select an active member, plan and cash payment method.",
              );
            const payment = await tx.paymentRequest.create({
              data: {
                userId: b.userId,
                planId: plan.id,
                accountId: account.id,
                planName: plan.name,
                durationDays: plan.durationDays,
                amountPaise: plan.pricePaise,
                accountSnapshot: {
                  label: account.label,
                  type: "CASH",
                  note: account.note,
                },
                proofNote: "Recorded at the gym by owner",
                status: "APPROVED",
                adminNote: b.note,
                reviewedById: u.id,
                submittedAt: new Date(),
                reviewedAt: new Date(),
              },
            });
            await activatePayment(tx, payment, u, b.note);
            return detail(payment);
          }),
          201,
        );
      }
      if (
        method === "POST" &&
        parts[1] === "members" &&
        parts.length === 4 &&
        parts[3] === "cancel-membership"
      ) {
        const b = await jsonBody(req, z.object({ reason: textSchema }));
        const id = uuid(parts[2]);
        await transaction(async (tx) => {
          const m = await tx.membership.update({
            where: { userId: id },
            data: { cancelledAt: new Date() },
          });
          await tx.notification.create({
            data: {
              userId: id,
              title: "Membership updated",
              message: "Your membership was cancelled: " + b.reason,
            },
          });
          await audit(tx, u, "MEMBERSHIP_CANCELLED", "Membership", m.id, {
            reason: b.reason,
          });
        });
        return R({ ok: true });
      }
      if (
        method === "POST" &&
        parts[1] === "members" &&
        parts.length === 4 &&
        parts[3] === "reset-password"
      ) {
        const b = await jsonBody(
          req,
          z.object({ newPassword: passwordSchema }),
        );
        const id = uuid(parts[2]),
          target = await db.user.findUnique({ where: { id } });
        if (!target || target.role === "OWNER")
          throw new HttpError(
            403,
            "Use the owner recovery procedure for owner accounts.",
          );
        await transaction(async (tx) => {
          await tx.user.update({
            where: { id },
            data: { passwordHash: await hashPassword(b.newPassword) },
          });
          await tx.session.deleteMany({ where: { userId: id } });
          await audit(tx, u, "PASSWORD_RESET_BY_OWNER", "User", id);
        });
        return R({
          message:
            "Password reset. Share it securely with the member and ask them to change it immediately.",
        });
      }
      if (method === "POST" && p === "admin/staff") {
        const b = await jsonBody(
          req,
          z.object({
            name: z.string().trim().min(1).max(100),
            email: emailSchema,
            phone: phoneSchema,
            password: passwordSchema,
          }),
        );
        return R(
          await transaction(async (tx) => {
            const row = await tx.user.create({
              data: {
                name: b.name,
                email: b.email,
                phone: b.phone,
                passwordHash: await hashPassword(b.password),
                role: "STAFF",
              },
            });
            await audit(tx, u, "STAFF_CREATED", "User", row.id);
            return publicUser(row);
          }),
          201,
        );
      }
      if (parts[1] === "trainers" && ["POST", "PATCH"].includes(method)) {
        const b = await jsonBody(req, trainerSchema);
        if (b.photoId) await publicFileIds([b.photoId]);
        const id = parts[2] ? uuid(parts[2]) : null;
        return R(
          await transaction(async (tx) => {
            const row = id
              ? await tx.trainer.update({ where: { id }, data: b })
              : await tx.trainer.create({ data: b });
            await audit(tx, u, "TRAINER_SAVED", "Trainer", row.id);
            return row;
          }),
          id ? 200 : 201,
        );
      }
      if (parts[1] === "classes" && ["POST", "PATCH"].includes(method)) {
        const b = await jsonBody(req, classSchema),
          id = parts[2] ? uuid(parts[2]) : null;
        if (new Date(b.startsAt) < new Date() && (!id || b.active))
          throw new HttpError(400, "Create or edit a future class.");
        return R(
          await transaction(async (tx) => {
            if (id) {
              await tx.$queryRaw`SELECT id FROM GymClass WHERE id=${id} FOR UPDATE`;
              const count = await tx.booking.count({
                where: { classId: id, status: "CONFIRMED" },
              });
              if (b.capacity < count)
                throw new HttpError(
                  409,
                  "Capacity cannot be below the confirmed booking count.",
                );
            }
            const previous = id
              ? await tx.gymClass.findUnique({ where: { id } })
              : null;
            const row = id
              ? await tx.gymClass.update({ where: { id }, data: b })
              : await tx.gymClass.create({ data: b });
            if (
              id &&
              b.active &&
              previous &&
              (previous.startsAt.toISOString() !== b.startsAt ||
                previous.endsAt.toISOString() !== b.endsAt ||
                previous.trainerId !== b.trainerId ||
                previous.title !== b.title)
            ) {
              const booked = await tx.booking.findMany({
                where: { classId: id, status: "CONFIRMED" },
              });
              for (const booking of booked)
                await tx.notification.create({
                  data: {
                    userId: booking.userId,
                    title: "Class details updated",
                    message: `${b.title} has updated details. Check the class schedule for the latest time and trainer.`,
                  },
                });
            }
            if (id && !b.active) {
              const bookings = await tx.booking.findMany({
                where: { classId: id, status: "CONFIRMED" },
              });
              await tx.booking.updateMany({
                where: { classId: id },
                data: { status: "CANCELLED" },
              });
              for (const booking of bookings)
                await tx.notification.create({
                  data: {
                    userId: booking.userId,
                    title: "Class cancelled",
                    message: `${b.title} was cancelled. Please contact the gym for help.`,
                  },
                });
            }
            await audit(tx, u, "CLASS_SAVED", "GymClass", row.id);
            return row;
          }),
          id ? 200 : 201,
        );
      }
      if (
        method === "GET" &&
        parts[1] === "classes" &&
        parts[3] === "bookings"
      ) {
        const id = uuid(parts[2]);
        return R(
          await db.booking.findMany({
            where: { classId: id, status: "CONFIRMED" },
            include: {
              user: {
                select: { id: true, name: true, email: true, phone: true },
              },
            },
          }),
        );
      }
      if (method === "GET" && p === "admin/announcements")
        return R(
          await db.announcement.findMany({
            orderBy: { createdAt: "desc" },
            take: 100,
          }),
        );
      if (parts[1] === "announcements" && ["POST", "PATCH"].includes(method)) {
        const b = await jsonBody(
            req,
            z.object({
              title: z.string().trim().min(1).max(150),
              message: z.string().trim().min(1).max(3000),
              active: z.boolean(),
            }),
          ),
          id = parts[2] ? uuid(parts[2]) : null;
        return R(
          await transaction(async (tx) => {
            const row = id
              ? await tx.announcement.update({ where: { id }, data: b })
              : await tx.announcement.create({ data: b });
            await audit(tx, u, "ANNOUNCEMENT_SAVED", "Announcement", row.id);
            return row;
          }),
          id ? 200 : 201,
        );
      }
      if (method === "GET" && p === "admin/media")
        return R(
          await db.storedFile.findMany({
            where: { kind: "PUBLIC" },
            orderBy: { createdAt: "desc" },
            take: 100,
          }),
        );
      if (method === "POST" && p === "admin/media") {
        const image = await readImage(req),
          key = await saveImage(image);
        try {
          const f = await db.storedFile.create({
            data: {
              userId: u.id,
              kind: "PUBLIC",
              storageKey: key,
              bytes: image.length,
            },
          });
          await audit(db, u, "MEDIA_UPLOADED", "StoredFile", f.id);
          return R({ id: f.id, url: "/api/files/" + f.id }, 201);
        } catch (e) {
          await removeFile(key);
          throw e;
        }
      }
      if (method === "GET" && p === "admin/audit")
        return R(
          await db.auditLog.findMany({
            include: { actor: { select: { name: true, email: true } } },
            orderBy: { createdAt: "desc" },
            take: 200,
          }),
        );
      if (method === "GET" && p === "admin/reports") {
        const from = url.searchParams.get("from"),
          to = url.searchParams.get("to");
        if (
          (from && !/^\d{4}-\d{2}-\d{2}$/.test(from)) ||
          (to && !/^\d{4}-\d{2}-\d{2}$/.test(to))
        )
          throw new HttpError(400, "Use YYYY-MM-DD dates.");
        const where = {
          status: "APPROVED",
          ...(from || to
            ? {
                reviewedAt: {
                  ...(from ? { gte: new Date(from + "T00:00:00+05:00") } : {}),
                  ...(to ? { lte: new Date(to + "T23:59:59.999+05:00") } : {}),
                },
              }
            : {}),
        };
        const rows = await db.paymentRequest.findMany({
          where,
          include: { user: { select: { name: true, email: true } } },
          orderBy: { reviewedAt: "desc" },
          take: 10000,
        });
        if (url.searchParams.get("format") === "csv") {
          const csv = [
            [
              "Reference",
              "Member",
              "Email",
              "Plan",
              "Amount PKR",
              "Payment method",
              "Approved at",
            ],
            ...rows.map((row) => [
              reference(row.refNo),
              row.user.name,
              row.user.email,
              row.planName,
              (row.amountPaise / 100).toFixed(2),
              row.accountSnapshot.label,
              row.reviewedAt.toISOString(),
            ]),
          ]
            .map((row) => row.map(csvCell).join(","))
            .join("\r\n");
          return new Response("\uFEFF" + csv, {
            headers: {
              "Content-Type": "text/csv; charset=utf-8",
              "Content-Disposition":
                'attachment; filename="muscle-dynamics-payments.csv"',
              "Cache-Control": "no-store",
            },
          });
        }
        return R({
          totalPaise: rows.reduce((n, row) => n + row.amountPaise, 0),
          count: rows.length,
          rows: rows.map(detail),
          limited: rows.length === 10000,
        });
      }
    }
    throw new HttpError(404, "This endpoint was not found.");
  } catch (error) {
    if (error instanceof HttpError)
      return R({ error: error.message }, error.status);
    if (error.code === "P2002")
      return R(
        {
          error:
            "This record already exists. Check the email, plan slug or submitted request.",
        },
        409,
      );
    if (error.code === "P2025" || error.code === "P2003")
      return R(
        { error: "The selected record could not be found or is still in use." },
        404,
      );
    if (error.code === "P2034")
      return R(
        { error: "Another update happened at the same time. Please retry." },
        409,
      );
    console.error("API failure", error.code || error.name, error.message);
    return R(
      {
        error:
          "The request could not be completed. Please try again or contact the gym.",
      },
      500,
    );
  }
}
