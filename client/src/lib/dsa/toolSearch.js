class TrieNode {
  constructor() {
    this.children = new Map();
    this.toolSlugs = new Set();
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(term, toolSlug) {
    let node = this.root;
    for (const character of term.toLowerCase()) {
      if (!node.children.has(character)) node.children.set(character, new TrieNode());
      node = node.children.get(character);
      node.toolSlugs.add(toolSlug);
    }
  }

  suggest(prefix, limit = 6) {
    let node = this.root;
    for (const character of prefix.toLowerCase()) {
      node = node.children.get(character);
      if (!node) return [];
    }
    return [...node.toolSlugs].slice(0, limit);
  }
}

const editDistance = (left, right) => {
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let row = 1; row <= left.length; row += 1) {
    const current = [row];
    for (let column = 1; column <= right.length; column += 1) {
      current[column] = Math.min(
        current[column - 1] + 1,
        previous[column] + 1,
        previous[column - 1] + (left[row - 1] === right[column - 1] ? 0 : 1),
      );
    }
    previous = current;
  }
  return previous[right.length];
};

export const createToolSearchIndex = (tools) => {
  const trie = new Trie();
  const bySlug = new Map();
  const byFilter = new Map();
  for (const tool of tools) {
    bySlug.set(tool.slug, tool);
    trie.insert(tool.name, tool.slug);
    for (const word of tool.name.split(/\s+/)) trie.insert(word, tool.slug);
    if (!byFilter.has(tool.filter)) byFilter.set(tool.filter, []);
    byFilter.get(tool.filter).push(tool);
  }
  return { tools, trie, bySlug, byFilter };
};

const matchesFilter = (tool, filter) =>
  filter === "All Tools" ||
  (filter === "Free Tools" && !tool.isPremium) ||
  (filter === "Premium Tools" && tool.isPremium) ||
  tool.filter === filter;

export const searchTools = (index, query, filter = "All Tools") => {
  const normalized = query.trim().toLowerCase();
  const candidates = index.byFilter.get(filter) || index.tools;
  if (!normalized) return candidates.filter((tool) => matchesFilter(tool, filter));

  return candidates
    .filter((tool) => matchesFilter(tool, filter))
    .map((tool) => {
      const name = tool.name.toLowerCase();
      const description = tool.description.toLowerCase();
      const words = name.split(/\s+/);
      let score = 0;
      if (name === normalized) score += 100;
      if (name.startsWith(normalized)) score += 70;
      if (name.includes(normalized)) score += 45;
      if (description.includes(normalized)) score += 20;
      const distance = Math.min(...words.map((word) => editDistance(normalized, word)));
      if (distance <= Math.max(1, Math.floor(normalized.length / 3))) score += 25 - distance * 5;
      return { tool, score };
    })
    .filter((result) => result.score > 0)
    .sort((left, right) => right.score - left.score)
    .map((result) => result.tool);
};

export const suggestTools = (index, query, limit = 6) => {
  const normalized = query.trim();
  if (!normalized) return [];
  return index.trie
    .suggest(normalized.split(/\s+/).at(-1), limit)
    .map((slug) => index.bySlug.get(slug))
    .filter(Boolean);
};
