const normalize = (value) => String(value || "").trim().toLowerCase();

class TrieNode {
  constructor() {
    this.children = new Map();
    this.values = new Set();
  }
}

export class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(term, value = term) {
    const normalized = normalize(term);
    if (!normalized) return;
    let node = this.root;
    for (const character of normalized) {
      if (!node.children.has(character)) {
        node.children.set(character, new TrieNode());
      }
      node = node.children.get(character);
      node.values.add(value);
    }
  }

  suggest(prefix, limit = 8) {
    let node = this.root;
    for (const character of normalize(prefix)) {
      node = node.children.get(character);
      if (!node) return [];
    }
    return [...node.values].slice(0, Math.max(0, limit));
  }
}
