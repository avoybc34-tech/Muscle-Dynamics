// Real MariaDB integration tests. All fixtures exist only inside a fresh disposable test database.
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import { PrismaClient } from "@prisma/client";
import sharp from "sharp";
try {
  process.loadEnvFile(".env");
} catch {}
const raw = process.env.TEST_DATABASE_URL;
if (!raw)
  throw Error(
    "Set TEST_DATABASE_URL to a dedicated MariaDB database whose name contains _test.",
  );
const url = new URL(raw);
if (!url.pathname.includes("_test"))
  throw Error(
    "Refusing tests: TEST_DATABASE_URL must name a dedicated _test database.",
  );
const schema = "muscle_dynamics_test_" + randomBytes(6).toString("hex");
url.pathname = "/" + schema;
const control = new PrismaClient({ datasources: { db: { url: raw } } });
process.env.DATABASE_URL = url.toString();
process.env.UPLOAD_DIR = ".test-artifacts/" + schema;
process.env.BOOTSTRAP_TOKEN = randomBytes(32).toString("hex");
process.env.NODE_ENV = "test";
let api, db, owner, member, other, staff, plan, account, payment, cls;
const password = "Local-testing-only-12345";
async function req(path, method = "GET", body, token, extra = {}) {
  const headers = {
    ...extra,
    ...(token ? { Authorization: "Bearer " + token } : {}),
  };
  let payload;
  if (body instanceof FormData) payload = body;
  else if (body !== undefined) {
    headers["content-type"] = "application/json";
    payload = JSON.stringify(body);
  }
  const r = await api(
    new Request("http://localhost:3000/api/" + path, {
      method,
      headers,
      body: payload,
    }),
    path.split("?")[0].split("/"),
  );
  const text = await r.text();
  return {
    status: r.status,
    headers: r.headers,
    data: r.headers.get("content-type")?.includes("json")
      ? JSON.parse(text)
      : text,
  };
}
const ok = (r, status = 200) => {
  assert.equal(r.status, status, JSON.stringify(r.data));
  return r.data;
};
async function draft(token = member.token) {
  return ok(
    await req(
      "payments",
      "POST",
      { planId: plan.id, accountId: account.id },
      token,
    ),
    201,
  );
}
async function proof(p, token = member.token) {
  const f = new FormData();
  f.append(
    "file",
    new Blob(
      [
        await sharp({
          create: { width: 30, height: 20, channels: 3, background: "#124080" },
        })
          .png()
          .toBuffer(),
      ],
      { type: "image/png" },
    ),
    "test-receipt.png",
  );
  return ok(await req(`payments/${p.id}/proof`, "POST", f, token), 201);
}
async function pending(token = member.token) {
  const p = await draft(token);
  await proof(p, token);
  ok(
    await req(
      `payments/${p.id}/submit`,
      "POST",
      { proofNote: "TEST FIXTURE ONLY - no real transfer" },
      token,
    ),
  );
  return p;
}
const review = (p, decision = "APPROVED", token = owner.token) =>
  req(
    `admin/payments/${p.id}/review`,
    "POST",
    { decision, note: "TEST DATABASE FIXTURE ONLY", fundsVerified: true },
    token,
  );
