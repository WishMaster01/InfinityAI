import test from "node:test";
import assert from "node:assert/strict";
import { Graph } from "../utils/dsa/graph.js";
import { LruCache } from "../utils/dsa/lruCache.js";
import { AsyncPriorityQueue, Queue } from "../utils/dsa/queue.js";
import { TokenBucketStore } from "../utils/dsa/rateLimiter.js";
import { scoreResume } from "../utils/dsa/scoring.js";
import { cosineSimilarity, kmpSearch, lcsSimilarity } from "../utils/dsa/similarity.js";
import { chunkText, repeatedPhrases, wordFrequency } from "../utils/dsa/textAnalysis.js";
import { Trie } from "../utils/dsa/trie.js";
import { analyzeCode, validateDelimiters } from "../utils/dsa/codeIntelligence.js";
import { buildTopicMap, retrieveRelevantChunks } from "../utils/dsa/documentIntelligence.js";
import { buildReviewSchedule } from "../utils/dsa/spacedRepetition.js";
import { tools } from "../config/tools.js";
import { getWorkflow } from "../config/toolWorkflows.js";

test("Trie returns prefix suggestions", () => {
  const trie = new Trie();
  trie.insert("Resume Review", "resume-review-ai");
  trie.insert("Resume Builder", "resume-builder");
  assert.deepEqual(trie.suggest("res"), ["resume-review-ai", "resume-builder"]);
});

test("queue preserves FIFO order", () => {
  const queue = new Queue();
  queue.enqueue("first");
  queue.enqueue("second");
  assert.equal(queue.dequeue(), "first");
  assert.equal(queue.dequeue(), "second");
});

test("async queue prioritizes a paid job over an already pending basic job", async () => {
  const queue = new AsyncPriorityQueue({ concurrency: 1 });
  const order = [];
  let release;
  const blocker = queue.add(
    () => new Promise((resolve) => {
      release = () => {
        order.push("active");
        resolve();
      };
    }),
  );
  await new Promise((resolve) => setImmediate(resolve));
  const basic = queue.add(() => order.push("basic"), { priority: 0 });
  const pro = queue.add(() => order.push("pro"), { priority: 2 });
  release();
  await Promise.all([blocker, basic, pro]);
  assert.deepEqual(order, ["active", "pro", "basic"]);
});

test("LRU evicts the least recently used entry and expires TTL", () => {
  const cache = new LruCache({ capacity: 2, ttlMs: 0 });
  cache.set("a", 1);
  cache.set("b", 2);
  cache.get("a");
  cache.set("c", 3);
  assert.equal(cache.get("b"), undefined);
  assert.equal(cache.get("a"), 1);
});

test("text analysis chunks safely and counts repeated windows", () => {
  const text = "alpha beta gamma. alpha beta gamma. delta epsilon zeta.";
  const chunks = chunkText(text.repeat(20), { maxCharacters: 120, overlapCharacters: 10 });
  assert.ok(chunks.length > 1);
  assert.ok(chunks.every((chunk) => chunk.length <= 120));
  assert.equal(wordFrequency(text).get("alpha"), 2);
  assert.deepEqual(repeatedPhrases(text, 3, 2)[0], ["alpha beta gamma", 2]);
});

test("string matching and similarity algorithms return stable scores", () => {
  assert.equal(kmpSearch("Senior TypeScript Engineer", "typescript"), 7);
  assert.equal(cosineSimilarity("react node", "react node"), 1);
  assert.equal(lcsSimilarity("write clean tested code", "write tested code"), 0.75);
});

test("graph supports traversal and dependency ordering", () => {
  const graph = new Graph();
  graph.addEdge("auth", "api").addEdge("api", "ui");
  assert.deepEqual(graph.bfs("auth"), ["auth", "api", "ui"]);
  assert.deepEqual(graph.dfs("auth"), ["auth", "api", "ui"]);
  assert.deepEqual(graph.topologicalSort(), ["auth", "api", "ui"]);
});

test("token bucket enforces capacity and refills over time", () => {
  let now = 0;
  const store = new TokenBucketStore({ now: () => now });
  const limits = { capacity: 2, refillPerSecond: 1 };
  assert.equal(store.consume("user", limits).allowed, true);
  assert.equal(store.consume("user", limits).allowed, true);
  assert.equal(store.consume("user", limits).allowed, false);
  now = 1000;
  assert.equal(store.consume("user", limits).allowed, true);
});

test("ATS scoring matches required skills and ranks missing skills", () => {
  const resume = `Jane Doe jane@example.com\nSummary\nReact engineer\nExperience\nBuilt APIs\nEducation\nBSc\nSkills\nReact, JavaScript`;
  const analysis = scoreResume(resume, "Seeking React, JavaScript, TypeScript, and AWS skills");
  assert.deepEqual(analysis.matchedSkills, ["javascript", "react"]);
  assert.deepEqual(analysis.missingSkills, ["typescript", "aws"]);
  assert.match(analysis.suggestions[0], /typescript, aws/i);
  assert.ok(analysis.score > 0 && analysis.score <= 100);
});

test("every catalog tool has a runnable route and workflow", () => {
  assert.equal(tools.length, 54);
  assert.ok(tools.every((tool) => tool.path));
  assert.ok(tools.every((tool) => getWorkflow(tool).kind));
});

test("code intelligence parses AST structure, dependencies, routes, and complexity", () => {
  const source = `import express from "express";\nfunction handler(req, res) { if (req.user) return res.json({ ok: true }); }\napp.get("/health", handler);`;
  const analysis = analyzeCode(source);
  assert.equal(analysis.parseError, null);
  assert.deepEqual(analysis.imports, ["express"]);
  assert.deepEqual(analysis.functions, ["handler"]);
  assert.deepEqual(analysis.routes, [{ method: "GET", path: "/health" }]);
  assert.equal(analysis.cyclomaticComplexity, 2);
  assert.equal(validateDelimiters("const value = '{ignored}';").valid, true);
});

test("document intelligence retrieves relevant chunks and builds a topic graph", () => {
  const text = `${"React components render user interfaces. ".repeat(120)}${"PostgreSQL stores relational application data. ".repeat(120)}`;
  const matches = retrieveRelevantChunks(text, "database PostgreSQL", 2);
  assert.match(matches[0].chunk, /PostgreSQL/);
  const topics = buildTopicMap(text, 4);
  assert.equal(topics.breadthFirst[0], "document");
  assert.ok(topics.topics.includes("react") || topics.topics.includes("postgresql"));
});

test("spaced repetition produces increasing review intervals", () => {
  const schedule = buildReviewSchedule({ cards: 12, start: new Date("2026-01-01T00:00:00Z") });
  assert.deepEqual(schedule.map((item) => item.intervalDays), [1, 3, 7, 14, 30]);
  assert.equal(schedule[0].cards, 12);
});
