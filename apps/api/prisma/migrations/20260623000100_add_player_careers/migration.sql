CREATE TYPE "PlayerCareerType" AS ENUM ('CLUB', 'COUNTRY');

CREATE TABLE "PlayerCareer" (
  "id" TEXT NOT NULL,
  "playerId" TEXT NOT NULL,
  "careerType" "PlayerCareerType" NOT NULL,
  "clubId" TEXT,
  "countryId" TEXT,
  "startYear" INTEGER,
  "endYear" INTEGER,
  "startSeason" TEXT,
  "endSeason" TEXT,
  "appearances" INTEGER,
  "goals" INTEGER,
  "assists" INTEGER,
  "cleanSheets" INTEGER,
  "goalsConceded" INTEGER,
  "position" TEXT,
  "positionGroup" TEXT,
  "showInProfile" BOOLEAN NOT NULL DEFAULT true,
  "isRepresentative" BOOLEAN NOT NULL DEFAULT false,
  "isLegend" BOOLEAN NOT NULL DEFAULT false,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "remark" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "PlayerCareer_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PlayerCareer_playerId_idx" ON "PlayerCareer"("playerId");
CREATE INDEX "PlayerCareer_careerType_idx" ON "PlayerCareer"("careerType");
CREATE INDEX "PlayerCareer_clubId_idx" ON "PlayerCareer"("clubId");
CREATE INDEX "PlayerCareer_countryId_idx" ON "PlayerCareer"("countryId");
CREATE INDEX "PlayerCareer_showInProfile_idx" ON "PlayerCareer"("showInProfile");
CREATE INDEX "PlayerCareer_isRepresentative_idx" ON "PlayerCareer"("isRepresentative");
CREATE INDEX "PlayerCareer_isLegend_idx" ON "PlayerCareer"("isLegend");

ALTER TABLE "PlayerCareer" ADD CONSTRAINT "PlayerCareer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PlayerCareer" ADD CONSTRAINT "PlayerCareer_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PlayerCareer" ADD CONSTRAINT "PlayerCareer_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;
