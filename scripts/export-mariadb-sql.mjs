// Generate the HeidiSQL import from the exact committed migration, including a matching Prisma baseline.
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
const name = "202610200002_mariadb_initial";
const migration = await fs.readFile(
  `prisma/migrations/${name}/migration.sql`,
  "utf8",
);
const checksum = createHash("sha256").update(migration).digest("hex");
const output = `-- Muscle Dynamics - MariaDB edition\n-- Fresh database installation only. Tested on MariaDB 11.8.6. Use a maintained MariaDB release (10.11+ recommended).\n-- Open this complete file in HeidiSQL and execute ALL statements (F9).\n-- It creates/uses muscle_dynamics, but NEVER drops an existing database or table.\n-- STOP if this database already contains application tables: back up and use a new database.\n-- This is schema only: no owner password, business prices or payment accounts are invented.\n-- Create the first owner through http://localhost:3000/setup.html after starting the app.\n-- Prisma generates application UUIDs and updatedAt values; manage records through the app.\n\nCREATE DATABASE IF NOT EXISTS muscle_dynamics\n  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\nUSE muscle_dynamics;\nSET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;\nSET time_zone = '+00:00';\n\n${migration}\n\n-- Record this exact baseline so START-WINDOWS.bat can run prisma migrate deploy safely.\nCREATE TABLE \`_prisma_migrations\` (\n  \`id\` VARCHAR(36) NOT NULL,\n  \`checksum\` VARCHAR(64) NOT NULL,\n  \`finished_at\` DATETIME(3) NULL,\n  \`migration_name\` VARCHAR(255) NOT NULL,\n  \`logs\` TEXT NULL,\n  \`rolled_back_at\` DATETIME(3) NULL,\n  \`started_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),\n  \`applied_steps_count\` INTEGER UNSIGNED NOT NULL DEFAULT 0,\n  PRIMARY KEY (\`id\`)\n) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n\nINSERT INTO \`_prisma_migrations\`\n  (\`id\`, \`checksum\`, \`finished_at\`, \`migration_name\`, \`applied_steps_count\`)\nVALUES (UUID(), '${checksum}', CURRENT_TIMESTAMP(3), '${name}', 1);\n\nSELECT 'Muscle Dynamics schema imported. Configure .env, then run START-WINDOWS.bat.' AS result;\n`;
await fs.mkdir("database", { recursive: true });
await fs.writeFile("database/muscle_dynamics_mariadb.sql", output);
console.log(
  "Generated database/muscle_dynamics_mariadb.sql (schema + matching migration baseline; no business data).",
);
