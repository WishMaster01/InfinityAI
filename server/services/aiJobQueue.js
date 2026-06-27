import { PLAN_ORDER } from "../config/tools.js";
import { AsyncPriorityQueue } from "../utils/dsa/queue.js";
import fs from "fs";

const positiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};
const concurrency = positiveInteger(process.env.AI_QUEUE_CONCURRENCY, 2);
const maxSize = positiveInteger(process.env.AI_QUEUE_MAX_SIZE, 100);

export const aiJobQueue = new AsyncPriorityQueue({ concurrency, maxSize });

export const queueAiRequest = (handler) => async (req, res, next) => {
  const priority = PLAN_ORDER[req.plan] ?? PLAN_ORDER.BASIC;
  const queuedAt = Date.now();
  try {
    await aiJobQueue.add(
      () => {
        res.setHeader("X-AI-Queue-Wait-Ms", String(Date.now() - queuedAt));
        return handler(req, res, next);
      },
      { priority },
    );
  } catch (error) {
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    if (res.headersSent) return next(error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      code: error.code,
    });
  }
};
