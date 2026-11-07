import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { format, formats } from "./src/format.mjs";

const SRC = "src";

test("json is reachable through the on-demand loader", async () => {
  assert.equal(await format("json", { a: 1 }), '{"a":1}');
});

test("formats lists exactly the names that load", async () => {
  const loadable = fs
    .readdirSync(path.join(SRC, "formats"))
    .filter((f) => f.endsWith(".mjs"))
    .map((f) => f.replace(/\.mjs$/, ""))
    .sort();
  assert.deepEqual([...formats].sort(), loadable);
});

test("an unknown name is a TypeError naming only loadable formats", async () => {
  let message = "";
  await assert.rejects(
    () => format("nope", "x"),
    (err) => {
      assert.ok(err instanceof TypeError, "expected TypeError");
      message = err.message;
      return true;
    }
  );
  for (const name of formats) assert.ok(message.includes(name), `message omits ${name}`);
  const named = message.match(/[a-z]+/g) || [];
  for (const word of named) {
    if (["plain", "csv", "json", "yaml"].includes(word)) {
      assert.ok(formats.includes(word), `message advertises "${word}" which is not supported`);
    }
  }
});

test("every advertised format can actually be called", async () => {
  for (const name of formats) {
    const out = await format(name, name === "csv" ? ["x"] : name === "json" ? {} : "x");
    assert.equal(typeof out, "string", `${name} did not return a string`);
  }
});

test("plain wraps on spaces and never splits a word", async () => {
  assert.equal(await format("plain", "alpha beta gamma delta", { width: 11 }), "alpha beta\ngamma delta");
  assert.equal(await format("plain", "abcdefgh ij", { width: 4 }), "abcdefgh\nij");
});

test("plain defaults to 72 columns", async () => {
  const lines = (await format("plain", "x ".repeat(80).trim())).split("\n");
  assert.ok(lines.every((l) => l.length <= 72));
});

test("csv quotes commas, quotes and newlines", async () => {
  assert.equal(await format("csv", ["plain", "a,b", 'say "hi"', "two\nlines"]),
    'plain,"a,b","say ""hi""","two\nlines"');
});

test("json honours indent", async () => {
  assert.equal(await format("json", { a: 1 }, { indent: 2 }), '{\n  "a": 1\n}');
  assert.equal(await format("json", [1, 2], { indent: 0 }), "[1,2]");
});

test("the retired v1 entry point is gone", () => {
  assert.equal(fs.existsSync(path.join(SRC, "legacy.mjs")), false, "src/legacy.mjs still exists");
});

test("no dead v1 symbol survives anywhere in src", () => {
  const hits = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name.endsWith(".mjs")) {
        const text = fs.readFileSync(p, "utf8");
        if (/formatLegacy|LEGACY_VERSION/.test(text)) hits.push(p);
      }
    }
  };
  walk(SRC);
  assert.deepEqual(hits, []);
});
