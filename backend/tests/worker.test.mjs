import test from "node:test";
import assert from "node:assert/strict";
import { tick } from "../src/worker.mjs";
test("membership reminders paginate beyond 500 and remain idempotent", async () => {
  const rows = Array.from({ length: 501 }, (_, i) => ({
      id: String(i).padStart(5, "0"),
      userId: "test-" + i,
      planName: "TEST",
      endsAt: new Date(Date.now() + 6.5 * 86400000),
    })),
    seen = new Map();
  let pages = 0;
  const db = {
    membership: {
      findMany: async ({ where, take }) => {
        if (!where.endsAt.gt) return [];
        pages++;
        return rows
          .filter((x) => !where.id || x.id > where.id.gt)
          .slice(0, take);
      },
    },
    notification: {
      upsert: async ({ where, create }) => {
        if (!seen.has(where.eventKey))
          seen.set(where.eventKey, { ...create, id: String(seen.size) });
        return seen.get(where.eventKey);
      },
    },
    pushJob: {
      upsert: async () => ({}),
      updateMany: async () => ({ count: 0 }),
    },
  };
  const previous = process.env.PUSH_ENABLED;
  process.env.PUSH_ENABLED = "false";
  try {
    await tick(db);
    assert.equal(seen.size, 501);
    assert.equal(pages, 2);
    await tick(db);
    assert.equal(seen.size, 501);
    assert.equal(pages, 4);
    await tick(db, fetch, () => true);
    assert.equal(pages, 4);
  } finally {
    if (previous === undefined) delete process.env.PUSH_ENABLED;
    else process.env.PUSH_ENABLED = previous;
  }
});
test("expiry compare-and-set cannot overwrite a concurrently renewed period", async () => {
  const past = new Date(Date.now() - 1000);
  let checked = false;
  const db = {
    membership: {
      findMany: async ({ where }) =>
        where.endsAt.gt ? [] : [{ id: "test-stale", endsAt: past }],
    },
    pushJob: { updateMany: async () => ({ count: 0 }) },
    $transaction: async (fn) =>
      fn({
        membership: {
          updateMany: async ({ where }) => {
            assert.equal(where.endsAt, past);
            checked = true;
            return { count: 0 };
          },
        },
      }),
  };
  const previous = process.env.PUSH_ENABLED;
  process.env.PUSH_ENABLED = "false";
  try {
    await tick(db);
    assert(checked);
  } finally {
    if (previous === undefined) delete process.env.PUSH_ENABLED;
    else process.env.PUSH_ENABLED = previous;
  }
});
