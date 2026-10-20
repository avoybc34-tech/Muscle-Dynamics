import test from "node:test";
import assert from "node:assert/strict";
import {
  periodFor,
  membershipStatus,
  karachiDay,
  csvCell,
  planSchema,
  accountSchema,
  signupSchema,
} from "../lib/domain.js";
const now = new Date("2026-10-20T12:00:00Z");
test("active same-plan renewal extends the old expiry, retaining original start", () => {
  const m = {
    planId: "one",
    startsAt: "2026-10-01T00:00:00Z",
    endsAt: "2026-11-01T00:00:00Z",
  };
  const p = periodFor(m, "one", 30, now);
  assert.equal(p.startsAt.toISOString(), m.startsAt.replace("Z", ".000Z"));
  assert.equal(p.endsAt.toISOString(), "2026-12-01T00:00:00.000Z");
});
test("expired, cancelled and changed plans start at approval time", () => {
  for (const m of [
    null,
    { planId: "one", endsAt: "2026-09-01" },
    { planId: "one", endsAt: "2026-12-01", cancelledAt: now },
    { planId: "other", endsAt: "2026-12-01" },
  ])
    assert.equal(
      periodFor(m, "one", 30, now).startsAt.toISOString(),
      now.toISOString(),
    );
});
test("membership is expired at exact end, cancellation takes priority", () => {
  assert.equal(membershipStatus({ endsAt: now }, now), "EXPIRED");
  assert.equal(
    membershipStatus({ endsAt: "2027-01-01", cancelledAt: now }, now),
    "CANCELLED",
  );
});
test("attendance date uses Pakistan day boundary", () =>
  assert.equal(karachiDay(new Date("2026-10-20T20:00:00Z")), "2026-10-21"));
test("CSV escapes formulas, quotes and commas", () => {
  assert.equal(csvCell("=1+1"), '"\'=1+1"');
  assert.equal(csvCell('a,"b'), '"a,""b"');
});
test("plan and account validation reject incomplete real setup", () => {
  assert.equal(
    planSchema.safeParse({
      name: "x",
      slug: "xx",
      price: 0,
      durationDays: 30,
      features: ["A"],
    }).success,
    false,
  );
  assert.equal(
    accountSchema.safeParse({ label: "Bank", type: "BANK", active: true })
      .success,
    false,
  );
  assert.equal(
    accountSchema.safeParse({
      label: "Cash",
      type: "CASH",
      active: true,
      note: "Pay at reception",
    }).success,
    true,
  );
});
test("registration requires explicit terms acceptance", () =>
  assert.equal(
    signupSchema.safeParse({
      name: "Member",
      email: "test@example.invalid",
      phone: "03000000000",
      password: "long-test-password",
      acceptTerms: false,
    }).success,
    false,
  ));
