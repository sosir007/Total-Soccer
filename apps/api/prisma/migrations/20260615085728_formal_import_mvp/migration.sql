-- AlterTable
ALTER TABLE "Club" ADD COLUMN     "averagePa" DOUBLE PRECISION,
ADD COLUMN     "championCount" INTEGER,
ADD COLUMN     "countryUid" TEXT,
ADD COLUMN     "honorScore" DOUBLE PRECISION,
ADD COLUMN     "playerCount" INTEGER,
ADD COLUMN     "totalPa" INTEGER,
ADD COLUMN     "trophyCount" INTEGER;

-- AlterTable
ALTER TABLE "Country" ADD COLUMN     "averageHonorScore" DOUBLE PRECISION,
ADD COLUMN     "averagePa" DOUBLE PRECISION,
ADD COLUMN     "championCount" INTEGER,
ADD COLUMN     "honorScore" DOUBLE PRECISION,
ADD COLUMN     "majorChampionCount" INTEGER,
ADD COLUMN     "medalCount" INTEGER,
ADD COLUMN     "playerCount" INTEGER,
ADD COLUMN     "totalPa" INTEGER;

-- AlterTable
ALTER TABLE "ImportTask" ADD COLUMN     "previewData" JSONB;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "achievement" TEXT,
ADD COLUMN     "age" INTEGER,
ADD COLUMN     "birthCity" TEXT,
ADD COLUMN     "birthCityUid" TEXT,
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "clubUid" TEXT,
ADD COLUMN     "clubs" TEXT,
ADD COLUMN     "confederation" TEXT,
ADD COLUMN     "countryUid" TEXT,
ADD COLUMN     "databaseSource" TEXT,
ADD COLUMN     "deathDate" TIMESTAMP(3),
ADD COLUMN     "deceased" BOOLEAN,
ADD COLUMN     "ethnicity" TEXT,
ADD COLUMN     "foot" TEXT,
ADD COLUMN     "hairColor" TEXT,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "initialClub" TEXT,
ADD COLUMN     "marketValue" DOUBLE PRECISION,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "playerType" TEXT,
ADD COLUMN     "positions" TEXT,
ADD COLUMN     "primaryClub" TEXT,
ADD COLUMN     "remark" TEXT,
ADD COLUMN     "representedCountry" TEXT,
ADD COLUMN     "retired" BOOLEAN,
ADD COLUMN     "shirtNumber" TEXT,
ADD COLUMN     "skinTone" TEXT,
ADD COLUMN     "staffRoles" TEXT,
ADD COLUMN     "weight" INTEGER;

-- CreateIndex
CREATE INDEX "Club_countryUid_idx" ON "Club"("countryUid");

-- CreateIndex
CREATE INDEX "Player_countryUid_idx" ON "Player"("countryUid");

-- CreateIndex
CREATE INDEX "Player_clubUid_idx" ON "Player"("clubUid");
