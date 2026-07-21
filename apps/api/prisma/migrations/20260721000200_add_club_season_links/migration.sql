-- CreateTable
CREATE TABLE "ClubSeasonLink" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "season" TEXT NOT NULL,
    "externalUrl" TEXT,
    "sourceName" TEXT,
    "remark" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubSeasonLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClubSeasonLink_clubId_season_key" ON "ClubSeasonLink"("clubId", "season");

-- CreateIndex
CREATE INDEX "ClubSeasonLink_clubId_idx" ON "ClubSeasonLink"("clubId");

-- CreateIndex
CREATE INDEX "ClubSeasonLink_year_idx" ON "ClubSeasonLink"("year");

-- CreateIndex
CREATE INDEX "ClubSeasonLink_sortOrder_idx" ON "ClubSeasonLink"("sortOrder");

-- AddForeignKey
ALTER TABLE "ClubSeasonLink" ADD CONSTRAINT "ClubSeasonLink_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;
