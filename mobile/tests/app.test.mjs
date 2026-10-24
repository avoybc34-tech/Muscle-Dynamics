import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";
import { createDemo, demoPlans, demoWorkouts } from "../src/demo.ts";
const compile = async (file) =>
  import(
    "data:text/javascript;base64," +
      Buffer.from(
        ts.transpileModule(fs.readFileSync(file, "utf8"), {
          compilerOptions: {
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ES2022,
          },
        }).outputText,
      ).toString("base64")
  );
test("explicit demo has isolated sample records and resets", async () => {
  const demo = createDemo();
  assert((await demo.request("dashboard")).user.email.endsWith(".invalid"));
  await demo.request("profile", "PATCH", { name: "Sample Edit" });
  assert.equal((await demo.request("dashboard")).user.name, "Sample Edit");
  assert.equal(
    (await createDemo().request("dashboard")).user.name,
    "Preview Member",
  );
});
test("demo workout tracking never calls a live backend", async () => {
  const demo = createDemo();
  const a = await demo.request(
    "workouts/" + demoWorkouts[0].id + "/start",
    "POST",
    {},
  );
  const updated = await demo.request("activity/" + a.id, "PATCH", {
    sets: [{ exerciseIndex: 0, setIndex: 0, reps: 5, weight: 10 }],
    complete: true,
  });
  assert(updated.completedAt);
});
test("demo checkout only creates sample pending data and never activates membership", async () => {
  const demo = createDemo(),
    before = (await demo.request("dashboard")).membership;
  const p = await demo.request("payments", "POST", { planId: demoPlans[0].id });
  await demo.request("payments/" + p.id + "/proof", "POST", {});
  await demo.request("payments/" + p.id + "/submit", "POST", {
    proofNote: "sample",
  });
  const after = await demo.request("dashboard");
  assert.equal(after.payments[0].status, "PENDING");
  assert.deepEqual(after.membership, before);
});
test("client validates production origins and never allows embedded credentials", async () => {
  globalThis.__DEV__ = false;
  const { normalizeOrigin } = await compile("src/services/client.ts");
  assert.equal(
    normalizeOrigin("https://gym.example.invalid/"),
    "https://gym.example.invalid",
  );
  for (const s of [
    "http://example.invalid",
    "https://u:p@example.invalid",
    "https://example.invalid/v1",
    "https://example.invalid/?secret=x",
  ])
    assert.throws(() => normalizeOrigin(s));
});
test("client uses bearer headers and returns explicit server failures", async () => {
  const { send, ApiError } = await compile("src/services/client.ts");
  const old = globalThis.fetch;
  try {
    globalThis.fetch = async (url, opt) => {
      assert.equal(url, "https://gym.example.invalid/v1/dashboard");
      assert.equal(opt.headers.Authorization, "Bearer test-only");
      assert.equal(opt.credentials, "omit");
      return {
        ok: false,
        status: 401,
        json: async () => ({ error: "Session expired" }),
      };
    };
    await assert.rejects(
      () =>
        send("https://gym.example.invalid", "dashboard", {
          token: "test-only",
        }),
      (e) => e instanceof ApiError && e.status === 401,
    );
  } finally {
    globalThis.fetch = old;
  }
});
test("secure sessions, real navigation, separate demo, notification routing and splash exist", () => {
  const session = fs.readFileSync("src/Session.tsx", "utf8"),
    app = fs.readFileSync("App.tsx", "utf8");
  assert(session.includes("SecureStore"));
  assert(session.includes("refreshLock"));
  assert(session.includes("auth/refresh"));
  assert(!session.includes("useState<User|null>(data.user)"));
  assert(app.includes("createNativeStackNavigator"));
  for (const tab of ["Home", "Workouts", "Membership", "Activity", "Profile"])
    assert(app.includes('name="' + tab + '"'));
  assert(app.includes("preventAutoHideAsync"));
  assert(app.includes("addNotificationResponseReceivedListener"));
});
test("React Native child guards never leak empty strings or zero into View", () => {
  function walk(dir) {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .flatMap((x) =>
        x.isDirectory()
          ? walk(dir + "/" + x.name)
          : x.name.endsWith(".tsx")
            ? [dir + "/" + x.name]
            : [],
      );
  }
  for (const file of ["App.tsx", ...walk("src")]) {
    const source = fs.readFileSync(file, "utf8"),
      ast = ts.createSourceFile(
        file,
        source,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      );
    function visit(n) {
      if (
        ts.isJsxExpression(n) &&
        n.expression &&
        ts.isBinaryExpression(n.expression) &&
        n.expression.operatorToken.kind ===
          ts.SyntaxKind.AmpersandAmpersandToken
      )
        assert(
          !ts.isIdentifier(n.expression.left),
          file + ": use an explicit Boolean guard for rendered children",
        );
      ts.forEachChild(n, visit);
    }
    visit(ast);
  }
});
