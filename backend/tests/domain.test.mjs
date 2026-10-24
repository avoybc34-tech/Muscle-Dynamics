import test from "node:test";
import assert from "node:assert/strict";
import {
  renewalPeriod,
  membershipView,
  registrationReady,
  planInput,
  preferenceAllows,
} from "../src/domain.mjs";
import { hashPassword, verifyPassword } from "../src/security.mjs";
test("active same-plan renewal extends exactly from existing expiry", () => {
  const old = {
    status: "ACTIVE",
    planId: "p",
    startsAt: new Date("2026-10-01"),
    endsAt: new Date("2026-11-01"),
  };
  assert.equal(
    renewalPeriod(old, { id: "p", durationDays: 30 }, new Date("2026-10-24"))
      .endsAt.toISOString()
      .slice(0, 10),
    "2026-12-01",
  );
});
test("plan changes and expired membership restart on approval", () => {
  const now = new Date("2026-10-24");
  assert.equal(
    renewalPeriod({ status: "EXPIRED" }, { id: "p", durationDays: 30 }, now)
      .startsAt,
    now,
  );
});
test("expired status is computed accurately", () =>
  assert.equal(
    membershipView(
      { status: "ACTIVE", startsAt: "2026-01-01", endsAt: "2026-02-01" },
      new Date("2026-10-24"),
    ).status,
    "EXPIRED",
  ));
test("invalid plans and incomplete registration configuration are rejected", () => {
  assert.equal(registrationReady({}), false);
  assert.equal(planInput.safeParse({ pricePaise: -1 }).success, false);
});
test("push category/global preferences are enforced", () => {
  assert.equal(preferenceAllows({ push: false }, "payments"), false);
  assert.equal(
    preferenceAllows({ push: true, payments: false }, "payments"),
    false,
  );
});
test("password hashing is salted and rejects incorrect passwords", async () => {
  const hash = await hashPassword("Test-password-only");
  assert(await verifyPassword("Test-password-only", hash));
  assert.equal(await verifyPassword("wrong", hash), false);
  assert.notEqual(hash, await hashPassword("Test-password-only"));
});