before(async () => {
  await control.$executeRawUnsafe(
    `CREATE DATABASE \`${schema}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  const result = spawnSync(
    process.execPath,
    ["node_modules/prisma/build/index.js", "migrate", "deploy"],
    { env: process.env, encoding: "utf8" },
  );
  if (result.status) throw Error(result.stdout + result.stderr);
  ({ handleApi: api } = await import("../lib/api.js"));
  ({ db } = await import("../lib/db.js"));
});
after(async () => {
  await db?.$disconnect();
  await control.$executeRawUnsafe(`DROP DATABASE IF EXISTS \`${schema}\``);
  await control.$disconnect();
  await fs.rm(process.env.UPLOAD_DIR, { recursive: true, force: true });
});
test("health, empty plans and unauthenticated access", async () => {
  ok(await req("health"));
  assert.deepEqual(ok(await req("plans")), []);
  assert.equal((await req("dashboard")).status, 401);
  assert.equal(ok(await req("config")).registrationOpen, false);
});
test("owner bootstrap is secret-gated and one-time", async () => {
  const body = {
    token: process.env.BOOTSTRAP_TOKEN,
    name: "Test Owner",
    email: "owner@example.invalid",
    phone: "03000000000",
    password,
  };
  assert.equal(
    (await req("auth/setup", "POST", { ...body, token: "x".repeat(32) }))
      .status,
    403,
  );
  owner = ok(await req("auth/setup", "POST", body), 201);
  assert.equal((await req("auth/setup", "POST", body)).status, 409);
});
test("registration blocked until owner publishes real required settings", async () => {
  assert.equal(
    (
      await req("auth/register", "POST", {
        name: "Test member",
        email: "member@example.invalid",
        phone: "03000000001",
        password,
        acceptTerms: true,
      })
    ).status,
    409,
  );
  const s = ok(await req("admin/settings", "GET", undefined, owner.token));
  ok(
    await req(
      "admin/settings",
      "PATCH",
      {
        ...s,
        address: "Test database address only",
        phone: "03000000000",
        email: "owner@example.invalid",
        privacyText:
          "Test database privacy fixture. This is not a policy for a real business. ".repeat(
            3,
          ),
        termsText:
          "Test database terms fixture. This is not a policy for a real business. ".repeat(
            3,
          ),
        paymentInstructions:
          "TEST ONLY. No actual money is transferred in these tests.",
      },
      owner.token,
    ),
  );
  for (const [email, name] of [
    ["member@example.invalid", "Test member"],
    ["other@example.invalid", "Other member"],
  ]) {
    const u = ok(
      await req("auth/register", "POST", {
        name,
        email,
        phone: "03000000001",
        password,
        acceptTerms: true,
      }),
      201,
    );
    if (!member) member = u;
    else other = u;
  }
});
test("owner configures plan and receiving account; member cannot", async () => {
  const body = {
    name: "TEST PLAN",
    slug: "test-plan",
    price: 1500,
    durationDays: 30,
    features: ["Test fixture only"],
    active: true,
  };
  assert.equal(
    (await req("admin/plans", "POST", body, member.token)).status,
    403,
  );
  plan = ok(await req("admin/plans", "POST", body, owner.token), 201);
  assert.equal(plan.pricePaise, 150000);
  account = ok(
    await req(
      "admin/accounts",
      "POST",
      {
        label: "TEST BANK",
        type: "BANK",
        accountName: "Test fixture only",
        accountNumber: "TEST-NOT-A-REAL-ACCOUNT",
        active: true,
      },
      owner.token,
    ),
    201,
  );
  staff = ok(
    await req(
      "admin/staff",
      "POST",
      {
        name: "Test staff",
        email: "staff@example.invalid",
        phone: "03000000002",
        password,
      },
      owner.token,
    ),
    201,
  );
  staff = ok(await req("auth/login", "POST", { email: staff.email, password }));
});
test("draft freezes price and account and cannot submit without proof", async () => {
  payment = await draft();
  assert.equal(payment.status, "DRAFT");
  assert.equal(payment.amountPaise, 150000);
  assert.equal(
    (
      await req(
        `payments/${payment.id}/submit`,
        "POST",
        { proofNote: "Test details" },
        member.token,
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await req(
        `payments/${payment.id}/proof`,
        "POST",
        new FormData(),
        other.token,
      )
    ).status,
    404,
  );
});
test("receipt is validated, reencoded, and private to member and owner", async () => {
  const fake = new FormData();
  fake.append(
    "file",
    new Blob(["not an image"], { type: "image/png" }),
    "bad.png",
  );
  assert.equal(
    (await req(`payments/${payment.id}/proof`, "POST", fake, member.token))
      .status,
    400,
  );
  const p = await proof(payment);
  payment.proofId = p.proofId;
  ok(await req("files/" + p.proofId, "GET", undefined, member.token));
  ok(await req("files/" + p.proofId, "GET", undefined, owner.token));
  assert.equal((await req("files/" + p.proofId)).status, 401);
  assert.equal(
    (await req("files/" + p.proofId, "GET", undefined, other.token)).status,
    403,
  );
  assert.equal(
    (await req("files/" + p.proofId, "GET", undefined, staff.token)).status,
    403,
  );
});
test("submission becomes pending without activating membership", async () => {
  ok(
    await req(
      `payments/${payment.id}/submit`,
      "POST",
      { proofNote: "TEST RECEIPT - NO REAL PAYMENT" },
      member.token,
    ),
  );
  assert.equal(
    ok(await req("dashboard", "GET", undefined, member.token)).membership,
    null,
  );
  assert.equal(
    (
      await req(
        `payments/${payment.id}/submit`,
        "POST",
        { proofNote: "duplicate" },
        member.token,
      )
    ).status,
    409,
  );
});
test("approval needs actual-funds confirmation and owner permission", async () => {
  assert.equal((await review(payment, "APPROVED", staff.token)).status, 403);
  assert.equal(
    (
      await req(
        `admin/payments/${payment.id}/review`,
        "POST",
        { decision: "APPROVED", note: "Test review", fundsVerified: false },
        owner.token,
      )
    ).status,
    400,
  );
});
test("concurrent approval activates exactly once and notifies", async () => {
  const results = await Promise.all([review(payment), review(payment)]);
  assert.deepEqual(results.map((r) => r.status).sort(), [200, 409]);
  assert.equal(
    await db.subscription.count({ where: { paymentId: payment.id } }),
    1,
  );
  const d = ok(await req("dashboard", "GET", undefined, member.token));
  assert.equal(d.membership.status, "ACTIVE");
  assert(d.notifications.some((n) => n.title === "Payment approved"));
});
test("same-plan renewal extends old expiry by exactly 30 days", async () => {
  const old = await db.membership.findUnique({
    where: { userId: member.user.id },
  });
  const p = await pending();
  ok(await review(p));
  const next = await db.membership.findUnique({
    where: { userId: member.user.id },
  });
  assert.equal(+next.endsAt - +old.endsAt, 30 * 86400000);
  assert.equal(+next.startsAt, +old.startsAt);
});
test("rejection requires reason, does not activate, and notifies", async () => {
  const p = await pending(other.token);
  assert.equal(
    (
      await req(
        `admin/payments/${p.id}/review`,
        "POST",
        { decision: "REJECTED", note: "" },
        owner.token,
      )
    ).status,
    400,
  );
  ok(await review(p, "REJECTED"));
  const d = ok(await req("dashboard", "GET", undefined, other.token));
  assert.equal(d.membership, null);
  assert(d.notifications.some((n) => n.title === "Payment needs attention"));
});
test("staff can record one check-in per Pakistan day but not access finances/settings", async () => {
  for (const p of [
    "admin/settings",
    "admin/payments",
    "admin/reports",
    "admin/audit",
  ])
    assert.equal((await req(p, "GET", undefined, staff.token)).status, 403);
  for (let i = 0; i < 2; i++)
    ok(
      await req(
        "admin/attendance",
        "POST",
        { userId: member.user.id },
        staff.token,
      ),
      201,
    );
  assert.equal(
    await db.attendance.count({ where: { userId: member.user.id } }),
    1,
  );
});
test("class capacity stays safe under concurrent booking and staff can view roster", async () => {
  ok(await review(await pending(other.token)));
  const t = ok(
    await req(
      "admin/trainers",
      "POST",
      { name: "Test trainer", specialty: "Test training" },
      owner.token,
    ),
    201,
  );
  cls = ok(
    await req(
      "admin/classes",
      "POST",
      {
        title: "TEST CLASS",
        trainerId: t.id,
        startsAt: new Date(Date.now() + 86400000).toISOString(),
        endsAt: new Date(Date.now() + 90000000).toISOString(),
        capacity: 1,
      },
      owner.token,
    ),
    201,
  );
  const r = await Promise.all([
    req(`classes/${cls.id}/book`, "POST", {}, member.token),
    req(`classes/${cls.id}/book`, "POST", {}, other.token),
  ]);
  assert.deepEqual(r.map((x) => x.status).sort(), [201, 409]);
  assert.equal(
    ok(
      await req(
        `admin/classes/${cls.id}/bookings`,
        "GET",
        undefined,
        staff.token,
      ),
    ).length,
    1,
  );
});
test("class cancellation cancels bookings and sends notification", async () => {
  ok(
    await req(
      "admin/classes/" + cls.id,
      "PATCH",
      {
        title: cls.title,
        trainerId: cls.trainerId,
        startsAt: cls.startsAt,
        endsAt: cls.endsAt,
        capacity: 1,
        active: false,
      },
      owner.token,
    ),
  );
  assert.equal(
    await db.booking.count({ where: { classId: cls.id, status: "CONFIRMED" } }),
    0,
  );
  assert.equal(
    await db.notification.count({ where: { title: "Class cancelled" } }),
    1,
  );
});
test("support reply notifies member; progress remains account-specific", async () => {
  const t = ok(
    await req(
      "support",
      "POST",
      { subject: "Test support", message: "This is a test support request" },
      member.token,
    ),
    201,
  );
  ok(
    await req(
      "admin/support/" + t.id,
      "PATCH",
      { reply: "Test gym reply", status: "RESOLVED" },
      staff.token,
    ),
  );
  ok(
    await req(
      "progress",
      "POST",
      { weight: 75, workouts: 1, notes: "Test entry" },
      member.token,
    ),
    201,
  );
  assert.equal(
    ok(await req("dashboard", "GET", undefined, other.token)).progress.length,
    0,
  );
  assert(
    ok(
      await req("dashboard", "GET", undefined, member.token),
    ).notifications.some((n) => n.title === "A reply from your gym"),
  );
});
test("MariaDB utf8mb4 and TEXT fields preserve long member content", async () => {
  const text = "Training update 💪 ".repeat(80);
  const ticket = ok(
    await req(
      "support",
      "POST",
      { subject: "Unicode and long-text test", message: text },
      member.token,
    ),
    201,
  );
  assert.equal(ticket.message, text.trim());
  const reply = "Owner reply 💪 ".repeat(60);
  const updated = ok(
    await req(
      "admin/support/" + ticket.id,
      "PATCH",
      { reply, status: "RESOLVED" },
      owner.token,
    ),
  );
  assert.equal(updated.reply, reply.trim());
});
test("MariaDB member search is case-insensitive without PostgreSQL mode syntax", async () => {
  const found = ok(
    await req("admin/members?q=TEST%20MEMBER", "GET", undefined, owner.token),
  );
  assert(found.rows.some((user) => user.id === member.user.id));
});
test("reports include approved only and CSV, audit is owner-only", async () => {
  const r = ok(await req("admin/reports", "GET", undefined, owner.token));
  assert.equal(r.count, 3);
  assert(r.rows.every((p) => p.status === "APPROVED"));
  const csv = await req(
    "admin/reports?format=csv",
    "GET",
    undefined,
    owner.token,
  );
  ok(csv);
  assert(csv.headers.get("content-type").includes("text/csv"));
  assert(csv.data.includes("Amount PKR"));
  assert(
    ok(await req("admin/audit", "GET", undefined, owner.token)).length > 0,
  );
});
test("expired membership restarts on approval; active owner-approved plan change replaces period", async () => {
  await db.membership.update({
    where: { userId: other.user.id },
    data: { endsAt: new Date(Date.now() - 86400000) },
  });
  const start = Date.now();
  ok(await review(await pending(other.token)));
  let m = await db.membership.findUnique({ where: { userId: other.user.id } });
  assert(+m.startsAt >= start);
  const second = ok(
    await req(
      "admin/plans",
      "POST",
      {
        name: "SECOND TEST PLAN",
        slug: "second-test",
        price: 2000,
        durationDays: 45,
        features: ["Test only"],
        active: true,
      },
      owner.token,
    ),
    201,
  );
  const old = plan;
  plan = second;
  ok(await review(await pending(other.token)));
  plan = old;
  m = await db.membership.findUnique({ where: { userId: other.user.id } });
  assert.equal(m.planId, second.id);
  assert.equal(+m.endsAt - +m.startsAt, 45 * 86400000);
});
test("cash renewal needs owner, actual cash confirmation, and an active CASH account", async () => {
  const cash = ok(
    await req(
      "admin/accounts",
      "POST",
      {
        label: "TEST CASH",
        type: "CASH",
        note: "Test reception only",
        active: true,
      },
      owner.token,
    ),
    201,
  );
  const body = {
    userId: member.user.id,
    planId: plan.id,
    accountId: cash.id,
    note: "TEST CASH - fixture only",
    fundsVerified: true,
  };
  assert.equal(
    (
      await req(
        "admin/payments/cash",
        "POST",
        { ...body, fundsVerified: false },
        owner.token,
      )
    ).status,
    400,
  );
  assert.equal(
    (await req("admin/payments/cash", "POST", body, staff.token)).status,
    403,
  );
  assert.equal(
    (
      await req(
        "admin/payments/cash",
        "POST",
        { ...body, accountId: account.id },
        owner.token,
      )
    ).status,
    400,
  );
  const p = ok(
    await req("admin/payments/cash", "POST", body, owner.token),
    201,
  );
  assert.equal(p.status, "APPROVED");
  assert.equal(await db.subscription.count({ where: { paymentId: p.id } }), 1);
});
test("cross-origin cookie mutation is blocked and logout revokes session", async () => {
  assert.equal(
    (
      await req(
        "profile",
        "PATCH",
        { name: "Bad", phone: "03000000000" },
        undefined,
        {
          Origin: "https://evil.invalid",
          Cookie: "md_session=" + member.token,
        },
      )
    ).status,
    403,
  );
  ok(await req("auth/logout", "POST", {}, member.token));
  assert.equal(
    (await req("dashboard", "GET", undefined, member.token)).status,
    401,
  );
});
