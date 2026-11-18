const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "challenges.js"), "utf8");
const context = {};
vm.runInNewContext(source + "\nglobalThis.__challengeCatalogue = challenges;", context);
const challenges = context.__challengeCatalogue;

const knownSkills = new Set([
  "basics", "strings", "arrays", "objects", "recursion", "algorithms", "graphs", "dynamic-programming"
]);

test("challenge catalogue is non-empty and uses unique identifiers", () => {
  assert.ok(challenges.length >= 25);
  const ids = challenges.map((challenge) => challenge.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("every challenge references a known skill and has a starter function", () => {
  for (const challenge of challenges) {
    assert.ok(knownSkills.has(challenge.skill), `unknown skill: ${challenge.skill}`);
    assert.ok(challenge.title && challenge.desc);
    assert.ok(Array.isArray(challenge.tests) && challenge.tests.length >= 2);
    const match = challenge.starter.match(/function\s+([A-Za-z_$][\w$]*)\s*\(/);
    assert.ok(match, `missing starter function for ${challenge.id}`);
    assert.ok(challenge.tests.every((caseItem) =>
      Array.isArray(caseItem.input) && Object.prototype.hasOwnProperty.call(caseItem, "expected")
    ));
  }
});

test("new algorithm and graph topics are included", () => {
  const ids = new Set(challenges.map((challenge) => challenge.id));
  for (const id of [
    "binary-search", "two-sum", "merge-sorted-arrays",
    "valid-parentheses", "longest-unique-substring",
    "breadth-first-search", "connected-components", "dijkstra-shortest-path",
    "lexicographic-topological-sort", "minimum-coin-change",
    "longest-increasing-subsequence", "edit-distance"
  ]) {
    assert.ok(ids.has(id), `missing challenge: ${id}`);
  }
});

test("all test cases are JSON serializable for worker messaging", () => {
  for (const challenge of challenges) {
    for (const caseItem of challenge.tests) {
      assert.doesNotThrow(() => JSON.stringify(caseItem.input));
      assert.doesNotThrow(() => JSON.stringify(caseItem.expected));
    }
  }
});
