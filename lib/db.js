import { PrismaClient } from "@prisma/client";
const globalDb = globalThis;
export const db = globalDb.mdPrisma || new PrismaClient({ log: ["error"] });
if (process.env.NODE_ENV !== "production") globalDb.mdPrisma = db;
