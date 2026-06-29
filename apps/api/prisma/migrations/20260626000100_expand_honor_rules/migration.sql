CREATE TYPE "HonorRulePlacementScope" AS ENUM (
  'TOP_FOUR',
  'TOP_THREE',
  'TOP_TWO',
  'LEAGUE_TOP_THREE',
  'CHAMPION_ONLY'
);

CREATE TYPE "HonorRuleConversionType" AS ENUM (
  'NONE',
  'FREQUENCY_SCALE',
  'OLYMPIC_STAGE',
  'CLUB_WORLD_CUP_STAGE'
);

ALTER TABLE "HonorRule"
  ADD COLUMN "level" TEXT,
  ADD COLUMN "format" TEXT,
  ADD COLUMN "scopeType" "CompetitionScopeType",
  ADD COLUMN "confederationId" TEXT,
  ADD COLUMN "countryId" TEXT,
  ADD COLUMN "placementScope" "HonorRulePlacementScope" NOT NULL DEFAULT 'TOP_TWO',
  ADD COLUMN "conversionType" "HonorRuleConversionType" NOT NULL DEFAULT 'NONE',
  ADD COLUMN "fourthPlaceScore" DOUBLE PRECISION,
  ADD COLUMN "qualityCoefficient" DOUBLE PRECISION NOT NULL DEFAULT 1,
  ADD COLUMN "isSystem" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "HonorRuleCompetition" (
  "honorRuleId" TEXT NOT NULL,
  "competitionId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "HonorRuleCompetition_pkey" PRIMARY KEY ("honorRuleId", "competitionId")
);

CREATE TABLE "HonorRuleCoefficient" (
  "id" TEXT NOT NULL,
  "honorRuleId" TEXT NOT NULL,
  "confederationId" TEXT,
  "countryId" TEXT,
  "coefficient" DOUBLE PRECISION NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "HonorRuleCoefficient_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "HonorRule_level_idx" ON "HonorRule"("level");
CREATE INDEX "HonorRule_format_idx" ON "HonorRule"("format");
CREATE INDEX "HonorRule_scopeType_idx" ON "HonorRule"("scopeType");
CREATE INDEX "HonorRule_confederationId_idx" ON "HonorRule"("confederationId");
CREATE INDEX "HonorRule_countryId_idx" ON "HonorRule"("countryId");
CREATE INDEX "HonorRule_placementScope_idx" ON "HonorRule"("placementScope");
CREATE INDEX "HonorRule_conversionType_idx" ON "HonorRule"("conversionType");
CREATE INDEX "HonorRule_isSystem_idx" ON "HonorRule"("isSystem");
CREATE INDEX "HonorRuleCompetition_competitionId_idx" ON "HonorRuleCompetition"("competitionId");
CREATE INDEX "HonorRuleCoefficient_honorRuleId_idx" ON "HonorRuleCoefficient"("honorRuleId");
CREATE INDEX "HonorRuleCoefficient_confederationId_idx" ON "HonorRuleCoefficient"("confederationId");
CREATE INDEX "HonorRuleCoefficient_countryId_idx" ON "HonorRuleCoefficient"("countryId");

ALTER TABLE "HonorRule"
  ADD CONSTRAINT "HonorRule_confederationId_fkey"
  FOREIGN KEY ("confederationId") REFERENCES "Confederation"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "HonorRule"
  ADD CONSTRAINT "HonorRule_countryId_fkey"
  FOREIGN KEY ("countryId") REFERENCES "Country"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "HonorRuleCompetition"
  ADD CONSTRAINT "HonorRuleCompetition_honorRuleId_fkey"
  FOREIGN KEY ("honorRuleId") REFERENCES "HonorRule"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "HonorRuleCompetition"
  ADD CONSTRAINT "HonorRuleCompetition_competitionId_fkey"
  FOREIGN KEY ("competitionId") REFERENCES "Competition"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "HonorRuleCoefficient"
  ADD CONSTRAINT "HonorRuleCoefficient_honorRuleId_fkey"
  FOREIGN KEY ("honorRuleId") REFERENCES "HonorRule"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "HonorRuleCoefficient"
  ADD CONSTRAINT "HonorRuleCoefficient_confederationId_fkey"
  FOREIGN KEY ("confederationId") REFERENCES "Confederation"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "HonorRuleCoefficient"
  ADD CONSTRAINT "HonorRuleCoefficient_countryId_fkey"
  FOREIGN KEY ("countryId") REFERENCES "Country"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
