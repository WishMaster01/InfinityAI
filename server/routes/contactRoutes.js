import express from "express";
import { submitContactMessage } from "../controllers/contactController.js";
import { rateLimit } from "../middlewares/rateLimit.js";

const router = express.Router();

router.post("/", rateLimit({ keyPrefix: "contact" }), submitContactMessage);

export default router;
