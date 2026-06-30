ALTER TYPE "CompetitionStandingPlacement" ADD VALUE IF NOT EXISTS 'SEMI_FINALIST';

CREATE TYPE "CompetitionEditionStandingMode" AS ENUM (
  'THIRD_PLACE_MATCH',
  'SEMI_FINALISTS',
  'FINAL_ONLY',
  'LEAGUE_TOP_THREE'
);

ALTER TABLE "CompetitionEdition"
  ADD COLUMN "standingMode" "CompetitionEditionStandingMode" NOT NULL DEFAULT 'THIRD_PLACE_MATCH';

ALTER TABLE "CompetitionStanding"
  ADD COLUMN "standingOrder" INTEGER NOT NULL DEFAULT 0;

DROP INDEX IF EXISTS "CompetitionStanding_editionId_placement_key";

CREATE INDEX "CompetitionStanding_editionId_placement_idx"
  ON "CompetitionStanding"("editionId", "placement");

ALTER TABLE "HonorRule"
  ADD COLUMN "semiFinalistScore" DOUBLE PRECISION;
