export class PriorityQueue {
  constructor(compare = (left, right) => left.priority - right.priority) {
    this.items = [];
    this.compare = compare;
  }

  get size() {
    return this.items.length;
  }

  peek() {
    return this.items[0];
  }

  enqueue(value) {
    this.items.push(value);
    this.#bubbleUp(this.items.length - 1);
    return this;
  }

  dequeue() {
    if (!this.items.length) return undefined;
    const first = this.items[0];
    const last = this.items.pop();
    if (this.items.length) {
      this.items[0] = last;
      this.#sinkDown(0);
    }
    return first;
  }

  #bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.compare(this.items[index], this.items[parent]) <= 0) break;
      [this.items[index], this.items[parent]] = [
        this.items[parent],
        this.items[index],
      ];
      index = parent;
    }
  }

  #sinkDown(index) {
    while (true) {
      const left = index * 2 + 1;
      const right = left + 1;
      let best = index;

      if (
        left < this.items.length &&
        this.compare(this.items[left], this.items[best]) > 0
      ) {
        best = left;
      }
      if (
        right < this.items.length &&
        this.compare(this.items[right], this.items[best]) > 0
      ) {
        best = right;
      }
      if (best === index) break;
      [this.items[index], this.items[best]] = [
        this.items[best],
        this.items[index],
      ];
      index = best;
    }
  }
}
