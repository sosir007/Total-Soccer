ALTER TABLE "CompetitionEdition"
  ADD COLUMN "championGroupKey" TEXT,
  ADD COLUMN "championShare" INTEGER;

CREATE INDEX "CompetitionEdition_championGroupKey_idx" ON "CompetitionEdition"("championGroupKey");
