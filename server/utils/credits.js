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

  const [updatedUser] = await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        availableCredits: { decrement: tool.credits },
        usedCredits: { increment: tool.credits },
      },
    }),
    prisma.creditUsage.create({
      data: {
        userId: user.id,
        toolSlug: tool.slug,
        action: "DEDUCT",
        credits: tool.credits,
        reason: `Used ${tool.name}`,
      },
    }),
    prisma.toolUsage.create({
      data: {
        userId: user.id,
        toolSlug: tool.slug,
        category: tool.category,
        credits: tool.credits,
        metadata: metadata || undefined,
      },
    }),
  ]);

  return { user: updatedUser, tool };
};

export const refundCredits = async ({ userId, tool, reason }) => {
  if (!tool?.credits) return;

  await prisma.$transaction([
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
  ]);
};
