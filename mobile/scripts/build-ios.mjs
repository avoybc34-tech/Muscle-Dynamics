// Guided Windows/macOS/Linux cloud build. Does not collect passwords or manage signing keys itself.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import process from "node:process";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(root);
const EAS = "eas-cli@25.2.0",
  DOCTOR = "expo-doctor@1.21.5";
const prepareOnly = process.argv.includes("--prepare-only");
const checkOnly = process.argv.includes("--check-only") || prepareOnly;
const profile = process.argv.includes("--testflight")
  ? "testflight"
  : "preview";
const ask = async (text) => {
  if (checkOnly || !process.stdin.isTTY)
    throw Error(
      "This step needs an interactive terminal. Double-click BUILD-IPHONE.bat or run npm run build:ios in PowerShell.",
    );
  const input = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    return (await input.question(text)).trim();
  } finally {
    input.close();
  }
};
function command(
  binary,
  args,
  { capture = false, allowFailure = false, env = {} } = {},
) {
  // All command arguments below are fixed strings or validated profile names, never passwords/user input.
  const win = process.platform === "win32";
  const result = spawnSync(win ? binary + ".cmd" : binary, args, {
    cwd: root,
    env: { ...process.env, ...env },
    shell: win,
    encoding: "utf8",
    stdio: capture ? "pipe" : "inherit",
  });
  if (result.error)
    throw Error(`Could not start ${binary}: ${result.error.message}`);
  if (!allowFailure && result.status !== 0)
    throw Error(
      `${binary} ${args.slice(0, 3).join(" ")} failed (exit ${result.status}). Fix the error above; do not use --force or --legacy-peer-deps.`,
    );
  return result;
}
const npx = (args, options = {}) => command("npx", ["--yes", ...args], options);
async function backup(file) {
  await fs.mkdir(".build-backups", { recursive: true });
  await fs.copyFile(
    file,
    path.join(".build-backups", `${path.basename(file)}.${Date.now()}.bak`),
  );
}
async function save(file, data) {
  await backup(file);
  await fs.writeFile(file, JSON.stringify(data, null, 2) + "\n");
}
async function moveLocalExpoCache() {
  try {
    await fs.access(".expo");
  } catch {
    return;
  }
  await fs.mkdir(".build-backups", { recursive: true });
  await fs.rename(
    ".expo",
    path.join(".build-backups", "expo-cache-" + Date.now()),
  );
  console.log(
    "Moved disposable .expo device/server history to excluded .build-backups (no app source deleted).",
  );
}
const read = async (file) => JSON.parse(await fs.readFile(file, "utf8"));
async function main() {
  console.log("\nMUSCLE DYNAMICS - guided iPhone cloud build\n");
  const [major, minor] = process.versions.node.split(".").map(Number);
  if (major < 22 || (major === 22 && minor < 13))
    throw Error(
      "Install Node.js 22 LTS, at least 22.13, then reopen the launcher.",
    );
  console.log("Node:", process.version, " | Folder:", root);
  // Avoid requiring Git, avoid initialising repositories in Downloads, and upload only this mobile folder.
  process.env.EAS_NO_VCS = "1";
  process.env.EAS_PROJECT_ROOT = root;
  console.log(
    "Git is NOT required. EAS uses no-VCS mode and the mobile .easignore file.",
  );
  const pkg = await read("package.json");
  if (
    pkg.dependencies.react !== "19.3.0" ||
    pkg.dependencies["react-native"] !== "0.88.0" ||
    !pkg.dependencies.expo?.includes("58.0.16") ||
    !pkg.dependencies["expo-font"]
  )
    throw Error(
      "Dependency files differ from the fixed SDK 58 set. Reapply this mobile update (package.json AND package-lock.json together).",
    );
  for (const dynamic of ["app.config.js", "app.config.ts", "app.config.mjs"]) {
    try {
      await fs.access(dynamic);
    } catch {
      continue;
    }
    throw Error(
      `Found ${dynamic}. This guided updater supports the supplied app.json only; have a developer merge your dynamic config instead of overwriting it.`,
    );
  }
  let app = await read("app.json");
  if (!app.expo) throw Error("app.json must contain an expo object.");
  let changed = false;
  app.expo.plugins ??= [];
  if (
    !app.expo.plugins.some((p) => (Array.isArray(p) ? p[0] : p) === "expo-font")
  ) {
    app.expo.plugins.push("expo-font");
    changed = true;
  }
  if (!checkOnly) {
    let id = app.expo.ios?.bundleIdentifier || "";
    if (!id || id.includes("yourgym")) {
      console.log(
        "Use your own unique Apple bundle identifier; existing non-placeholder identifiers are preserved.",
      );
      id = await ask(
        "Your iOS bundle identifier (for example com.yourbusiness.muscledynamics): ",
      );
      if (
        !/^[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(id) ||
        id.includes("yourgym") ||
        id.includes("yourbusiness")
      )
        throw Error(
          "Enter your actual company-owned bundle identifier, not the example.",
        );
      app.expo.ios = { ...app.expo.ios, bundleIdentifier: id };
      changed = true;
    }
  }
  if (changed) await save("app.json", app);
  let eas;
  try {
    eas = await read("eas.json");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    eas = {};
    await fs.writeFile("eas.json", "{}\n");
  }
  eas.cli = { ...eas.cli, version: ">=25.2.0" };
  eas.build ??= {};
  eas.build.preview = {
    ...eas.build.preview,
    distribution: "internal",
    node: "22.23.3",
  };
  eas.build.testflight = {
    ...eas.build.testflight,
    distribution: "store",
    node: "22.23.3",
  };
  eas.build.testflight.autoIncrement ??= true;
  await save("eas.json", eas);
  if (prepareOnly) {
    await moveLocalExpoCache();
    console.log(
      "Preparation only: configuration preserved/merged; no install, login or build.",
    );
    return;
  }
  console.log(
    "\n1/5 Installing the exact locked dependencies (may take a few minutes).",
  );
  command("npm", ["ci", "--include=dev"]);
  await moveLocalExpoCache();
  console.log(
    "\n2/5 Checking Expo dependency alignment, types and Expo Doctor.",
  );
  npx(["expo", "install", "--check"]);
  command("npm", ["run", "typecheck"]);
  npx([DOCTOR]);
  console.log(
    "\n3/5 Validating the iOS JavaScript/assets bundle (not a signed IPA).",
  );
  npx(["expo", "export", "--platform", "ios", "--output-dir", ".build-check"]);
  const audit = command("npm", ["audit", "--json"], {
    capture: true,
    allowFailure: true,
  });
  let vulnerabilities;
  try {
    vulnerabilities = JSON.parse(audit.stdout).metadata?.vulnerabilities;
  } catch {}
  if (!vulnerabilities)
    throw Error(
      "Could not read npm security audit. Check your network/registry and retry.",
    );
  const findings =
    (vulnerabilities.high || 0) + (vulnerabilities.critical || 0);
  console.log("\nSecurity audit:", JSON.stringify(vulnerabilities));
  if (checkOnly) {
    console.log(
      "\nLocal checks completed. No Expo login, paid build, Apple signing or upload was attempted.",
    );
    if (findings)
      console.log(
        "RELEASE BLOCKER: audit findings remain. Passing build checks does not mean security approval.",
      );
    return;
  }
  if (findings) {
    if (profile !== "preview")
      throw Error(
        "Security audit findings remain. This launcher blocks TestFlight/store distribution until resolved/reviewed by your developer. See ONE-CLICK-README.md.",
      );
    const answer = await ask(
      "Unresolved audit findings: internal device testing ONLY, not production. Continue with a test build? [y/N]: ",
    );
    if (answer.toLowerCase() !== "y")
      throw Error("Build cancelled. No cloud build started.");
  }
  console.log(
    "\n4/5 Expo account and project. Enter credentials ONLY into Expo/Apple prompts.",
  );
  const who = npx([EAS, "whoami"], { capture: true, allowFailure: true });
  if (who.status !== 0) npx([EAS, "login"]);
  else console.log(who.stdout.trim());
  app = await read("app.json");
  if (!app.expo.extra?.eas?.projectId) {
    npx([EAS, "init"]);
    app = await read("app.json");
  }
  if (!app.expo.extra?.eas?.projectId)
    throw Error(
      "Expo project was not linked. Complete eas init before retrying.",
    );
  console.log("Preserving EAS project ID:", app.expo.extra.eas.projectId);
  console.log(
    "Preserving iOS bundle identifier:",
    app.expo.ios?.bundleIdentifier,
  );
  if (profile === "preview") {
    console.log(
      "Internal IPA installs only on registered iPhones. If your iPhone was already registered, choose n.",
    );
    const register = await ask(
      "Register an iPhone now using an EAS registration link? [y/N]: ",
    );
    if (register.toLowerCase() === "y") npx([EAS, "device:create"]);
  }
  console.log(
    "\n5/5 Starting EAS cloud build. Apple Developer signing access and any EAS build charges are your responsibility.",
  );
  console.log(
    "Use the EAS result page to install/download the signed IPA after success. No simulator export is being presented as an IPA.",
  );
  // No readline interface is active while EAS owns its Apple/signing prompts.

  npx([
    EAS,
    "build",
    "--platform",
    "ios",
    "--profile",
    profile,
    "--clear-cache",
  ]);
}
try {
  await main();
} catch (error) {
  console.error("\nSTOP:", error.message);
  process.exitCode = 1;
}
