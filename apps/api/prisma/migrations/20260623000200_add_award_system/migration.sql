CREATE TYPE "AwardScopeType" AS ENUM ('WORLD', 'CONFEDERATION', 'COUNTRY', 'LEAGUE', 'CLUB', 'MEDIA');

CREATE TABLE "Award" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "externalUrl" TEXT,
  "scopeType" "AwardScopeType" NOT NULL DEFAULT 'WORLD',
  "category" TEXT,
  "level" TEXT,
  "description" TEXT,
  "confederationId" TEXT,
  "countryId" TEXT,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Award_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AwardEdition" (
  "id" TEXT NOT NULL,
  "awardId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "season" TEXT,
  "year" INTEGER,
  "externalUrl" TEXT,
  "remark" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "AwardEdition_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AwardRecipient" (
  "id" TEXT NOT NULL,
  "editionId" TEXT NOT NULL,
  "playerId" TEXT NOT NULL,
  "rank" INTEGER,
  "placement" TEXT,
  "externalUrl" TEXT,
  "remark" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "AwardRecipient_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Award_code_key" ON "Award"("code");
CREATE INDEX "Award_scopeType_idx" ON "Award"("scopeType");
CREATE INDEX "Award_category_idx" ON "Award"("category");
CREATE INDEX "Award_confederationId_idx" ON "Award"("confederationId");
CREATE INDEX "Award_countryId_idx" ON "Award"("countryId");
CREATE INDEX "Award_enabled_idx" ON "Award"("enabled");

CREATE UNIQUE INDEX "AwardEdition_awardId_name_key" ON "AwardEdition"("awardId", "name");
CREATE INDEX "AwardEdition_awardId_idx" ON "AwardEdition"("awardId");
CREATE INDEX "AwardEdition_year_idx" ON "AwardEdition"("year");

CREATE UNIQUE INDEX "AwardRecipient_editionId_playerId_key" ON "AwardRecipient"("editionId", "playerId");
CREATE INDEX "AwardRecipient_playerId_idx" ON "AwardRecipient"("playerId");
CREATE INDEX "AwardRecipient_rank_idx" ON "AwardRecipient"("rank");
CREATE INDEX "AwardRecipient_placement_idx" ON "AwardRecipient"("placement");

ALTER TABLE "Award" ADD CONSTRAINT "Award_confederationId_fkey" FOREIGN KEY ("confederationId") REFERENCES "Confederation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Award" ADD CONSTRAINT "Award_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AwardEdition" ADD CONSTRAINT "AwardEdition_awardId_fkey" FOREIGN KEY ("awardId") REFERENCES "Award"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AwardRecipient" ADD CONSTRAINT "AwardRecipient_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "AwardEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AwardRecipient" ADD CONSTRAINT "AwardRecipient_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
