import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
const script = new URL("../build-ios.mjs", import.meta.url);
async function fixture(fn) {
  const root = await fs.mkdtemp(
    path.join(os.tmpdir(), "muscle dynamics build "),
  );
  try {
    await fs.mkdir(path.join(root, "scripts"));
    await fs.copyFile(script, path.join(root, "scripts", "build-ios.mjs"));
    await fs.writeFile(
      path.join(root, "package.json"),
      JSON.stringify({
        dependencies: {
          expo: "~58.0.16",
          react: "19.3.0",
          "react-native": "0.88.0",
          "expo-font": "~58.0.9",
        },
      }),
    );
    await fs.writeFile(
      path.join(root, "app.json"),
      JSON.stringify({
        expo: {
          name: "Custom gym name",
          ios: { bundleIdentifier: "com.fixture.gym" },
          android: { package: "com.fixture.android" },
          plugins: ["expo-secure-store"],
          extra: {
            eas: { projectId: "fixture-project-not-used-for-a-build" },
            custom: "keep this",
          },
        },
      }),
    );
    await fs.writeFile(
      path.join(root, "eas.json"),
      JSON.stringify({
        build: {
          preview: {
            env: { EXPO_PUBLIC_API_URL: "https://fixture.example.invalid" },
            ios: { resourceClass: "medium" },
          },
          production: { channel: "keep-custom-profile" },
        },
      }),
    );
    await fn(root);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
}
const prepare = (root) =>
  spawnSync(
    process.execPath,
    [path.join(root, "scripts", "build-ios.mjs"), "--prepare-only"],
    { encoding: "utf8" },
  );
test("preparation preserves existing bundle ID, project ID, public URL and custom profiles in a path with spaces", async () =>
  fixture(async (root) => {
    const r = prepare(root);
    assert.equal(r.status, 0, r.stdout + r.stderr);
    const app = JSON.parse(await fs.readFile(path.join(root, "app.json")));
    const eas = JSON.parse(await fs.readFile(path.join(root, "eas.json")));
    assert.equal(app.expo.ios.bundleIdentifier, "com.fixture.gym");
    assert.equal(
      app.expo.extra.eas.projectId,
      "fixture-project-not-used-for-a-build",
    );
    assert.equal(app.expo.extra.custom, "keep this");
    assert(app.expo.plugins.includes("expo-font"));
    assert.equal(
      eas.build.preview.env.EXPO_PUBLIC_API_URL,
      "https://fixture.example.invalid",
    );
    assert.equal(eas.build.preview.ios.resourceClass, "medium");
    assert.equal(eas.build.production.channel, "keep-custom-profile");
    assert.equal(eas.build.preview.node, "22.23.3");
  }));
test("preparation backs up local Expo cache and never reads or replaces .env", async () =>
  fixture(async (root) => {
    await fs.mkdir(path.join(root, ".expo"));
    await fs.writeFile(
      path.join(root, ".expo", "devices.json"),
      "local-device-fixture",
    );
    await fs.writeFile(
      path.join(root, ".env"),
      "EXPO_PUBLIC_API_URL=https://private-fixture.example.invalid\n",
    );
    const r = prepare(root);
    assert.equal(r.status, 0, r.stdout + r.stderr);
    await assert.rejects(fs.access(path.join(root, ".expo")));
    assert(
      (await fs.readdir(path.join(root, ".build-backups"))).some((name) =>
        name.startsWith("expo-cache-"),
      ),
    );
    assert.equal(
      await fs.readFile(path.join(root, ".env"), "utf8"),
      "EXPO_PUBLIC_API_URL=https://private-fixture.example.invalid\n",
    );
  }));
test("incompatible React Native downgrade stops before installs or cloud calls", async () =>
  fixture(async (root) => {
    const file = path.join(root, "package.json");
    const p = JSON.parse(await fs.readFile(file));
    p.dependencies["react-native"] = "^0.72.17";
    await fs.writeFile(file, JSON.stringify(p));
    const r = prepare(root);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /Dependency files differ/);
  }));
test("dynamic config is not silently overwritten", async () =>
  fixture(async (root) => {
    await fs.writeFile(path.join(root, "app.config.js"), "export default {};");
    const r = prepare(root);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /dynamic config/);
  }));
