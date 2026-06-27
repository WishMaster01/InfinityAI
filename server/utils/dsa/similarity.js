import { tokenize, wordFrequency } from "./textAnalysis.js";

export const buildKmpTable = (pattern) => {
  const table = Array(pattern.length).fill(0);
  for (let index = 1, prefix = 0; index < pattern.length; ) {
    if (pattern[index] === pattern[prefix]) table[index++] = ++prefix;
    else if (prefix) prefix = table[prefix - 1];
    else index += 1;
  }
  return table;
};

export const kmpSearch = (text, pattern) => {
  const source = String(text || "").toLowerCase();
  const target = String(pattern || "").toLowerCase();
  if (!target) return 0;
  const table = buildKmpTable(target);
  for (let sourceIndex = 0, targetIndex = 0; sourceIndex < source.length; ) {
    if (source[sourceIndex] === target[targetIndex]) {
      sourceIndex += 1;
      targetIndex += 1;
      if (targetIndex === target.length) return sourceIndex - targetIndex;
    } else if (targetIndex) targetIndex = table[targetIndex - 1];
    else sourceIndex += 1;
  }
  return -1;
};

export const cosineSimilarity = (left, right) => {
  const leftCounts = wordFrequency(left);
  const rightCounts = wordFrequency(right);
  let dotProduct = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;
  for (const count of leftCounts.values()) leftMagnitude += count * count;
  for (const [word, count] of rightCounts) {
    rightMagnitude += count * count;
    dotProduct += count * (leftCounts.get(word) || 0);
  }
  if (!leftMagnitude || !rightMagnitude) return 0;
  return dotProduct / Math.sqrt(leftMagnitude * rightMagnitude);
};

// Memory-optimized LCS is suitable for comparing rewritten paragraphs.
export const lcsSimilarity = (left, right) => {
  let a = tokenize(left);
  let b = tokenize(right);
  if (a.length < b.length) [a, b] = [b, a];
  let previous = Array(b.length + 1).fill(0);
  for (let row = 1; row <= a.length; row += 1) {
    const current = Array(b.length + 1).fill(0);
    for (let column = 1; column <= b.length; column += 1) {
      current[column] =
        a[row - 1] === b[column - 1]
          ? previous[column - 1] + 1
          : Math.max(previous[column], current[column - 1]);
    }
    previous = current;
  }
  const denominator = Math.max(a.length, b.length);
  return denominator ? previous[b.length] / denominator : 1;
};
