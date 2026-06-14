import Stripe from "stripe";

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export const requireStripe = () => {
  if (!stripe) {
    const error = new Error("Stripe is not configured on the server.");
    error.statusCode = 500;
    throw error;
  }

  return stripe;
};
