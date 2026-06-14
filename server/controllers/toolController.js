import { toolCategories, tools } from "../config/tools.js";

export const getTools = async (req, res) => {
  res.json({
    success: true,
    categories: toolCategories.map((category) => ({
      key: category.key,
      filter: category.filter,
      title: category.title,
      description: category.description,
      icon: category.icon,
      gradient: category.gradient,
      tools: tools.filter((tool) => tool.category === category.key),
    })),
  });
};
