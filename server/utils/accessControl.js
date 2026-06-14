import { PLAN_ORDER, toolMap } from "../config/tools.js";

export const normalizePlan = (plan) => {
  const upperPlan = String(plan || "BASIC").toUpperCase();
  return PLAN_ORDER[upperPlan] === undefined ? "BASIC" : upperPlan;
};

export const canAccessPlan = (userPlan, requiredPlan = "BASIC") => {
  const normalizedUserPlan = normalizePlan(userPlan);
  const normalizedRequiredPlan = normalizePlan(requiredPlan);

  return PLAN_ORDER[normalizedUserPlan] >= PLAN_ORDER[normalizedRequiredPlan];
};

export const getToolOrThrow = (toolSlug) => {
  const tool = toolMap.get(toolSlug);

  if (!tool) {
    const error = new Error("Unknown AI tool.");
    error.statusCode = 404;
    throw error;
  }

  return tool;
};

export const assertToolAccess = (user, toolSlug) => {
  const tool = getToolOrThrow(toolSlug);

  if (!canAccessPlan(user.currentPlan, tool.minPlan)) {
    const error = new Error(
      `${tool.name} requires the ${tool.minPlan.toLowerCase()} plan.`
    );
    error.statusCode = 403;
    error.code = "UPGRADE_REQUIRED";
    error.tool = tool;
    throw error;
  }

  return tool;
};
