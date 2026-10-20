// Independent import test: HeidiSQL SQL -> Prisma migration recognition -> zero schema drift.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { randomBytes, createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";
try {
  process.loadEnvFile(".env");
} catch {}
test("HeidiSQL SQL imports cleanly and matches the committed Prisma migration", async () => {
  const raw = process.env.TEST_DATABASE_URL;
  if (!raw || !new URL(raw).pathname.includes("_test"))
    throw Error(
      "Dedicated MariaDB TEST_DATABASE_URL with _test in its name required.",
    );
  const name = "muscle_dynamics_test_sql_" + randomBytes(6).toString("hex");
  const url = new URL(raw);
  url.pathname = "/" + name;
  const control = new PrismaClient({ datasources: { db: { url: raw } } });
  const file = ".test-artifacts/" + name + ".sql";
  const env = { ...process.env, DATABASE_URL: url.toString() };
  const run = (args) => {
    const r = spawnSync(
      process.execPath,
      ["node_modules/prisma/build/index.js", ...args],
      { env, encoding: "utf8" },
    );
    assert.equal(
      r.status,
      0,
      (r.stdout + r.stderr).replaceAll(url.toString(), "[test URL]"),
    );
    return r.stdout;
  };
  try {
    const migration = await fs.readFile(
      "prisma/migrations/202610200002_mariadb_initial/migration.sql",
      "utf8",
    );
    let sql = await fs.readFile("database/muscle_dynamics_mariadb.sql", "utf8");
    assert(
      sql.includes(createHash("sha256").update(migration).digest("hex")),
      "Regenerate SQL: migration checksum differs.",
    );
    assert(
      !/DROP\s+(DATABASE|TABLE)/i.test(sql),
      "Import must not contain destructive drops.",
    );
    sql = sql
      .replace(
        "CREATE DATABASE IF NOT EXISTS muscle_dynamics\n",
        "CREATE DATABASE IF NOT EXISTS " + name + "\n",
      )
      .replace("USE muscle_dynamics;", "USE " + name + ";");
    await control.$executeRawUnsafe(
      `CREATE DATABASE \`${name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
    await fs.mkdir(".test-artifacts", { recursive: true });
    await fs.writeFile(file, sql);
    run(["db", "execute", "--file", file, "--url", url.toString()]);
    assert(run(["migrate", "deploy"]).includes("No pending migrations"));
    run([
      "migrate",
      "diff",
      "--from-url",
      url.toString(),
      "--to-schema-datamodel",
      "prisma/schema.prisma",
      "--exit-code",
    ]);
    const client = new PrismaClient({
      datasources: { db: { url: url.toString() } },
    });
    try {
      assert.equal(await client.user.count(), 0);
      assert.equal(await client.plan.count(), 0);
      assert.equal(await client.paymentAccount.count(), 0);
    } finally {
      await client.$disconnect();
    }
  } finally {
    await control.$executeRawUnsafe(`DROP DATABASE IF EXISTS \`${name}\``);
    await control.$disconnect();
    await fs.rm(file, { force: true });
  }
});
