import { db } from "./db.mjs";
import { createApp } from "./app.mjs";
const app = await createApp({ db });
for (const s of ["SIGTERM", "SIGINT"])
  process.on(s, async () => {
    await app.close();
    await db.$disconnect();
    process.exit(0);
  });
try {
  await app.listen({
    port: Number(process.env.PORT || 3000),
    host: process.env.HOST || "0.0.0.0",
  });
  console.log(
    "Muscle Dynamics API listening. Configure services before launch.",
  );
} catch (e) {
  console.error("API failed to start. Check configuration.");
  await db.$disconnect();
  process.exitCode = 1;
}
