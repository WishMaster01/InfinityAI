import prisma from "../configs/db.js";
import { toolCategories, tools } from "../config/tools.js";
import { Trie } from "../utils/dsa/trie.js";

const toolTrie = new Trie();
for (const tool of tools) {
  toolTrie.insert(tool.name, tool.slug);
  for (const word of tool.name.split(/\s+/)) toolTrie.insert(word, tool.slug);
}

export const getTools = async (req, res) => {
  try {
    const usageGroups = await prisma.toolUsage.groupBy({
      by: ["toolSlug"],
      where: { success: true },
      _count: { toolSlug: true },
    });
    const usageCounts = new Map(
      usageGroups.map((usage) => [usage.toolSlug, usage._count.toolSlug]),
    );
    const enrichedTools = tools.map((tool) => ({
      ...tool,
      route: tool.path,
      usageCount: usageCounts.get(tool.slug) || 0,
    }));
    const query = String(req.query.q || "").trim();
    const suggestionSlugs = query ? toolTrie.suggest(query, 8) : [];

    res.json({
      success: true,
      suggestions: suggestionSlugs
        .map((slug) => enrichedTools.find((tool) => tool.slug === slug))
        .filter(Boolean),
      categories: toolCategories.map((category) => ({
        key: category.key,
        filter: category.filter,
        title: category.title,
        description: category.description,
        icon: category.icon,
        gradient: category.gradient,
        tools: enrichedTools.filter((tool) => tool.category === category.key),
      })),
    });
  } catch (error) {
    console.error("Error in getTools:", error);
    res.json({
      success: true,
      degraded: true,
      suggestions: [],
      categories: toolCategories.map((category) => ({
        key: category.key,
        filter: category.filter,
        title: category.title,
        description: category.description,
        icon: category.icon,
        gradient: category.gradient,
        tools: tools
          .filter((tool) => tool.category === category.key)
          .map((tool) => ({ ...tool, route: tool.path, usageCount: 0 })),
      })),
    });
  }
};
