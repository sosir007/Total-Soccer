ALTER TABLE "PlayerHonor" ALTER COLUMN "score" SET DEFAULT 1;
ALTER TABLE "PlayerHonor" ADD COLUMN "externalUrl" TEXT;
ALTER TABLE "PlayerHonor" ADD COLUMN "remark" TEXT;
ALTER TABLE "PlayerHonor" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "PlayerHonor" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "PlayerHonor" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "PlayerHonor" DROP CONSTRAINT "PlayerHonor_playerId_fkey";
ALTER TABLE "PlayerHonor" ADD CONSTRAINT "PlayerHonor_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "PlayerHonor_playerId_idx" ON "PlayerHonor"("playerId");
CREATE INDEX "PlayerHonor_season_idx" ON "PlayerHonor"("season");
CREATE INDEX "PlayerHonor_sortOrder_idx" ON "PlayerHonor"("sortOrder");
