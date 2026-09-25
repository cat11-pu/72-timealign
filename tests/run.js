import assert from "node:assert";
import { align } from "../grid.js";
import { fill } from "../fill.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

const points = [{ t: 0, v: 1 }, { t: 3, v: 4 }];

check("align returns grid", () => {
  assert.ok(Array.isArray(align(points, 2, 0).grid));
});

check("align reports buckets", () => {
  assert.strictEqual(typeof align(points, 2, 0).buckets, "number");
});

check("fill returns values", () => {
  assert.ok(Array.isArray(fill(points, [0, 2], "hold").values));
});

check("fill reports gaps", () => {
  assert.ok(Array.isArray(fill(points, [0, 2], "hold").gaps));
});

check("render exposes idempotent flag", () => {
  assert.strictEqual(typeof render({ points: points, step: 2, origin: 0, mode: "hold" }).idempotent, "boolean");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
