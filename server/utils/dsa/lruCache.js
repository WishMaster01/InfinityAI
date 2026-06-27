export class LruCache {
  constructor({ capacity = 100, ttlMs = 15 * 60 * 1000 } = {}) {
    this.capacity = Math.max(1, capacity);
    this.ttlMs = Math.max(0, ttlMs);
    this.cache = new Map();
  }

  get size() {
    return this.cache.size;
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt && entry.expiresAt <= Date.now()) {
      this.cache.delete(key);
      return undefined;
    }
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.value;
  }

  set(key, value) {
    this.cache.delete(key);
    this.cache.set(key, {
      value,
      expiresAt: this.ttlMs ? Date.now() + this.ttlMs : 0,
    });
    while (this.cache.size > this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
    return value;
  }

  has(key) {
    return this.get(key) !== undefined;
  }

  clear() {
    this.cache.clear();
  }
}
