import {
  randomBytes,
  createHash,
  scrypt as scryptCb,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
const scrypt = promisify(scryptCb);
export const token = () => randomBytes(32).toString("hex");
export const digest = (x) => createHash("sha256").update(x).digest("hex");
export async function hashPassword(value) {
  const salt = randomBytes(16).toString("hex");
  return salt + ":" + (await scrypt(value, salt, 64)).toString("hex");
}
export async function verifyPassword(value, stored) {
  const [salt, hash] = stored.split(":");
  const out = await scrypt(value, salt, 64);
  return hash?.length === 128 && timingSafeEqual(out, Buffer.from(hash, "hex"));
}
export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}
export const fail = (code, message) => {
  throw new HttpError(code, message);
};
export async function issueSession(db, userId, deviceName = "Mobile device") {
  const access = token(),
    refresh = token();
  const row = await db.session.create({
    data: {
      userId,
      accessHash: digest(access),
      refreshHash: digest(refresh),
      accessExpiresAt: new Date(Date.now() + 15 * 60000),
      refreshExpiresAt: new Date(Date.now() + 30 * 86400000),
      deviceName: deviceName.slice(0, 120),
    },
  });
  return {
    accessToken: access,
    refreshToken: refresh,
    expiresAt: row.accessExpiresAt,
  };
}
export async function authenticate(db, req) {
  const value = req.headers.authorization?.replace(/^Bearer /, "");
  if (!value || !/^[a-f0-9]{64}$/.test(value))
    fail(401, "Please log in again.");
  const s = await db.session.findUnique({
    where: { accessHash: digest(value) },
    include: { user: true },
  });
  if (!s || s.revokedAt || s.accessExpiresAt <= new Date() || !s.user.active)
    fail(401, "Your session has expired. Please log in again.");
  req.session = s;
  req.user = s.user;
}
export async function transaction(db, fn) {
  for (let n = 0; n < 4; n++) {
    try {
      return await db.$transaction(fn, {
        isolationLevel: "Serializable",
        maxWait: 10000,
        timeout: 15000,
      });
    } catch (e) {
      const retryable =
        ["P2034", "P2002"].includes(e.code) ||
        (e.code === "P2010" &&
          ["1020", "1213", "1205"].includes(String(e.meta?.code)));
      if (!retryable || n === 3) throw e;
      await new Promise((r) => setTimeout(r, 25 + Math.random() * 80));
    }
  }
}
