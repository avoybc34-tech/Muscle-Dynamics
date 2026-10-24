import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import multipart from "@fastify/multipart";
import { z } from "zod";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import {
  userInput,
  planInput,
  workoutInput,
  preferences,
  blankSettings,
  registrationReady,
  membershipView,
  renewalPeriod,
  publicUser,
} from "./domain.mjs";
import {
  fail,
  token,
  digest,
  hashPassword,
  verifyPassword,
  authenticate,
  issueSession,
  transaction,
} from "./security.mjs";
import { notify, broadcast } from "./notifications.mjs";
import { mailReady, sendReset } from "./mail.mjs";
const text = (max = 3000) => z.string().trim().max(max);
export async function createApp({
  db,
  resetMail = sendReset,
  mailConfigured = mailReady,
  logger = false,
} = {}) {
  if (!db) throw Error("Database is required.");
  const dummyPasswordHash = await hashPassword(token());
  const app = Fastify({
    logger,
    bodyLimit: 1_000_000,
    trustProxy: process.env.TRUST_PROXY === "true",
  });
  await app.register(helmet);
  await app.register(cors, { origin: process.env.APP_ORIGIN || false });
  await app.register(rateLimit, { max: 120, timeWindow: 60000 });
  await app.register(multipart, {
    limits: { fileSize: 5 * 1024 * 1024, files: 1, parts: 2 },
  });
  app.setErrorHandler((e, req, res) => {
    const conflict =
      ["P2002", "P2034"].includes(e.code) ||
      (e.code === "P2010" &&
        ["1020", "1213", "1205"].includes(String(e.meta?.code)));
    const status =
      e instanceof z.ZodError
        ? 400
        : e.statusCode || (conflict ? 409 : e.code === "P2025" ? 404 : 500);
    res.code(status).send({
      error:
        status === 500
          ? "The request could not be completed. Please retry."
          : e instanceof z.ZodError
            ? "Check your input. " +
              e.issues
                .map((x) => `${x.path.join(".")}: ${x.message}`)
                .slice(0, 3)
                .join("; ")
            : conflict
              ? "This record changed or already exists. Refresh and try again."
              : e.code === "P2025"
                ? "Record not found."
                : e.message,
    });
  });
  const setting = async () => ({
    ...blankSettings,
    ...(await db.gymSetting.findUnique({ where: { id: "gym" } }))?.value,
  });
  const auth = { preHandler: async (r) => authenticate(db, r) };
  const owner = {
    preHandler: async (r) => {
      await authenticate(db, r);
      if (r.user.role !== "OWNER") fail(403, "Owner permission required.");
    },
  };
  const staff = {
    preHandler: async (r) => {
      await authenticate(db, r);
      if (!["OWNER", "STAFF"].includes(r.user.role))
        fail(403, "Staff permission required.");
    },
  };
  const audit = (tx, r, action, targetId) =>
    tx.audit.create({ data: { actorId: r.user.id, action, targetId } });
  async function authorizedPayment(r, id) {
    const p = await db.payment.findUnique({ where: { id } });
    if (!p || (p.userId !== r.user.id && r.user.role !== "OWNER"))
      fail(404, "Payment not found.");
    return p;
  }
  function page(r, max = 100) {
    const q = z
      .object({
        cursor: z
          .string()
          .regex(/^[a-z0-9]{20,40}$/)
          .optional(),
        limit: z.coerce.number().int().min(1).max(max).default(max),
      })
      .parse(r.query || {});
    return {
      take: q.limit,
      orderBy: { id: "desc" },
      ...(q.cursor ? { cursor: { id: q.cursor }, skip: 1 } : {}),
    };
  }
  app.get("/v1/payment-history", auth, async (r) => {
    const args = page(r, 50),
      items = await db.payment.findMany({
        ...args,
        where: { userId: r.user.id },
      });
    return {
      items,
      nextCursor: items.length === args.take ? items.at(-1).id : null,
    };
  });
  app.get("/health", async () => {
    await db.$queryRaw`SELECT 1`;
    return {
      ok: true,
      service: "Muscle Dynamics",
      mailConfigured: mailConfigured(),
      pushConfigured: process.env.PUSH_ENABLED === "true",
    };
  });
  app.get("/v1/config", async () => {
    const s = await setting();
    return {
      ...s,
      registrationOpen:
        registrationReady(s) &&
        !!(await db.user.findFirst({ where: { role: "OWNER" } })),
      ownerExists: !!(await db.user.findFirst({ where: { role: "OWNER" } })),
      mailConfigured: mailConfigured(),
    };
  });
  app.post(
    "/v1/setup",
    { config: { rateLimit: { max: 5, timeWindow: 60000 } } },
    async (r) => {
      const b = userInput
        .extend({ setupToken: z.string().min(32).max(256) })
        .parse(r.body);
      if (
        !process.env.BOOTSTRAP_TOKEN ||
        /GENERATE|REPLACE|YOUR_/i.test(process.env.BOOTSTRAP_TOKEN) ||
        process.env.BOOTSTRAP_TOKEN.length < 32 ||
        digest(b.setupToken) !== digest(process.env.BOOTSTRAP_TOKEN)
      )
        fail(403, "Setup is not authorized.");
      await db.gymSetting.upsert({
        where: { id: "gym" },
        create: { id: "gym", value: blankSettings },
        update: {},
      });
      const hash = await hashPassword(b.password);
      const u = await transaction(db, async (tx) => {
        await tx.$queryRaw`SELECT id FROM GymSetting WHERE id='gym' FOR UPDATE`;
        if (await tx.user.findFirst({ where: { role: "OWNER" } }))
          fail(409, "Owner setup is already complete.");
        return tx.user.create({
          data: {
            email: b.email,
            name: b.name,
            phone: b.phone,
            passwordHash: hash,
            role: "OWNER",
            preferences,
            membership: { create: {} },
          },
        });
      });
      return {
        user: publicUser(u),
        ...(await issueSession(db, u.id, "Owner setup")),
      };
    },
  );
  app.post(
    "/v1/auth/register",
    { config: { rateLimit: { max: 5, timeWindow: 60000 } } },
    async (r) => {
      const b = userInput
        .extend({ acceptTerms: z.literal(true) })
        .parse(r.body);
      if (
        !registrationReady(await setting()) ||
        !(await db.user.findFirst({ where: { role: "OWNER" } }))
      )
        fail(
          409,
          "Registration is not open. The gym must finish its contacts and policies first.",
        );
      const existing = await db.user.findUnique({ where: { email: b.email } });
      if (existing)
        fail(
          409,
          "This email cannot be registered. Try login or password recovery.",
        );
      const u = await db.user.create({
        data: {
          name: b.name,
          email: b.email,
          phone: b.phone,
          passwordHash: await hashPassword(b.password),
          preferences,
          membership: { create: {} },
        },
      });
      return {
        user: publicUser(u),
        ...(await issueSession(db, u.id, "Mobile app")),
      };
    },
  );
  app.post(
    "/v1/auth/login",
    { config: { rateLimit: { max: 8, timeWindow: 60000 } } },
    async (r) => {
      const b = z
        .object({
          email: z.email().transform((x) => x.toLowerCase().trim()),
          password: z.string().min(1).max(128),
          deviceName: text(120).optional(),
        })
        .parse(r.body);
      const u = await db.user.findUnique({ where: { email: b.email } });
      const hash = u?.passwordHash || dummyPasswordHash;
      if (!(await verifyPassword(b.password, hash)) || !u?.active)
        fail(401, "Email or password is incorrect.");
      return {
        user: publicUser(u),
        ...(await issueSession(db, u.id, b.deviceName || "Mobile app")),
      };
    },
  );
  app.post(
    "/v1/auth/refresh",
    { config: { rateLimit: { max: 30, timeWindow: 60000 } } },
    async (r) => {
      const b = z
        .object({ refreshToken: z.string().regex(/^[a-f0-9]{64}$/) })
        .parse(r.body);
      return transaction(db, async (tx) => {
        const s = await tx.session.findUnique({
          where: { refreshHash: digest(b.refreshToken) },
          include: { user: true },
        });
        if (
          !s ||
          s.revokedAt ||
          s.refreshExpiresAt <= new Date() ||
          !s.user.active
        )
          fail(401, "Your session has expired. Please log in again.");
        const access = token(),
          refresh = token();
        const result = await tx.session.updateMany({
          where: {
            id: s.id,
            refreshHash: digest(b.refreshToken),
            revokedAt: null,
          },
          data: {
            accessHash: digest(access),
            refreshHash: digest(refresh),
            accessExpiresAt: new Date(Date.now() + 15 * 60000),
          },
        });
        if (result.count !== 1)
          fail(401, "Session changed. Please log in again.");
        return {
          user: publicUser(s.user),
          accessToken: access,
          refreshToken: refresh,
          expiresAt: new Date(Date.now() + 15 * 60000),
        };
      });
    },
  );
  app.post("/v1/auth/logout", auth, async (r) => {
    await db.session.update({
      where: { id: r.session.id },
      data: { revokedAt: new Date() },
    });
    return { ok: true };
  });
  app.get("/v1/sessions", auth, async (r) =>
    (
      await db.session.findMany({
        where: {
          userId: r.user.id,
          revokedAt: null,
          refreshExpiresAt: { gt: new Date() },
        },
        select: {
          id: true,
          deviceName: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    ).map((s) => ({ ...s, current: s.id === r.session.id })),
  );
  app.delete("/v1/sessions/:id", auth, async (r) => {
    await db.session.updateMany({
      where: { id: r.params.id, userId: r.user.id },
      data: { revokedAt: new Date() },
    });
    return { ok: true };
  });
  app.post(
    "/v1/auth/forgot",
    { config: { rateLimit: { max: 4, timeWindow: 60000 } } },
    async (r) => {
      const b = z
        .object({ email: z.email().transform((x) => x.toLowerCase().trim()) })
        .parse(r.body);
      if (!mailConfigured())
        fail(
          503,
          "Password-reset email is not configured yet. Contact the gym.",
        );
      const u = await db.user.findUnique({ where: { email: b.email } });
      if (u?.active) {
        const raw = token();
        await db.passwordReset.updateMany({
          where: { userId: u.id, usedAt: null },
          data: { usedAt: new Date() },
        });
        const row = await db.passwordReset.create({
          data: {
            userId: u.id,
            tokenHash: digest(raw),
            expiresAt: new Date(Date.now() + 30 * 60000),
          },
        });
        try {
          await resetMail(u.email, raw);
        } catch {
          await db.passwordReset.update({
            where: { id: row.id },
            data: { usedAt: new Date() },
          });
        }
      }
      return {
        message:
          "If this email is registered and delivery succeeds, a reset code will arrive. Check spam or contact the gym.",
      };
    },
  );
  app.post(
    "/v1/auth/reset",
    { config: { rateLimit: { max: 6, timeWindow: 60000 } } },
    async (r) => {
      const b = z
        .object({
          token: z.string().regex(/^[a-f0-9]{64}$/),
          password: z.string().min(10).max(128),
        })
        .parse(r.body);
      const hash = await hashPassword(b.password);
      await transaction(db, async (tx) => {
        const row = await tx.passwordReset.findUnique({
          where: { tokenHash: digest(b.token) },
        });
        if (!row || row.usedAt || row.expiresAt <= new Date())
          fail(400, "Reset code is invalid or expired.");
        const used = await tx.passwordReset.updateMany({
          where: { id: row.id, usedAt: null },
          data: { usedAt: new Date() },
        });
        if (used.count !== 1) fail(400, "Reset code has already been used.");
        await tx.user.update({
          where: { id: row.userId },
          data: { passwordHash: hash },
        });
        await tx.session.updateMany({
          where: { userId: row.userId },
          data: { revokedAt: new Date() },
        });
      });
      return { ok: true };
    },
  );
  app.patch("/v1/profile", auth, async (r) => {
    const b = z
      .object({
        name: z.string().trim().min(2).max(100),
        phone: z.string().trim().min(6).max(32),
      })
      .parse(r.body);
    return publicUser(
      await db.user.update({ where: { id: r.user.id }, data: b }),
    );
  });
  app.post("/v1/password", auth, async (r) => {
    const b = z
      .object({
        currentPassword: z.string().max(128),
        password: z.string().min(10).max(128),
      })
      .parse(r.body);
    if (!(await verifyPassword(b.currentPassword, r.user.passwordHash)))
      fail(400, "Current password is incorrect.");
    await transaction(db, async (tx) => {
      await tx.user.update({
        where: { id: r.user.id },
        data: { passwordHash: await hashPassword(b.password) },
      });
      await tx.session.updateMany({
        where: { userId: r.user.id },
        data: { revokedAt: new Date() },
      });
    });
    return { ok: true };
  });
  app.patch("/v1/preferences", auth, async (r) => {
    const b = z
      .object(
        Object.fromEntries(
          Object.keys(preferences).map((k) => [k, z.boolean()]),
        ),
      )
      .parse(r.body);
    await db.user.update({
      where: { id: r.user.id },
      data: { preferences: b },
    });
    return b;
  });
  app.put("/v1/devices", auth, async (r) => {
    const b = z
      .object({
        token: z
          .string()
          .regex(/^(ExponentPushToken|ExpoPushToken)\[[a-zA-Z0-9_-]+\]$/)
          .max(255),
        platform: z.enum(["ios", "android"]),
      })
      .parse(r.body);
    await db.device.upsert({
      where: { token: b.token },
      update: {
        userId: r.user.id,
        sessionId: r.session.id,
        platform: b.platform,
        enabled: true,
      },
      create: { ...b, userId: r.user.id, sessionId: r.session.id },
    });
    return { ok: true };
  });
  app.delete("/v1/devices", auth, async (r) => {
    const b = z.object({ token: z.string().max(255) }).parse(r.body);
    await db.device.updateMany({
      where: { userId: r.user.id, token: b.token },
      data: { enabled: false },
    });
    return { ok: true };
  });
  app.get("/v1/dashboard", auth, async (r) => {
    const uid = r.user.id;
    const [
      m,
      payments,
      activities,
      progress,
      notifications,
      bookings,
      tickets,
      announcements,
    ] = await Promise.all([
      db.membership.findUnique({ where: { userId: uid } }),
      db.payment.findMany({
        where: { userId: uid },
        orderBy: { id: "desc" },
        take: 50,
      }),
      db.activity.findMany({
        where: { userId: uid },
        orderBy: { startedAt: "desc" },
        take: 50,
      }),
      db.progress.findMany({
        where: { userId: uid },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      db.notification.findMany({
        where: { userId: uid },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      db.booking.findMany({
        where: { userId: uid },
        include: { gymClass: true },
      }),
      db.ticket.findMany({
        where: { userId: uid },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
      db.announcement.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    ]);
    return {
      user: publicUser(r.user),
      membership: membershipView(m),
      payments,
      activities,
      progress,
      notifications,
      bookings,
      tickets,
      announcements,
    };
  });
  app.get("/v1/plans", auth, () =>
    db.plan.findMany({
      where: { active: true },
      orderBy: { durationDays: "asc" },
    }),
  );
  app.get("/v1/payment-options", auth, async () => {
    const s = await setting();
    return {
      accounts: await db.account.findMany({ where: { active: true } }),
      instructions: s.paymentInstructions,
      ready: registrationReady(s) && !!s.paymentInstructions,
    };
  });
  app.post("/v1/payments", auth, async (r) => {
    const b = z
      .object({ planId: z.string(), accountId: z.string() })
      .parse(r.body);
    const [plan, account, s] = await Promise.all([
      db.plan.findUnique({ where: { id: b.planId } }),
      db.account.findUnique({ where: { id: b.accountId } }),
      setting(),
    ]);
    if (
      !plan?.active ||
      !account?.active ||
      !registrationReady(s) ||
      !s.paymentInstructions
    )
      fail(
        409,
        "The gym must configure valid plans, receiving accounts and instructions first.",
      );
    return db.payment.create({
      data: {
        userId: r.user.id,
        reference: "MD-" + token().slice(0, 14).toUpperCase(),
        planId: plan.id,
        planSnapshot: plan,
        accountSnapshot: account,
        amountPaise: plan.pricePaise,
        proofNote: "",
        reviewNote: "",
      },
    });
  });
  app.post("/v1/payments/:id/submit", auth, async (r) => {
    const p = await authorizedPayment(r, r.params.id);
    if (p.userId !== r.user.id || p.status !== "DRAFT" || !p.proofId)
      fail(409, "Attach a receipt to your draft before submitting.");
    const b = z
      .object({ proofNote: z.string().trim().min(3).max(1000) })
      .parse(r.body);
    const result = await db.payment.updateMany({
      where: { id: p.id, userId: r.user.id, status: "DRAFT" },
      data: {
        status: "PENDING",
        proofNote: b.proofNote,
        submittedAt: new Date(),
      },
    });
    if (result.count !== 1) fail(409, "Payment changed. Refresh it.");
    return { ok: true };
  });
  async function upload(r, kind, payment) {
    const file = await r.file();
    if (
      !file ||
      !["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)
    )
      fail(400, "Choose a PNG, JPEG or WebP image under 5 MB.");
    const raw = await file.toBuffer();
    let image;
    try {
      image = await sharp(raw, { limitInputPixels: 24000000 })
        .rotate()
        .resize({
          width: 1600,
          height: 1600,
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85 })
        .toBuffer();
    } catch {
      fail(400, "Image could not be decoded safely.");
    }
    const dir = path.resolve(process.env.UPLOAD_DIR || ".uploads");
    await fs.mkdir(dir, { recursive: true });
    const filename = randomUUID() + ".jpg";
    await fs.writeFile(path.join(dir, filename), image, { mode: 0o600 });
    try {
      return await transaction(db, async (tx) => {
        const f = await tx.storedFile.create({
          data: { userId: r.user.id, kind, filename, sha256: digest(image) },
        });
        if (kind === "AVATAR")
          await tx.user.update({
            where: { id: r.user.id },
            data: { avatarId: f.id },
          });
        else {
          const result = await tx.payment.updateMany({
            where: { id: payment.id, userId: r.user.id, status: "DRAFT" },
            data: { proofId: f.id },
          });
          if (result.count !== 1) fail(409, "Payment changed while uploading.");
        }
        return { id: f.id };
      });
    } catch (e) {
      await fs.unlink(path.join(dir, filename)).catch(() => {});
      throw e;
    }
  }
  app.post("/v1/avatar", auth, (r) => upload(r, "AVATAR"));
  app.post("/v1/payments/:id/proof", auth, async (r) => {
    const p = await authorizedPayment(r, r.params.id);
    if (p.userId !== r.user.id || p.status !== "DRAFT")
      fail(409, "Only your draft payment can accept a receipt.");
    return upload(r, "PROOF", p);
  });
  app.get("/v1/files/:id", auth, async (r, res) => {
    const f = await db.storedFile.findUnique({ where: { id: r.params.id } });
    if (!f || (f.userId !== r.user.id && r.user.role !== "OWNER"))
      fail(404, "File not found.");
    const file = await fs
      .readFile(
        path.join(
          path.resolve(process.env.UPLOAD_DIR || ".uploads"),
          f.filename,
        ),
      )
      .catch(() => null);
    if (!file) fail(404, "File not found.");
    res.header("Cache-Control", "private, no-store").type("image/jpeg");
    return file;
  });
  app.get("/v1/workouts", auth, () =>
    db.workout.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    }),
  );
  app.post("/v1/workouts/:id/start", auth, async (r) => {
    const w = await db.workout.findUnique({ where: { id: r.params.id } });
    if (!w?.active) fail(404, "Workout not found.");
    return db.activity.create({
      data: {
        userId: r.user.id,
        workoutId: w.id,
        title: w.title,
        exerciseSnapshot: w.exercises,
        sets: [],
      },
    });
  });
  app.patch("/v1/activity/:id", auth, async (r) => {
    const b = z
      .object({
        sets: z
          .array(
            z.object({
              exerciseIndex: z.number().int().min(0).max(49),
              setIndex: z.number().int().min(0).max(19),
              reps: z.number().int().min(0).max(500),
              weight: z.number().min(0).max(1000),
            }),
          )
          .max(1000),
        complete: z.boolean().default(false),
      })
      .parse(r.body);
    return transaction(db, async (tx) => {
      await tx.$queryRaw`SELECT id FROM Activity WHERE id=${r.params.id} FOR UPDATE`;
      const a = await tx.activity.findFirst({
        where: { id: r.params.id, userId: r.user.id },
      });
      if (!a) fail(404, "Activity not found.");
      if (a.completedAt)
        fail(409, "Completed workout history cannot be overwritten.");
      for (const s of b.sets) {
        if (
          !a.exerciseSnapshot[s.exerciseIndex] ||
          s.setIndex >= a.exerciseSnapshot[s.exerciseIndex].sets
        )
          fail(400, "Set does not belong to this workout.");
      }
      if (
        new Set(b.sets.map((x) => x.exerciseIndex + ":" + x.setIndex)).size !==
        b.sets.length
      )
        fail(400, "Duplicate set records.");
      return tx.activity.update({
        where: { id: a.id },
        data: {
          sets: b.sets,
          completedAt: b.complete ? new Date() : null,
          durationSeconds: b.complete
            ? Math.min(
                86400,
                Math.max(0, Math.floor((Date.now() - a.startedAt) / 1000)),
              )
            : 0,
        },
      });
    });
  });
  app.post("/v1/progress", auth, async (r) => {
    const b = z
      .object({
        weight: z.number().min(20).max(500).nullable(),
        waist: z.number().min(20).max(300).nullable(),
        notes: text(2000),
      })
      .parse(r.body);
    return db.progress.create({ data: { ...b, userId: r.user.id } });
  });
  app.get("/v1/classes", auth, () =>
    db.gymClass.findMany({
      where: { cancelled: false, startsAt: { gt: new Date() } },
      include: { _count: { select: { bookings: true } } },
      orderBy: { startsAt: "asc" },
      take: 100,
    }),
  );
  app.post("/v1/classes/:id/book", auth, async (r) =>
    transaction(db, async (tx) => {
      await tx.$queryRaw`SELECT id FROM GymClass WHERE id=${r.params.id} FOR UPDATE`;
      const c = await tx.gymClass.findUnique({
        where: { id: r.params.id },
        include: { _count: { select: { bookings: true } } },
      });
      const m = await tx.membership.findUnique({
        where: { userId: r.user.id },
      });
      if (!c || c.cancelled || c.startsAt <= new Date())
        fail(409, "Class is not available.");
      if (m?.status !== "ACTIVE" || !m.endsAt || m.endsAt < c.startsAt)
        fail(403, "An active membership covering this class is required.");
      if (
        await tx.booking.findUnique({
          where: { userId_classId: { userId: r.user.id, classId: c.id } },
        })
      )
        return { ok: true };
      if (c._count.bookings >= c.capacity) fail(409, "Class is full.");
      return tx.booking.create({ data: { userId: r.user.id, classId: c.id } });
    }),
  );
  app.delete("/v1/bookings/:id", auth, async (r) => {
    await db.booking.deleteMany({
      where: { id: r.params.id, userId: r.user.id },
    });
    return { ok: true };
  });
  app.post("/v1/notifications/read", auth, async (r) => {
    const b = z.object({ ids: z.array(z.string()).max(100) }).parse(r.body);
    await db.notification.updateMany({
      where: { id: { in: b.ids }, userId: r.user.id },
      data: { readAt: new Date() },
    });
    return { ok: true };
  });
  app.post("/v1/support", auth, async (r) => {
    const b = z
      .object({
        subject: z.string().trim().min(3).max(150),
        message: z.string().trim().min(3).max(5000),
      })
      .parse(r.body);
    return db.ticket.create({ data: { ...b, userId: r.user.id, reply: "" } });
  });
  app.get("/v1/admin/members", staff, async (r) =>
    (
      await db.user.findMany({
        ...page(r),
        include: { membership: true },
      })
    ).map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      active: u.active,
      membership: membershipView(u.membership),
    })),
  );
  app.patch("/v1/admin/members/:id", owner, async (r) => {
    const b = z
      .object({ role: z.enum(["MEMBER", "STAFF"]), active: z.boolean() })
      .parse(r.body);
    const u = await db.user.findUnique({ where: { id: r.params.id } });
    if (!u || u.role === "OWNER")
      fail(403, "Owner account cannot be changed here.");
    await transaction(db, async (tx) => {
      await tx.user.update({ where: { id: u.id }, data: b });
      if (!b.active)
        await tx.session.updateMany({
          where: { userId: u.id },
          data: { revokedAt: new Date() },
        });
      await audit(tx, r, "MEMBER_ACCESS_UPDATED", u.id);
    });
    return { ok: true };
  });
  app.get("/v1/admin/settings", owner, setting);
  app.put("/v1/admin/settings", owner, async (r) => {
    const b = z
      .object({
        gymName: z.string().min(2).max(100),
        phone: text(32),
        email: z.union([z.email(), z.literal("")]),
        address: text(500),
        hours: text(500),
        privacyText: text(20000),
        termsText: text(20000),
        paymentInstructions: text(5000),
      })
      .parse(r.body);
    await db.gymSetting.upsert({
      where: { id: "gym" },
      create: { id: "gym", value: b },
      update: { value: b },
    });
    await audit(db, r, "SETTINGS_UPDATED", "gym");
    return b;
  });
  for (const [route, model, schema] of [
    ["plans", "plan", planInput],
    ["workouts", "workout", workoutInput],
    [
      "accounts",
      "account",
      z
        .object({
          label: z.string().min(2).max(100),
          type: z.enum(["BANK", "EASYPAISA", "JAZZCASH", "CASH"]),
          details: z.object({
            accountName: text(150),
            accountNumber: text(150),
            bankName: text(100),
            instructions: z.string().min(3).max(2000),
          }),
          active: z.boolean(),
        })
        .superRefine((x, c) => {
          if (
            x.active &&
            x.type !== "CASH" &&
            (!x.details.accountName || !x.details.accountNumber)
          )
            c.addIssue({
              code: "custom",
              message:
                "Active transfer accounts need real account title and number.",
            });
        }),
    ],
  ]) {
    app.get("/v1/admin/" + route, owner, (r) => db[model].findMany(page(r)));
    app.post("/v1/admin/" + route, owner, async (r) => {
      const row = await db[model].create({ data: schema.parse(r.body) });
      await audit(db, r, route.toUpperCase() + "_CREATED", row.id);
      if (route === "workouts" && row.active)
        await broadcast(db, {
          eventKey: "workout:" + row.id,
          title: "New workout plan",
          message: row.title,
          category: "workouts",
          route: "Workouts",
        });
      return row;
    });
    app.put("/v1/admin/" + route + "/:id", owner, async (r) => {
      const row = await db[model].update({
        where: { id: r.params.id },
        data: schema.parse(r.body),
      });
      await audit(db, r, route.toUpperCase() + "_UPDATED", row.id);
      return row;
    });
  }
  app.get("/v1/admin/payments", owner, (r) =>
    db.payment.findMany({
      ...page(r),
      include: { user: { select: { name: true, email: true } } },
    }),
  );
  app.post("/v1/admin/payments/:id/review", owner, async (r) => {
    const b = z
      .object({
        decision: z.enum(["APPROVED", "REJECTED"]),
        note: z.string().trim().min(5).max(2000),
        actualFundsConfirmed: z.boolean().default(false),
        verifiedReference: text(191).optional(),
      })
      .parse(r.body);
    return transaction(db, async (tx) => {
      await tx.$queryRaw`SELECT id FROM Payment WHERE id=${r.params.id} FOR UPDATE`;
      const p = await tx.payment.findUnique({ where: { id: r.params.id } });
      if (!p || p.status !== "PENDING")
        fail(409, "Only an unreviewed pending payment can be reviewed.");
      if (
        b.decision === "APPROVED" &&
        (!b.actualFundsConfirmed ||
          !b.verifiedReference ||
          b.verifiedReference.length < 4)
      )
        fail(
          400,
          "Independently verify actual funds and enter a unique bank/cash reference.",
        );
      if (b.decision === "APPROVED") {
        await tx.membership.upsert({
          where: { userId: p.userId },
          create: { userId: p.userId },
          update: {},
        });
        await tx.$queryRaw`SELECT id FROM Membership WHERE userId=${p.userId} FOR UPDATE`;
        const old = await tx.membership.findUnique({
          where: { userId: p.userId },
        });
        const periods = renewalPeriod(old, p.planSnapshot);
        await tx.membership.update({
          where: { userId: p.userId },
          data: {
            planId: p.planId,
            planName: p.planSnapshot.name,
            status: "ACTIVE",
            ...periods,
          },
        });
      }
      const row = await tx.payment.update({
        where: { id: p.id },
        data: {
          status: b.decision,
          reviewNote: b.note,
          reviewedBy: r.user.id,
          reviewedAt: new Date(),
          verifiedReference:
            b.decision === "APPROVED"
              ? b.verifiedReference.toUpperCase()
              : null,
        },
      });
      await notify(tx, {
        userId: p.userId,
        eventKey: "payment:" + p.id + ":review",
        title:
          b.decision === "APPROVED"
            ? "Payment verified"
            : "Payment not approved",
        message: b.note,
        category: "payments",
        route: "Payments",
      });
      await audit(tx, r, "PAYMENT_" + b.decision, p.id);
      return row;
    });
  });
  app.get("/v1/admin/support", staff, (r) => db.ticket.findMany(page(r)));
  app.post("/v1/admin/support/:id/reply", staff, async (r) => {
    const b = z
      .object({
        reply: z.string().trim().min(2).max(5000),
        status: z.enum(["OPEN", "RESOLVED"]),
      })
      .parse(r.body);
    return transaction(db, async (tx) => {
      const t = await tx.ticket.update({ where: { id: r.params.id }, data: b });
      await notify(tx, {
        userId: t.userId,
        eventKey: "ticket:" + t.id + ":" + token().slice(0, 10),
        title: "Support reply",
        message: b.reply,
        category: "announcements",
        route: "Support",
      });
      return t;
    });
  });
  app.get("/v1/admin/classes", owner, (r) => db.gymClass.findMany(page(r)));
  app.post("/v1/admin/classes", owner, async (r) => {
    const b = z
      .object({
        title: text(120).min(2),
        trainer: text(100).min(2),
        startsAt: z.iso.datetime(),
        endsAt: z.iso.datetime(),
        capacity: z.number().int().min(1).max(200),
      })
      .parse(r.body);
    if (
      new Date(b.startsAt) <= new Date() ||
      new Date(b.endsAt) <= new Date(b.startsAt)
    )
      fail(400, "Choose valid future class times.");
    return db.gymClass.create({
      data: {
        ...b,
        startsAt: new Date(b.startsAt),
        endsAt: new Date(b.endsAt),
      },
    });
  });
  app.get("/v1/admin/announcements", owner, (r) =>
    db.announcement.findMany(page(r)),
  );
  app.post("/v1/admin/announcements", owner, async (r) => {
    const b = z
      .object({ title: text(150).min(2), message: text(5000).min(3) })
      .parse(r.body);
    const a = await db.announcement.create({ data: b });
    let cursor;
    do {
      const users = await db.user.findMany({
        where: { active: true },
        select: { id: true },
        take: 100,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        orderBy: { id: "asc" },
      });
      for (const u of users)
        await notify(db, {
          userId: u.id,
          eventKey: "announcement:" + a.id + ":" + u.id,
          ...b,
          category: "announcements",
          route: "Updates",
        });
      cursor = users.length === 100 ? users.at(-1).id : null;
    } while (cursor);
    return a;
  });
  app.get("/v1/admin/audit", owner, (r) => db.audit.findMany(page(r)));
  return app;
}
