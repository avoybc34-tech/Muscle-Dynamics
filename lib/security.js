import {
  randomBytes,
  createHash,
  scrypt as scryptCb,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { db } from "./db.js";
const scrypt = promisify(scryptCb);
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
export const digest = (value) =>
  createHash("sha256").update(value).digest("hex");
export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  return salt + ":" + (await scrypt(password, salt, 64)).toString("hex");
}
export async function verifyPassword(password, stored) {
  const [salt, hash] = (stored || "0".repeat(32) + ":" + "0".repeat(128)).split(
    ":",
  );
  const actual = await scrypt(password, salt, 64);
  return (
    typeof hash === "string" &&
    hash.length === 128 &&
    timingSafeEqual(actual, Buffer.from(hash, "hex"))
  );
}
export const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  role: u.role,
  status: u.status,
  createdAt: u.createdAt,
});
export function tokenFrom(req) {
  const bearer = req.headers.get("authorization");
  if (bearer?.startsWith("Bearer ")) return bearer.slice(7);
  return (req.headers.get("cookie") || "")
    .split(";")
    .map((x) => x.trim())
    .find((x) => x.startsWith("md_session="))
    ?.slice(11);
}
export async function authenticate(req, roles) {
  const token = tokenFrom(req);
  if (!token || !/^[a-f0-9]{64}$/.test(token))
    throw new HttpError(401, "Please log in to continue.");
  const session = await db.session.findUnique({
    where: { tokenHash: digest(token) },
    include: { user: true },
  });
  if (
    !session ||
    session.expiresAt <= new Date() ||
    session.user.status !== "ACTIVE"
  )
    throw new HttpError(401, "Your session has ended. Please log in again.");
  if (roles && !roles.includes(session.user.role))
    throw new HttpError(
      403,
      "Your account does not have permission for this action.",
    );
  return session.user;
}
export async function sessionFor(user) {
  const token = randomBytes(32).toString("hex");
  await db.session.create({
    data: {
      tokenHash: digest(token),
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 86400000),
    },
  });
  return { token, user: publicUser(user) };
}
export function sessionCookie(token, clear = false) {
  return `md_session=${clear ? "" : token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${clear ? 0 : 604800}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}
export async function readBytes(req, max) {
  if (!req.body) return Buffer.alloc(0);
  const declared = Number(req.headers.get("content-length"));
  if (declared > max) throw new HttpError(413, "This upload is too large.");
  const reader = req.body.getReader();
  let total = 0,
    chunks = [];
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > max) {
        await reader.cancel();
        throw new HttpError(413, "This request is too large.");
      }
      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks);
}
export async function jsonBody(req, schema) {
  if (!req.headers.get("content-type")?.includes("application/json"))
    throw new HttpError(415, "Send application/json.");
  let data;
  try {
    data = JSON.parse((await readBytes(req, 100 * 1024)).toString());
  } catch (e) {
    if (e instanceof HttpError) throw e;
    throw new HttpError(400, "Invalid JSON request.");
  }
  const parsed = schema.safeParse(data);
  if (!parsed.success)
    throw new HttpError(
      400,
      parsed.error.issues
        .map((x) =>
          x.path.length ? `${x.path.join(".")}: ${x.message}` : x.message,
        )
        .join(" · "),
    );
  return parsed.data;
}
export function checkOrigin(req) {
  if (
    ["GET", "HEAD", "OPTIONS"].includes(req.method) ||
    req.headers.get("authorization")?.startsWith("Bearer ")
  )
    return;
  const origin = req.headers.get("origin");
  if (!origin) return;
  const hosts = new Set([
    new URL(req.url).host,
    req.headers.get("host"),
    req.headers.get("x-forwarded-host"),
  ]);
  let allowed = false;
  try {
    const url = new URL(origin);
    if (process.env.NODE_ENV === "production") {
      const expected =
        process.env.APP_URL ||
        "https://" + process.env.RENDER_EXTERNAL_HOSTNAME;
      allowed = origin === expected;
    } else allowed = hosts.has(url.host) || origin === process.env.APP_URL;
  } catch {}
  if (!allowed)
    throw new HttpError(403, "This request did not come from this website.");
}
export async function limit(req, bucket, max = 30) {
  const ip = (req.headers.get("x-forwarded-for") || "local")
    .split(",")[0]
    .trim();
  const window = Math.floor(Date.now() / 600000);
  const key = digest(bucket + "|" + ip + "|" + window);
  const row = await db.rateLimit.upsert({
    where: { key },
    create: { key, expiresAt: new Date((window + 1) * 600000) },
    update: { count: { increment: 1 } },
  });
  if (row.count > max)
    throw new HttpError(429, "Too many attempts. Please wait a few minutes.");
}
export function audit(tx, actor, action, entity, entityId, detail = {}) {
  return tx.auditLog.create({
    data: { actorId: actor.id, action, entity, entityId, detail },
  });
}
// MariaDB may surface an optimistic read conflict as native error 1020 instead of Prisma P2034.
// Retry the entire transaction only for known lock/serialization conflicts; never arbitrary failures.
export function isTransactionConflict(error) {
  return (
    error?.code === "P2034" ||
    (error?.code === "P2010" &&
      ["1020", "1205", "1213"].includes(String(error.meta?.code))) ||
    (error?.name === "PrismaClientUnknownRequestError" &&
      /MysqlError \{ code: (1020|1205|1213),/.test(error.message))
  );
}
export async function transaction(fn) {
  for (let tries = 0; tries < 5; tries++) {
    try {
      return await db.$transaction(fn, {
        isolationLevel: "Serializable",
        maxWait: 10000,
        timeout: 15000,
      });
    } catch (e) {
      if (!isTransactionConflict(e)) throw e;
      if (tries === 4)
        throw new HttpError(
          409,
          "Another update happened at the same time. Please retry.",
        );
      await new Promise((resolve) =>
        setTimeout(resolve, 20 * (tries + 1) + Math.floor(Math.random() * 20)),
      );
    }
  }
}
