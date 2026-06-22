ALTER TABLE "HonorRule"
  ADD COLUMN "targetType" "CompetitionTargetType" NOT NULL DEFAULT 'COUNTRY',
  ADD COLUMN "placement" "CompetitionStandingPlacement" NOT NULL DEFAULT 'CHAMPION',
  ADD COLUMN "baseScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN "enabled" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "remark" TEXT;

ALTER TABLE "HonorRule" ALTER COLUMN "category" DROP NOT NULL;

CREATE INDEX "HonorRule_targetType_idx" ON "HonorRule"("targetType");
CREATE INDEX "HonorRule_category_idx" ON "HonorRule"("category");
CREATE INDEX "HonorRule_placement_idx" ON "HonorRule"("placement");
CREATE INDEX "HonorRule_enabled_idx" ON "HonorRule"("enabled");
