CREATE TYPE "LifecycleStatus" AS ENUM ('CURRENT', 'DISCONTINUED');

ALTER TABLE "Competition"
ADD COLUMN "lifecycleStatus" "LifecycleStatus" NOT NULL DEFAULT 'CURRENT';

ALTER TABLE "Award"
ADD COLUMN "lifecycleStatus" "LifecycleStatus" NOT NULL DEFAULT 'CURRENT';

UPDATE "Competition"
SET "lifecycleStatus" = 'DISCONTINUED'
WHERE "code" IN ('FIFA_CONFEDERATIONS_CUP', 'EUROPEAN_SOUTH_AMERICAN_CUP');

CREATE INDEX "Competition_lifecycleStatus_idx" ON "Competition"("lifecycleStatus");
CREATE INDEX "Award_lifecycleStatus_idx" ON "Award"("lifecycleStatus");
