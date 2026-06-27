const WORD_PATTERN = /[\p{L}\p{N}][\p{L}\p{N}+#.-]*/gu;

export const tokenize = (text) =>
  (String(text || "").toLowerCase().match(WORD_PATTERN) || [])
    .map((word) => word.replace(/^[.-]+|[.-]+$/g, ""))
    .filter(Boolean);

export const wordFrequency = (text, { ignore = [] } = {}) => {
  const ignored = new Set(ignore.map((word) => word.toLowerCase()));
  const counts = new Map();
  for (const word of tokenize(text)) {
    if (!ignored.has(word)) counts.set(word, (counts.get(word) || 0) + 1);
  }
  return counts;
};

// Sliding n-gram windows expose repeated phrases without quadratic comparisons.
export const repeatedPhrases = (text, windowSize = 3, minimumCount = 2) => {
  const words = tokenize(text);
  const counts = new Map();
  for (let index = 0; index + windowSize <= words.length; index += 1) {
    const phrase = words.slice(index, index + windowSize).join(" ");
    counts.set(phrase, (counts.get(phrase) || 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count >= minimumCount)
    .sort((left, right) => right[1] - left[1]);
};

export const chunkText = (
  text,
  { maxCharacters = 6000, overlapCharacters = 300 } = {},
) => {
  const normalized = String(text || "").replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];
  if (maxCharacters < 100) throw new RangeError("Chunk size is too small.");
  const overlap = Math.min(Math.max(0, overlapCharacters), maxCharacters - 1);
  const chunks = [];
  let start = 0;

  while (start < normalized.length) {
    let end = Math.min(start + maxCharacters, normalized.length);
    if (end < normalized.length) {
      const boundary = Math.max(
        normalized.lastIndexOf("\n", end),
        normalized.lastIndexOf(". ", end),
        normalized.lastIndexOf(" ", end),
      );
      if (boundary > start + Math.floor(maxCharacters * 0.6)) end = boundary + 1;
    }
    chunks.push(normalized.slice(start, end).trim());
    if (end >= normalized.length) break;
    start = Math.max(start + 1, end - overlap);
  }
  return chunks;
};
