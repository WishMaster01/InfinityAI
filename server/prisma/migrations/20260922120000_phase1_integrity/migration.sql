-- Phase 1 integrity additions. Existing columns are retained for safe rollout.
CREATE TYPE "CreditTransactionType" AS ENUM ('MONTHLY_GRANT', 'TOOL_USAGE', 'REFUND', 'PURCHASE', 'ADMIN_ADJUSTMENT', 'EXPIRATION', 'BONUS');
CREATE TABLE "credit_transactions" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" "CreditTransactionType" NOT NULL,
  "amount" INTEGER NOT NULL,
  "balanceAfter" INTEGER NOT NULL,
  "toolSlug" TEXT,
  "referenceId" TEXT,
  "reason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "credit_transactions_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "credit_transactions_userId_referenceId_key" ON "credit_transactions"("userId", "referenceId");
CREATE INDEX "credit_transactions_userId_createdAt_idx" ON "credit_transactions"("userId", "createdAt");
ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "stripe_events" (
  "id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "stripe_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "creation_likes" (
  "creationId" INTEGER NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "creation_likes_pkey" PRIMARY KEY ("creationId", "userId")
);
CREATE INDEX "creation_likes_userId_createdAt_idx" ON "creation_likes"("userId", "createdAt");
ALTER TABLE "creation_likes" ADD CONSTRAINT "creation_likes_creationId_fkey" FOREIGN KEY ("creationId") REFERENCES "creations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "creation_likes" ADD CONSTRAINT "creation_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
INSERT INTO "creation_likes" ("creationId", "userId")
SELECT c."id", u."id"
FROM "creations" c
CROSS JOIN LATERAL unnest(c."likes") AS legacy_like("clerkId")
JOIN "users" u ON u."clerkId" = legacy_like."clerkId"
ON CONFLICT ("creationId", "userId") DO NOTHING;
CREATE INDEX "creations_user_id_created_at_idx" ON "creations"("user_id", "created_at");
CREATE INDEX "creations_publish_created_at_idx" ON "creations"("publish", "created_at");
