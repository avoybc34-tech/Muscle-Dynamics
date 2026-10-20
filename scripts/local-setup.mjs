import fs from "node:fs/promises";
import { randomBytes } from "node:crypto";
const version = Number(process.versions.node.split(".")[0]);
if (version < 22) {
  console.error(
    "Install Node.js 22.13+ (22 LTS recommended), then reopen this launcher.",
  );
  process.exit(1);
}
try {
  await fs.access(".env");
} catch {
  let text = await fs.readFile(".env.example", "utf8");
  text = text.replace(
    "REPLACE_WITH_AT_LEAST_32_RANDOM_CHARACTERS",
    randomBytes(32).toString("hex"),
  );
  await fs.writeFile(".env", text, { mode: 0o600 });
  console.log(
    "Created private .env with a random setup token. Set DATABASE_URL before continuing.",
  );
}
const text = await fs.readFile(".env", "utf8");
if (text.includes("USER:PASSWORD")) {
  console.error(
    "STOP: edit DATABASE_URL in .env with your local MariaDB database user/password, then run this launcher again. See docs/WINDOWS.md.",
  );
  process.exit(1);
}
const line = text
  .split(/\r?\n/)
  .find((line) => /^\s*DATABASE_URL\s*=/.test(line));
const value = line
  ?.slice(line.indexOf("=") + 1)
  .trim()
  .replace(/^["']|["']$/g, "");
try {
  const url = new URL(value);
  if (url.protocol !== "mysql:" || !url.hostname || url.pathname === "/")
    throw Error();
} catch {
  console.error(
    "STOP: this is the MariaDB edition. DATABASE_URL must use mysql://USER:PASSWORD@127.0.0.1:3306/muscle_dynamics . Do not use a postgresql:// URL. See docs/HEIDISQL.md.",
  );
  process.exit(1);
}
console.log(
  "Local configuration exists. Open http://localhost:3000 after the server is ready.",
);
