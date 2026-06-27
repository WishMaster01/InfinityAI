// server/server.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import aiRouter from "./routes/aiRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import toolRouter from "./routes/toolRoutes.js";
import billingRouter from "./routes/billingRoutes.js";
import { stripeWebhook } from "./controllers/billingController.js";

const app = express();

await connectCloudinary();

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.post(
  "/api/billing/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

app.use(express.json());

// ✅ Clerk middleware before any routes
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.send("SERVER IS LIVE!");
});

// ✅ Public/Protected routes
app.use("/api/ai", aiRouter); // requires Clerk token
app.use("/api/user", userRouter); // requires Clerk token
app.use("/api/tools", toolRouter);
app.use("/api/billing", billingRouter);

app.use((error, req, res, next) => {
  if (!error) return next();
  console.error("Request middleware error:", error);
  const isUploadError = error.name === "MulterError";
  return res.status(isUploadError ? 400 : error.statusCode || 500).json({
    success: false,
    message: isUploadError ? `Upload error: ${error.message}` : error.message || "Request failed.",
    code: error.code,
  });
});

// ❌ Remove app.use(requireAuth()) globally — control access via `auth.js` middleware per route

// Global 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
