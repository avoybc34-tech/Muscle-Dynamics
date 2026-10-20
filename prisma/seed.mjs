import { PrismaClient } from "@prisma/client";
import { defaults } from "../lib/domain.js";
const db = new PrismaClient();
try {
  await db.setting.upsert({
    where: { key: "website" },
    update: {},
    create: { key: "website", value: defaults },
  });
  console.log(
    "Settings initialised. No accounts, prices or payment details were invented. Create the owner at /setup.html.",
  );
} finally {
  await db.$disconnect();
}
