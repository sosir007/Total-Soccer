ALTER TABLE "Competition"
ADD COLUMN "includeInStats" BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX "Competition_includeInStats_idx" ON "Competition"("includeInStats");
