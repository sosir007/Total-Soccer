-- Add standardized competition format and multi-scope relations while keeping
-- legacy single-scope columns for compatibility.
ALTER TABLE "Competition"
ADD COLUMN "format" TEXT;

CREATE TABLE "CompetitionScopeConfederation" (
  "competitionId" TEXT NOT NULL,
  "confederationId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CompetitionScopeConfederation_pkey" PRIMARY KEY ("competitionId", "confederationId")
);

CREATE TABLE "CompetitionScopeCountry" (
  "competitionId" TEXT NOT NULL,
  "countryId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CompetitionScopeCountry_pkey" PRIMARY KEY ("competitionId", "countryId")
);

INSERT INTO "CompetitionScopeConfederation" ("competitionId", "confederationId")
SELECT "id", "confederationId"
FROM "Competition"
WHERE "scopeType" = 'CONFEDERATION'
  AND "confederationId" IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO "CompetitionScopeCountry" ("competitionId", "countryId")
SELECT "id", "countryId"
FROM "Competition"
WHERE "scopeType" = 'COUNTRY'
  AND "countryId" IS NOT NULL
ON CONFLICT DO NOTHING;

CREATE INDEX "Competition_category_idx" ON "Competition"("category");
CREATE INDEX "Competition_level_idx" ON "Competition"("level");
CREATE INDEX "Competition_format_idx" ON "Competition"("format");
CREATE INDEX "CompetitionScopeConfederation_confederationId_idx"
ON "CompetitionScopeConfederation"("confederationId");
CREATE INDEX "CompetitionScopeCountry_countryId_idx"
ON "CompetitionScopeCountry"("countryId");

ALTER TABLE "CompetitionScopeConfederation"
ADD CONSTRAINT "CompetitionScopeConfederation_competitionId_fkey"
FOREIGN KEY ("competitionId") REFERENCES "Competition"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CompetitionScopeConfederation"
ADD CONSTRAINT "CompetitionScopeConfederation_confederationId_fkey"
FOREIGN KEY ("confederationId") REFERENCES "Confederation"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CompetitionScopeCountry"
ADD CONSTRAINT "CompetitionScopeCountry_competitionId_fkey"
FOREIGN KEY ("competitionId") REFERENCES "Competition"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CompetitionScopeCountry"
ADD CONSTRAINT "CompetitionScopeCountry_countryId_fkey"
FOREIGN KEY ("countryId") REFERENCES "Country"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
