import { Graph } from "./graph.js";
import { PriorityQueue } from "./priorityQueue.js";
import { cosineSimilarity } from "./similarity.js";
import { chunkText, tokenize, wordFrequency } from "./textAnalysis.js";

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "to", "of", "in", "on", "for",
  "is", "are", "was", "were", "be", "been", "with", "that", "this", "as",
  "at", "by", "from", "it", "its", "we", "you", "they", "their",
]);

export const rankImportantSentences = (text, limit = 20) => {
  const frequencies = wordFrequency(text, { ignore: [...STOP_WORDS] });
  const sentences = String(text || "")
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 30);
  const heap = new PriorityQueue();
  for (const [index, sentence] of sentences.entries()) {
    const words = tokenize(sentence).filter((word) => !STOP_WORDS.has(word));
    if (!words.length) continue;
    const relevance = words.reduce((sum, word) => sum + (frequencies.get(word) || 0), 0) / words.length;
    const positionBonus = index < 5 ? 2 : 0;
    heap.enqueue({ sentence, index, priority: relevance + positionBonus });
  }
  const selected = [];
  while (heap.size && selected.length < limit) selected.push(heap.dequeue());
  return selected.sort((left, right) => left.index - right.index).map((item) => item.sentence);
};

export const retrieveRelevantChunks = (text, query, limit = 4) => {
  const chunks = chunkText(text, { maxCharacters: 4500, overlapCharacters: 300 });
  const heap = new PriorityQueue();
  for (const [index, chunk] of chunks.entries()) {
    heap.enqueue({ chunk, index, priority: cosineSimilarity(query, chunk) });
  }
  const matches = [];
  while (heap.size && matches.length < limit) matches.push(heap.dequeue());
  return matches;
};

export const buildTopicMap = (text, limit = 8) => {
  const topics = [...wordFrequency(text, { ignore: [...STOP_WORDS] }).entries()]
    .filter(([word]) => word.length > 3)
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([word]) => word);
  const graph = new Graph();
  graph.addVertex("document");
  for (const topic of topics) graph.addEdge("document", topic);
  return { topics, breadthFirst: graph.bfs("document") };
};

export const prepareDocumentContext = (text) => {
  const important = rankImportantSentences(text, 24);
  const topicMap = buildTopicMap(text);
  return {
    context: important.join("\n"),
    topicMap,
    sourceCharacters: String(text || "").length,
  };
};
