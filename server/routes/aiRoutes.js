// server/routes/aiRoutes.js
import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  generateArticle,
  generateBlogTitle,
  generateImage,
  removeImageBackground,
  removeImageObject,
  resumeReview,
} from "../controllers/aiController.js";

import multer from "multer";
const upload = multer({ dest: "uploads/" });

const aiRouter = express.Router();

// 🧠 AI Generation Routes (require auth middleware)
aiRouter.post(
  "/generate-article",
  auth,
  (req, res, next) => {
    console.log("🔥 generate-article endpoint hit!");
    next();
  },
  generateArticle
);

aiRouter.post("/generate-blog-title", auth, generateBlogTitle);
// 🖼️ Image Processing Routes (ClipDrop + Cloudinary)

aiRouter.post("/generate-image", auth, generateImage);
aiRouter.post(
  "/remove-bg",
  auth,
  upload.single("image"),
  removeImageBackground
);
aiRouter.post(
  "/remove-object",
  auth,
  upload.single("image"),
  removeImageObject
);
// 📄 Resume Review via PDF Upload

aiRouter.post("/resume-review", auth, upload.single("resume"), resumeReview);

export default aiRouter;
