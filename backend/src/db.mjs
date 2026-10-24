try {
  process.loadEnvFile(".env");
} catch {}
import { PrismaClient } from "@prisma/client";
export const db = new PrismaClient({ log: [] });
