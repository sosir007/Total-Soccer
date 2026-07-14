ALTER TABLE "Player"
ADD COLUMN "initialClubId" TEXT;

CREATE INDEX "Player_initialClubId_idx" ON "Player"("initialClubId");

ALTER TABLE "Player"
ADD CONSTRAINT "Player_initialClubId_fkey"
FOREIGN KEY ("initialClubId") REFERENCES "Club"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
