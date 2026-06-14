CREATE TYPE "Plan" AS ENUM ('BASIC', 'MODERATE', 'PRO');

CREATE TYPE "SubscriptionStatus" AS ENUM (
  'FREE',
  'ACTIVE',
  'TRIALING',
  'PAST_DUE',
  'CANCELED',
  'INCOMPLETE',
  'EXPIRED'
);

CREATE TYPE "PaymentStatus" AS ENUM (
  'PENDING',
  'PAID',
  'FAILED',
  'REFUNDED',
  'CANCELED'
);

CREATE TYPE "ToolCategory" AS ENUM (
  'CONTENT',
  'IMAGE',
  'CAREER',
  'PRODUCTIVITY',
  'DEVELOPER',
  'ADVANCED'
);

CREATE TYPE "CreditAction" AS ENUM ('GRANT', 'DEDUCT', 'REFUND', 'ADJUST');

CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "clerkId" TEXT NOT NULL,
  "email" TEXT,
  "fullName" TEXT,
  "imageUrl" TEXT,
  "currentPlan" "Plan" NOT NULL DEFAULT 'BASIC',
  "availableCredits" INTEGER NOT NULL DEFAULT 20,
  "usedCredits" INTEGER NOT NULL DEFAULT 0,
  "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'FREE',
  "stripeCustomerId" TEXT,
  "stripeSubscriptionId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "subscriptions" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "plan" "Plan" NOT NULL,
  "status" "SubscriptionStatus" NOT NULL DEFAULT 'INCOMPLETE',
  "stripeCustomerId" TEXT,
  "stripeSubscriptionId" TEXT,
  "stripePriceId" TEXT,
  "currentPeriodStart" TIMESTAMP(3),
  "currentPeriodEnd" TIMESTAMP(3),
  "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
  "canceledAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "payments" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "subscriptionId" TEXT,
  "stripeCheckoutSessionId" TEXT,
  "stripePaymentIntentId" TEXT,
  "stripeInvoiceId" TEXT,
  "amount" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'usd',
  "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "plan" "Plan" NOT NULL,
  "paidAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "credit_usages" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "toolSlug" TEXT,
  "action" "CreditAction" NOT NULL,
  "credits" INTEGER NOT NULL,
  "reason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "credit_usages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tool_usages" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "toolSlug" TEXT NOT NULL,
  "category" "ToolCategory" NOT NULL,
  "credits" INTEGER NOT NULL,
  "success" BOOLEAN NOT NULL DEFAULT true,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "tool_usages_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_clerkId_key" ON "users"("clerkId");
CREATE UNIQUE INDEX "users_stripeCustomerId_key" ON "users"("stripeCustomerId");
CREATE UNIQUE INDEX "users_stripeSubscriptionId_key" ON "users"("stripeSubscriptionId");
CREATE INDEX "users_currentPlan_idx" ON "users"("currentPlan");
CREATE INDEX "users_subscriptionStatus_idx" ON "users"("subscriptionStatus");

CREATE UNIQUE INDEX "subscriptions_stripeSubscriptionId_key" ON "subscriptions"("stripeSubscriptionId");
CREATE INDEX "subscriptions_userId_idx" ON "subscriptions"("userId");
CREATE INDEX "subscriptions_plan_status_idx" ON "subscriptions"("plan", "status");

CREATE UNIQUE INDEX "payments_stripeCheckoutSessionId_key" ON "payments"("stripeCheckoutSessionId");
CREATE UNIQUE INDEX "payments_stripePaymentIntentId_key" ON "payments"("stripePaymentIntentId");
CREATE UNIQUE INDEX "payments_stripeInvoiceId_key" ON "payments"("stripeInvoiceId");
CREATE INDEX "payments_userId_idx" ON "payments"("userId");
CREATE INDEX "payments_status_idx" ON "payments"("status");

CREATE INDEX "credit_usages_userId_createdAt_idx" ON "credit_usages"("userId", "createdAt");
CREATE INDEX "credit_usages_toolSlug_idx" ON "credit_usages"("toolSlug");

CREATE INDEX "tool_usages_userId_createdAt_idx" ON "tool_usages"("userId", "createdAt");
CREATE INDEX "tool_usages_toolSlug_idx" ON "tool_usages"("toolSlug");
CREATE INDEX "tool_usages_category_idx" ON "tool_usages"("category");

ALTER TABLE "subscriptions"
  ADD CONSTRAINT "subscriptions_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "payments"
  ADD CONSTRAINT "payments_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "credit_usages"
  ADD CONSTRAINT "credit_usages_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tool_usages"
  ADD CONSTRAINT "tool_usages_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
