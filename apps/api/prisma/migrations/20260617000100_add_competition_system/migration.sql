-- CreateEnum
CREATE TYPE "CompetitionTargetType" AS ENUM ('COUNTRY', 'CLUB');

-- CreateEnum
CREATE TYPE "CompetitionScopeType" AS ENUM ('GLOBAL', 'CONFEDERATION', 'COUNTRY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "CompetitionStandingPlacement" AS ENUM ('CHAMPION', 'RUNNER_UP', 'THIRD_PLACE', 'FOURTH_PLACE');

-- CreateTable
CREATE TABLE "Competition" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "targetType" "CompetitionTargetType" NOT NULL,
    "scopeType" "CompetitionScopeType" NOT NULL DEFAULT 'GLOBAL',
    "category" TEXT,
    "level" TEXT,
    "confederationId" TEXT,
    "countryId" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Competition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitionEdition" (
    "id" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "season" TEXT,
    "year" INTEGER,
    "host" TEXT,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompetitionEdition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitionStanding" (
    "id" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    "placement" "CompetitionStandingPlacement" NOT NULL,
    "countryId" TEXT,
    "clubId" TEXT,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompetitionStanding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Competition_code_key" ON "Competition"("code");

-- CreateIndex
CREATE INDEX "Competition_targetType_idx" ON "Competition"("targetType");

-- CreateIndex
CREATE INDEX "Competition_scopeType_idx" ON "Competition"("scopeType");

-- CreateIndex
CREATE INDEX "Competition_confederationId_idx" ON "Competition"("confederationId");

-- CreateIndex
CREATE INDEX "Competition_countryId_idx" ON "Competition"("countryId");

-- CreateIndex
CREATE INDEX "Competition_enabled_idx" ON "Competition"("enabled");

-- CreateIndex
CREATE UNIQUE INDEX "CompetitionEdition_competitionId_name_key" ON "CompetitionEdition"("competitionId", "name");

-- CreateIndex
CREATE INDEX "CompetitionEdition_competitionId_idx" ON "CompetitionEdition"("competitionId");

-- CreateIndex
CREATE INDEX "CompetitionEdition_year_idx" ON "CompetitionEdition"("year");

-- CreateIndex
CREATE UNIQUE INDEX "CompetitionStanding_editionId_placement_key" ON "CompetitionStanding"("editionId", "placement");

-- CreateIndex
CREATE INDEX "CompetitionStanding_countryId_idx" ON "CompetitionStanding"("countryId");

-- CreateIndex
CREATE INDEX "CompetitionStanding_clubId_idx" ON "CompetitionStanding"("clubId");

-- CreateIndex
CREATE INDEX "CompetitionStanding_placement_idx" ON "CompetitionStanding"("placement");

-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_confederationId_fkey" FOREIGN KEY ("confederationId") REFERENCES "Confederation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionEdition" ADD CONSTRAINT "CompetitionEdition_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionStanding" ADD CONSTRAINT "CompetitionStanding_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "CompetitionEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionStanding" ADD CONSTRAINT "CompetitionStanding_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionStanding" ADD CONSTRAINT "CompetitionStanding_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;
