import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  cancelSubscription,
  createCheckoutSession,
  getBillingSummary,
} from "../controllers/billingController.js";

const billingRouter = express.Router();

billingRouter.get("/summary", auth, getBillingSummary);
billingRouter.post("/checkout", auth, createCheckoutSession);
billingRouter.post("/cancel", auth, cancelSubscription);

export default billingRouter;
