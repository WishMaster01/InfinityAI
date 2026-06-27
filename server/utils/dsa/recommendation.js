import { PLAN_ORDER } from "../../config/tools.js";
import { PriorityQueue } from "./priorityQueue.js";

export const buildUsageAnalytics = (usages = [], { premiumToolSlugs = [] } = {}) => {
  const byTool = new Map();
  const creditsByCategory = new Map();
  const byDay = new Map();
  const byMonth = new Map();
  const successfulUsages = usages.filter((usage) => usage.success !== false);
  const premiumTools = new Set(premiumToolSlugs);
  let premiumUsage = 0;
  for (const usage of successfulUsages) {
    byTool.set(usage.toolSlug, (byTool.get(usage.toolSlug) || 0) + 1);
    creditsByCategory.set(
      usage.category,
      (creditsByCategory.get(usage.category) || 0) + usage.credits,
    );
    const day = new Date(usage.createdAt).toISOString().slice(0, 10);
    byDay.set(day, (byDay.get(day) || 0) + 1);
    const month = day.slice(0, 7);
    byMonth.set(month, (byMonth.get(month) || 0) + 1);
    if (premiumTools.has(usage.toolSlug)) premiumUsage += 1;
  }

  const activeDays = [...byDay.keys()].sort().reverse();
  let streak = 0;
  if (activeDays.length) {
    const cursor = new Date(`${activeDays[0]}T00:00:00.000Z`);
    const days = new Set(activeDays);
    while (days.has(cursor.toISOString().slice(0, 10))) {
      streak += 1;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    }
  }

  return {
    mostUsedTools: [...byTool.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 5)
      .map(([toolSlug, count]) => ({ toolSlug, count })),
    creditsByCategory: Object.fromEntries(creditsByCategory),
    dailyUsage: Object.fromEntries([...byDay.entries()].sort()),
    monthlyUsage: Object.fromEntries([...byMonth.entries()].sort()),
    activityStreak: streak,
    premiumToolConversionRate: successfulUsages.length
      ? Math.round((premiumUsage / successfulUsages.length) * 100)
      : 0,
  };
};

export const recommendTools = ({
  tools,
  usages = [],
  plan = "BASIC",
  remainingCredits = Number.POSITIVE_INFINITY,
  popularity = new Map(),
  limit = 6,
}) => {
  const successfulUsages = usages.filter((usage) => usage.success !== false);
  const analytics = buildUsageAnalytics(successfulUsages);
  const toolCounts = new Map(analytics.mostUsedTools.map((item) => [item.toolSlug, item.count]));
  const categoryCounts = new Map();
  for (const usage of successfulUsages) {
    categoryCounts.set(usage.category, (categoryCounts.get(usage.category) || 0) + 1);
  }
  const recent = new Map(successfulUsages.slice(0, 20).map((usage, index) => [usage.toolSlug, 20 - index]));
  const heap = new PriorityQueue();
  for (const tool of tools) {
    if ((PLAN_ORDER[tool.minPlan] ?? 0) > (PLAN_ORDER[plan] ?? 0)) continue;
    if (tool.credits > remainingCredits) continue;
    const score =
      (toolCounts.get(tool.slug) || 0) * 8 +
      (categoryCounts.get(tool.category) || 0) * 3 +
      (recent.get(tool.slug) || 0) * 2 +
      Math.log2((popularity.get(tool.slug) || 0) + 1) * 2 +
      Math.max(0, 6 - tool.credits);
    heap.enqueue({ tool, priority: score });
  }
  const recommendations = [];
  while (heap.size && recommendations.length < limit) {
    recommendations.push(heap.dequeue().tool);
  }
  return recommendations;
};
