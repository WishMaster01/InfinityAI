CREATE TABLE "creations" (
  "id" SERIAL NOT NULL,
  "user_id" TEXT NOT NULL,
  "prompt" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "publish" BOOLEAN DEFAULT false,
  "likes" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "created_at" TIMESTAMPTZ(6) DEFAULT now(),
  "updated_at" TIMESTAMPTZ(6) DEFAULT now(),
  CONSTRAINT "creations_pkey" PRIMARY KEY ("id")
);
