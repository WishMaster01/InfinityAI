import { PriorityQueue } from "./priorityQueue.js";

export class Queue {
  constructor() {
    this.items = new Map();
    this.head = 0;
    this.tail = 0;
  }

  get size() {
    return this.tail - this.head;
  }

  enqueue(value) {
    this.items.set(this.tail++, value);
  }

  dequeue() {
    if (!this.size) return undefined;
    const value = this.items.get(this.head);
    this.items.delete(this.head++);
    return value;
  }
}

// Bounded concurrency protects external providers; the heap gives paid plans
// lower latency without starving older jobs at the same plan level.
export class AsyncPriorityQueue {
  constructor({ concurrency = 2, maxSize = 100 } = {}) {
    this.concurrency = Math.max(1, concurrency);
    this.maxSize = Math.max(1, maxSize);
    this.active = 0;
    this.sequence = 0;
    this.pending = new PriorityQueue(
      (left, right) =>
        left.priority - right.priority || right.sequence - left.sequence,
    );
  }

  get stats() {
    return { active: this.active, pending: this.pending.size };
  }

  add(task, { priority = 0 } = {}) {
    if (typeof task !== "function") {
      return Promise.reject(new TypeError("Queue task must be a function."));
    }
    if (this.pending.size >= this.maxSize) {
      const error = new Error("AI processing queue is full. Try again shortly.");
      error.statusCode = 503;
      error.code = "QUEUE_FULL";
      return Promise.reject(error);
    }

    return new Promise((resolve, reject) => {
      this.pending.enqueue({
        task,
        priority,
        sequence: this.sequence++,
        resolve,
        reject,
      });
      queueMicrotask(() => this.#drain());
    });
  }

  #drain() {
    while (this.active < this.concurrency && this.pending.size) {
      const job = this.pending.dequeue();
      this.active += 1;
      Promise.resolve()
        .then(job.task)
        .then(job.resolve, job.reject)
        .finally(() => {
          this.active -= 1;
          this.#drain();
        });
    }
  }
}
