import test from "node:test";
import assert from "node:assert/strict";
import { format } from "../src/format.mjs";

test("plain keeps words whole and wraps at the width", async () => {
  assert.equal(await format("plain", "alpha beta gamma delta", { width: 11 }), "alpha beta\ngamma delta");
});

test("plain defaults to 72 columns", async () => {
  const text = "x ".repeat(50).trim();
  const lines = (await format("plain", text)).split("\n");
  assert.ok(lines.every((line) => line.length <= 72));
});

test("csv quotes what needs quoting", async () => {
  assert.equal(await format("csv", ["plain", 'a,b', 'say "hi"']), 'plain,"a,b","say ""hi"""');
});

test("csv accepts a single value", async () => {
  assert.equal(await format("csv", "alone"), "alone");
});
