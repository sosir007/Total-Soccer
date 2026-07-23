-- Add optional competition links for event-specific awards.
ALTER TABLE "Award" ADD COLUMN "competitionId" TEXT;

ALTER TABLE "AwardEdition" ADD COLUMN "competitionEditionId" TEXT;

CREATE INDEX "Award_competitionId_idx" ON "Award"("competitionId");

CREATE INDEX "AwardEdition_competitionEditionId_idx" ON "AwardEdition"("competitionEditionId");

ALTER TABLE "Award"
  ADD CONSTRAINT "Award_competitionId_fkey"
  FOREIGN KEY ("competitionId") REFERENCES "Competition"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AwardEdition"
  ADD CONSTRAINT "AwardEdition_competitionEditionId_fkey"
  FOREIGN KEY ("competitionEditionId") REFERENCES "CompetitionEdition"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
