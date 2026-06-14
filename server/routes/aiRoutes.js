// server/routes/aiRoutes.js
import express from "express";
import { auth } from "../middlewares/auth.js";
import { rateLimit } from "../middlewares/rateLimit.js";
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

const aiRouter = express.Router();
const aiRateLimit = rateLimit({ windowMs: 60 * 1000, max: 20, keyPrefix: "ai" });

// 🧠 AI Generation Routes (require auth middleware)
aiRouter.post(
  "/generate-article",
  auth,
  aiRateLimit,
  (req, res, next) => {
    console.log("🔥 generate-article endpoint hit!");
    next();
  },
  generateArticle
);

aiRouter.post("/generate-blog-title", auth, aiRateLimit, generateBlogTitle);
// 🖼️ Image Processing Routes (ClipDrop + Cloudinary)

aiRouter.post("/generate-image", auth, aiRateLimit, generateImage);
aiRouter.post(
  "/remove-bg",
  auth,
  aiRateLimit,
  upload.single("image"),
  removeImageBackground
);
aiRouter.post(
  "/remove-object",
  auth,
  aiRateLimit,
  upload.single("image"),
  removeImageObject
);
// 📄 Resume Review via PDF Upload

aiRouter.post("/resume-review", auth, aiRateLimit, upload.single("resume"), resumeReview);

export default aiRouter;
