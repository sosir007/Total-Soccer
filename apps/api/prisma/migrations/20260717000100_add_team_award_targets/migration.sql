CREATE TYPE "AwardTargetType" AS ENUM ('PLAYER', 'COUNTRY', 'CLUB');

ALTER TABLE "Award"
  ADD COLUMN "targetType" "AwardTargetType" NOT NULL DEFAULT 'PLAYER';

ALTER TABLE "AwardRecipient"
  ADD COLUMN "targetType" "AwardTargetType" NOT NULL DEFAULT 'PLAYER',
  ADD COLUMN "countryId" TEXT,
  ADD COLUMN "clubId" TEXT,
  ALTER COLUMN "playerId" DROP NOT NULL;

ALTER TABLE "Country"
  ADD COLUMN "baseHonorScore" DOUBLE PRECISION,
  ADD COLUMN "bonusHonorScore" DOUBLE PRECISION;

ALTER TABLE "Club"
  ADD COLUMN "baseHonorScore" DOUBLE PRECISION,
  ADD COLUMN "bonusHonorScore" DOUBLE PRECISION;

UPDATE "Country"
SET "baseHonorScore" = "honorScore",
    "bonusHonorScore" = 0
WHERE "baseHonorScore" IS NULL;

UPDATE "Club"
SET "baseHonorScore" = "honorScore",
    "bonusHonorScore" = 0
WHERE "baseHonorScore" IS NULL;

CREATE TABLE "TeamHonorRule" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "targetType" "AwardTargetType" NOT NULL,
  "scopeType" "AwardScopeType",
  "category" TEXT,
  "placement" TEXT,
  "rank" INTEGER,
  "baseScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "coefficient" DOUBLE PRECISION NOT NULL DEFAULT 1,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "remark" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TeamHonorRule_pkey" PRIMARY KEY ("id")
);

DROP INDEX "AwardRecipient_editionId_playerId_key";

CREATE INDEX "Award_targetType_idx" ON "Award"("targetType");
CREATE INDEX "AwardRecipient_targetType_idx" ON "AwardRecipient"("targetType");
CREATE INDEX "AwardRecipient_countryId_idx" ON "AwardRecipient"("countryId");
CREATE INDEX "AwardRecipient_clubId_idx" ON "AwardRecipient"("clubId");
CREATE UNIQUE INDEX "AwardRecipient_editionId_targetType_playerId_key" ON "AwardRecipient"("editionId", "targetType", "playerId");
CREATE UNIQUE INDEX "AwardRecipient_editionId_targetType_countryId_key" ON "AwardRecipient"("editionId", "targetType", "countryId");
CREATE UNIQUE INDEX "AwardRecipient_editionId_targetType_clubId_key" ON "AwardRecipient"("editionId", "targetType", "clubId");

CREATE UNIQUE INDEX "TeamHonorRule_code_key" ON "TeamHonorRule"("code");
CREATE INDEX "TeamHonorRule_targetType_idx" ON "TeamHonorRule"("targetType");
CREATE INDEX "TeamHonorRule_scopeType_idx" ON "TeamHonorRule"("scopeType");
CREATE INDEX "TeamHonorRule_category_idx" ON "TeamHonorRule"("category");
CREATE INDEX "TeamHonorRule_placement_idx" ON "TeamHonorRule"("placement");
CREATE INDEX "TeamHonorRule_rank_idx" ON "TeamHonorRule"("rank");
CREATE INDEX "TeamHonorRule_enabled_idx" ON "TeamHonorRule"("enabled");

ALTER TABLE "AwardRecipient"
  ADD CONSTRAINT "AwardRecipient_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "AwardRecipient_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "AwardRecipient_single_target_check" CHECK (
    (
      "targetType" = 'PLAYER'
      AND "playerId" IS NOT NULL
      AND "countryId" IS NULL
      AND "clubId" IS NULL
    )
    OR (
      "targetType" = 'COUNTRY'
      AND "playerId" IS NULL
      AND "countryId" IS NOT NULL
      AND "clubId" IS NULL
    )
    OR (
      "targetType" = 'CLUB'
      AND "playerId" IS NULL
      AND "countryId" IS NULL
      AND "clubId" IS NOT NULL
    )
  );
