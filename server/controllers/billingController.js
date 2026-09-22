import prisma from "../configs/db.js";
import { PLAN_PRICE_ENV } from "../config/tools.js";
import { normalizePlan } from "../utils/accessControl.js";
import { applyPlanToUser } from "../utils/subscription.js";
import { requireStripe } from "../utils/stripe.js";

const getClientUrl = () =>
  process.env.CLIENT_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.FRONTEND_URL ||
  "http://localhost:5173";

const mapStripeStatus = (status) => {
  const normalized = String(status || "").toUpperCase();

  if (normalized === "ACTIVE") return "ACTIVE";
  if (normalized === "TRIALING") return "TRIALING";
  if (normalized === "PAST_DUE") return "PAST_DUE";
  if (normalized === "CANCELED") return "CANCELED";
  if (normalized === "INCOMPLETE") return "INCOMPLETE";
  return "EXPIRED";
};

export const getBillingSummary = async (req, res) => {
  try {
    const [subscription, payments, toolUsages] = await Promise.all([
      prisma.subscription.findFirst({
        where: { userId: req.user.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.payment.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.toolUsage.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "desc" },
        take: 25,
      }),
    ]);

    res.json({
      success: true,
      user: {
        plan: req.user.currentPlan,
        availableCredits: req.user.availableCredits,
        usedCredits: req.user.usedCredits,
        subscriptionStatus: req.user.subscriptionStatus,
      },
      subscription,
      payments,
      toolUsages,
    });
  } catch (error) {
    console.error("Error in getBillingSummary:", error);
    res
      .status(500)
      .json({ success: false, message: "Unable to load billing information." });
  }
};

export const createCheckoutSession = async (req, res) => {
  try {
    const stripe = requireStripe();
    const plan = normalizePlan(req.body.plan);
    const priceEnv = PLAN_PRICE_ENV[plan];
    const priceId = process.env[priceEnv];

    if (plan === "BASIC") {
      await applyPlanToUser({
        userId: req.user.id,
        plan: "BASIC",
        status: "FREE",
      });

      return res.json({ success: true, plan: "BASIC" });
    }

    if (!priceId) {
      return res.status(500).json({
        success: false,
        message: `${priceEnv} is not configured.`,
      });
    }

    let stripeCustomerId = req.user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: req.user.email || undefined,
        name: req.user.fullName || undefined,
        metadata: {
          userId: req.user.id,
          clerkId: req.user.clerkId,
        },
      });
      stripeCustomerId = customer.id;

      await prisma.user.update({
        where: { id: req.user.id },
        data: { stripeCustomerId },
      });
    }

    const clientUrl = getClientUrl();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${clientUrl}/ai/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/ai/billing/cancel`,
      client_reference_id: req.user.id,
      metadata: {
        userId: req.user.id,
        clerkId: req.user.clerkId,
        plan,
      },
      subscription_data: {
        metadata: {
          userId: req.user.id,
          clerkId: req.user.clerkId,
          plan,
        },
      },
    });

    await prisma.payment.create({
      data: {
        userId: req.user.id,
        stripeCheckoutSessionId: session.id,
        amount: session.amount_total || 0,
        currency: session.currency || "usd",
        status: "PENDING",
        plan,
      },
    });

    res.json({ success: true, url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Error in createCheckoutSession:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const stripe = requireStripe();

    if (!req.user.stripeSubscriptionId) {
      return res.status(400).json({
        success: false,
        message: "No active Stripe subscription found.",
      });
    }

    const subscription = await stripe.subscriptions.update(
      req.user.stripeSubscriptionId,
      { cancel_at_period_end: true },
    );

    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        cancelAtPeriodEnd: true,
        status: mapStripeStatus(subscription.status),
      },
    });

    res.json({ success: true, subscription });
  } catch (error) {
    console.error("Error in cancelSubscription:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const stripeWebhook = async (req, res) => {
  const stripe = requireStripe();
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    if (await prisma.stripeEvent.findUnique({ where: { id: event.id } })) {
      return res.json({ received: true, duplicate: true });
    }
    if (event.type === "checkout.session.completed") {
      await handleCheckoutCompleted(event.data.object);
    }

    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      await handleSubscriptionUpdated(event.data.object);
    }

    if (event.type === "invoice.payment_succeeded") {
      await handleInvoicePaid(event.data.object);
    }

    if (event.type === "invoice.payment_failed") {
      await handleInvoiceFailed(event.data.object);
    }

    await prisma.stripeEvent.create({
      data: { id: event.id, type: event.type },
    });

    res.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook handler error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const handleCheckoutCompleted = async (session) => {
  const userId = session.metadata?.userId || session.client_reference_id;
  const plan = normalizePlan(session.metadata?.plan);

  if (!userId) return;

  await prisma.payment.updateMany({
    where: { stripeCheckoutSessionId: session.id },
    data: {
      status: "PAID",
      stripePaymentIntentId: session.payment_intent || undefined,
      amount: session.amount_total || 0,
      currency: session.currency || "usd",
      paidAt: new Date(),
    },
  });

  await applyPlanToUser({
    userId,
    plan,
    status: "ACTIVE",
    stripeCustomerId: session.customer,
    stripeSubscriptionId: session.subscription,
  });

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: session.subscription },
    create: {
      userId,
      plan,
      status: "ACTIVE",
      stripeCustomerId: session.customer,
      stripeSubscriptionId: session.subscription,
    },
    update: {
      plan,
      status: "ACTIVE",
      stripeCustomerId: session.customer,
    },
  });
};

const handleSubscriptionUpdated = async (subscription) => {
  const userId = subscription.metadata?.userId;
  const plan = normalizePlan(subscription.metadata?.plan);
  const status = mapStripeStatus(subscription.status);

  if (!userId) return;

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    create: {
      userId,
      plan,
      status,
      stripeCustomerId: subscription.customer,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items?.data?.[0]?.price?.id,
      currentPeriodStart: subscription.current_period_start
        ? new Date(subscription.current_period_start * 1000)
        : null,
      currentPeriodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : null,
    },
    update: {
      plan,
      status,
      stripeCustomerId: subscription.customer,
      stripePriceId: subscription.items?.data?.[0]?.price?.id,
      currentPeriodStart: subscription.current_period_start
        ? new Date(subscription.current_period_start * 1000)
        : null,
      currentPeriodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : null,
    },
  });

  await applyPlanToUser({
    userId,
    plan: status === "CANCELED" ? "BASIC" : plan,
    status: status === "CANCELED" ? "FREE" : status,
    stripeCustomerId: subscription.customer,
    stripeSubscriptionId: subscription.id,
  });
};

const handleInvoicePaid = async (invoice) => {
  const subscriptionId = invoice.subscription;

  if (!subscriptionId) return;

  const subscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (!subscription) return;

  await prisma.payment.upsert({
    where: { stripeInvoiceId: invoice.id },
    create: {
      userId: subscription.userId,
      subscriptionId: subscription.id,
      stripeInvoiceId: invoice.id,
      stripePaymentIntentId: invoice.payment_intent || undefined,
      amount: invoice.amount_paid || 0,
      currency: invoice.currency || "usd",
      status: "PAID",
      plan: subscription.plan,
      paidAt: new Date(),
    },
    update: {
      status: "PAID",
      amount: invoice.amount_paid || 0,
      paidAt: new Date(),
    },
  });
};

const handleInvoiceFailed = async (invoice) => {
  if (!invoice.id) return;

  await prisma.payment.updateMany({
    where: { stripeInvoiceId: invoice.id },
    data: { status: "FAILED" },
  });
};
