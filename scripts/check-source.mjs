import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
let count = 0;
async function walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (/\.(mjs|js)$/.test(file)) {
      const r = spawnSync(process.execPath, ["--check", file], {
        encoding: "utf8",
      });
      if (r.status) throw Error(r.stderr);
      count++;
    }
  }
}
for (const dir of ["lib", "public/js", "scripts", "tests", "prisma"])
  await walk(dir);
for (const file of [
  "public/index.html",
  "public/member.html",
  "public/admin.html",
  "public/setup.html",
  "public/legal.html",
  "mobile/App.tsx",
  "render.yaml",
  "database/muscle_dynamics_mariadb.sql",
  "docs/RENDER.md",
  "docker/mariadb/Dockerfile",
  ".github/workflows/build.yml",
])
  await fs.access(file);
console.log(`${count} JavaScript sources parse; required entry points exist.`);
