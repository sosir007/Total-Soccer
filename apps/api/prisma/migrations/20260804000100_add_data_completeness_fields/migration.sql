ALTER TABLE "Competition"
  ADD COLUMN "dataComplete" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "dataUpdatedAt" TIMESTAMP(3),
  ADD COLUMN "dataRemark" TEXT;

ALTER TABLE "Award"
  ADD COLUMN "dataComplete" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "dataUpdatedAt" TIMESTAMP(3),
  ADD COLUMN "dataRemark" TEXT;

CREATE INDEX "Competition_dataComplete_idx" ON "Competition"("dataComplete");
CREATE INDEX "Award_dataComplete_idx" ON "Award"("dataComplete");
