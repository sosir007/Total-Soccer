ALTER TABLE "AwardEdition"
ADD COLUMN "month" INTEGER;

CREATE INDEX "AwardEdition_month_idx" ON "AwardEdition"("month");
