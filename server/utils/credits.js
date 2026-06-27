import prisma from "../configs/db.js";
import { assertToolAccess } from "./accessControl.js";

export const consumeCredits = async ({ user, toolSlug, metadata }) => {
  const tool = assertToolAccess(user, toolSlug);

  if (user.availableCredits < tool.credits) {
    const error = new Error("Insufficient credits. Upgrade or buy more credits.");
    error.statusCode = 402;
    error.code = "INSUFFICIENT_CREDITS";
    error.requiredCredits = tool.credits;
    error.availableCredits = user.availableCredits;
    throw error;
  }

  const { updatedUser, toolUsage } = await prisma.$transaction(async (transaction) => {
    // Conditional update makes the balance check atomic across concurrent jobs.
    const result = await transaction.user.updateMany({
      where: { id: user.id, availableCredits: { gte: tool.credits } },
      data: { availableCredits: { decrement: tool.credits }, usedCredits: { increment: tool.credits } },
    });
    if (!result.count) {
      const current = await transaction.user.findUnique({ where: { id: user.id } });
      const error = new Error("Insufficient credits. Upgrade or buy more credits.");
      error.statusCode = 402;
      error.code = "INSUFFICIENT_CREDITS";
      error.requiredCredits = tool.credits;
      error.availableCredits = current?.availableCredits ?? 0;
      throw error;
    }

    await transaction.creditUsage.create({
      data: {
        userId: user.id,
        toolSlug: tool.slug,
        action: "DEDUCT",
        credits: tool.credits,
        reason: `Used ${tool.name}`,
      },
    });
    const createdToolUsage = await transaction.toolUsage.create({
      data: {
        userId: user.id,
        toolSlug: tool.slug,
        category: tool.category,
        credits: tool.credits,
        metadata: metadata || undefined,
      },
    });
    return {
      updatedUser: await transaction.user.findUnique({ where: { id: user.id } }),
      toolUsage: createdToolUsage,
    };
  });

  return { user: updatedUser, tool, toolUsage };
};

export const refundCredits = async ({ userId, tool, usageId, reason }) => {
  if (!tool?.credits) return;

  const operations = [
    prisma.user.update({
      where: { id: userId },
      data: {
        availableCredits: { increment: tool.credits },
        usedCredits: { decrement: tool.credits },
      },
    }),
    prisma.creditUsage.create({
      data: {
        userId,
        toolSlug: tool.slug,
        action: "REFUND",
        credits: tool.credits,
        reason: reason || `Refunded ${tool.name}`,
      },
    }),
  ];
  if (usageId) {
    operations.push(
      prisma.toolUsage.update({ where: { id: usageId }, data: { success: false } }),
    );
  }
  await prisma.$transaction(operations);
};
