import { Queue } from "./queue.js";

export class Graph {
  constructor() {
    this.edges = new Map();
  }

  addVertex(vertex) {
    if (!this.edges.has(vertex)) this.edges.set(vertex, new Set());
    return this;
  }

  addEdge(from, to) {
    this.addVertex(from).addVertex(to);
    this.edges.get(from).add(to);
    return this;
  }

  bfs(start) {
    if (!this.edges.has(start)) return [];
    const visited = new Set([start]);
    const order = [];
    const queue = new Queue();
    queue.enqueue(start);
    while (queue.size) {
      const current = queue.dequeue();
      order.push(current);
      for (const neighbor of this.edges.get(current)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.enqueue(neighbor);
        }
      }
    }
    return order;
  }

  dfs(start) {
    if (!this.edges.has(start)) return [];
    const visited = new Set();
    const order = [];
    const visit = (vertex) => {
      visited.add(vertex);
      order.push(vertex);
      for (const neighbor of this.edges.get(vertex)) {
        if (!visited.has(neighbor)) visit(neighbor);
      }
    };
    visit(start);
    return order;
  }

  topologicalSort() {
    const indegree = new Map(
      [...this.edges.keys()].map((vertex) => [vertex, 0]),
    );
    for (const neighbors of this.edges.values()) {
      for (const neighbor of neighbors) {
        indegree.set(neighbor, (indegree.get(neighbor) || 0) + 1);
      }
    }
    const queue = new Queue();
    for (const [vertex, count] of indegree) if (!count) queue.enqueue(vertex);
    const order = [];
    while (queue.size) {
      const current = queue.dequeue();
      order.push(current);
      for (const neighbor of this.edges.get(current) || []) {
        indegree.set(neighbor, indegree.get(neighbor) - 1);
        if (!indegree.get(neighbor)) queue.enqueue(neighbor);
      }
    }
    if (order.length !== this.edges.size)
      throw new Error("Graph contains a cycle.");
    return order;
  }
}
