ALTER TABLE "tool_usages" ADD COLUMN "requestId" TEXT;
ALTER TABLE "tool_usages" ADD COLUMN "provider" TEXT;
ALTER TABLE "tool_usages" ADD COLUMN "model" TEXT;
ALTER TABLE "tool_usages" ADD COLUMN "latencyMs" INTEGER;
ALTER TABLE "tool_usages" ADD COLUMN "errorCode" TEXT;
ALTER TABLE "tool_usages" ADD COLUMN "cacheHit" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX "tool_usages_provider_createdAt_idx" ON "tool_usages"("provider", "createdAt");
CREATE INDEX "tool_usages_success_createdAt_idx" ON "tool_usages"("success", "createdAt");
