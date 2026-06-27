// server/routes/aiRoutes.js
import express from "express";
import { auth } from "../middlewares/auth.js";
import { rateLimit } from "../middlewares/rateLimit.js";
import { queueAiRequest } from "../services/aiJobQueue.js";
import { executeToolWorkflow } from "../controllers/workflowController.js";
import {
  generateArticle,
  generateBlogTitle,
  generateImage,
  removeImageBackground,
  removeImageObject,
  resumeReview,
} from "../controllers/aiController.js";

import multer from "multer";
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 },
});
const workflowUpload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024, fields: 10 },
});

const aiRouter = express.Router();
const aiRateLimit = rateLimit({ keyPrefix: "ai" });

// 🧠 AI Generation Routes (require auth middleware)
aiRouter.post(
  "/generate-article",
  auth,
  aiRateLimit,
  (req, res, next) => {
    console.log("🔥 generate-article endpoint hit!");
    next();
  },
  queueAiRequest(generateArticle)
);

aiRouter.post("/generate-blog-title", auth, aiRateLimit, queueAiRequest(generateBlogTitle));
// 🖼️ Image Processing Routes (ClipDrop + Cloudinary)

aiRouter.post("/generate-image", auth, aiRateLimit, queueAiRequest(generateImage));
aiRouter.post(
  "/remove-bg",
  auth,
  aiRateLimit,
  upload.single("image"),
  queueAiRequest(removeImageBackground)
);
aiRouter.post(
  "/remove-object",
  auth,
  aiRateLimit,
  upload.single("image"),
  queueAiRequest(removeImageObject)
);
// 📄 Resume Review via PDF Upload

aiRouter.post("/resume-review", auth, aiRateLimit, upload.single("resume"), queueAiRequest(resumeReview));

// Shared executor keeps all catalog workflows under the same auth, plan,
// credit, rate-limit, queue, persistence, and upload-safety contract.
aiRouter.post(
  "/tools/:toolSlug",
  auth,
  aiRateLimit,
  workflowUpload.single("file"),
  queueAiRequest(executeToolWorkflow),
);

export default aiRouter;
