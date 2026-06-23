ALTER TABLE "Player"
  ADD COLUMN "honorScore" DOUBLE PRECISION,
  ADD COLUMN "awardCount" INTEGER,
  ADD COLUMN "topAwardCount" INTEGER;

CREATE TABLE "AwardRule" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "scopeType" "AwardScopeType",
  "category" TEXT,
  "placement" TEXT,
  "rank" INTEGER,
  "baseScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coefficient" DOUBLE PRECISION NOT NULL DEFAULT 1,
  "topAward" BOOLEAN NOT NULL DEFAULT false,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "remark" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "AwardRule_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AwardRule_code_key" ON "AwardRule"("code");
CREATE INDEX "AwardRule_scopeType_idx" ON "AwardRule"("scopeType");
CREATE INDEX "AwardRule_category_idx" ON "AwardRule"("category");
CREATE INDEX "AwardRule_placement_idx" ON "AwardRule"("placement");
CREATE INDEX "AwardRule_rank_idx" ON "AwardRule"("rank");
CREATE INDEX "AwardRule_enabled_idx" ON "AwardRule"("enabled");
CREATE INDEX "Player_honorScore_idx" ON "Player"("honorScore");
