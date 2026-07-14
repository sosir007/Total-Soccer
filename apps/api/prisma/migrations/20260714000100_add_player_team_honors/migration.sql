CREATE TYPE "PlayerTeamHonorSourceType" AS ENUM ('MANUAL', 'CAREER_MATCH', 'IMPORT');

CREATE TYPE "PlayerTeamHonorStatus" AS ENUM ('CONFIRMED', 'PENDING', 'EXCLUDED');

CREATE TABLE "PlayerTeamHonor" (
  "id" TEXT NOT NULL,
  "playerId" TEXT NOT NULL,
  "standingId" TEXT NOT NULL,
  "careerId" TEXT,
  "sourceType" "PlayerTeamHonorSourceType" NOT NULL DEFAULT 'MANUAL',
  "status" "PlayerTeamHonorStatus" NOT NULL DEFAULT 'CONFIRMED',
  "remark" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "PlayerTeamHonor_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PlayerTeamHonor_playerId_standingId_key"
  ON "PlayerTeamHonor"("playerId", "standingId");

CREATE INDEX "PlayerTeamHonor_playerId_idx" ON "PlayerTeamHonor"("playerId");

CREATE INDEX "PlayerTeamHonor_standingId_idx" ON "PlayerTeamHonor"("standingId");

CREATE INDEX "PlayerTeamHonor_careerId_idx" ON "PlayerTeamHonor"("careerId");

CREATE INDEX "PlayerTeamHonor_sourceType_idx" ON "PlayerTeamHonor"("sourceType");

CREATE INDEX "PlayerTeamHonor_status_idx" ON "PlayerTeamHonor"("status");

ALTER TABLE "PlayerTeamHonor"
  ADD CONSTRAINT "PlayerTeamHonor_playerId_fkey"
  FOREIGN KEY ("playerId") REFERENCES "Player"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PlayerTeamHonor"
  ADD CONSTRAINT "PlayerTeamHonor_standingId_fkey"
  FOREIGN KEY ("standingId") REFERENCES "CompetitionStanding"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PlayerTeamHonor"
  ADD CONSTRAINT "PlayerTeamHonor_careerId_fkey"
  FOREIGN KEY ("careerId") REFERENCES "PlayerCareer"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
