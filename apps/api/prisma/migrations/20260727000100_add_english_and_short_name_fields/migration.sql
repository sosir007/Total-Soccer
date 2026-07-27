ALTER TABLE "Country" ADD COLUMN "englishName" TEXT;
ALTER TABLE "Country" ADD COLUMN "shortName" TEXT;

ALTER TABLE "Club" ADD COLUMN "englishName" TEXT;
ALTER TABLE "Club" ADD COLUMN "shortName" TEXT;

ALTER TABLE "Competition" ADD COLUMN "englishName" TEXT;
ALTER TABLE "Competition" ADD COLUMN "shortName" TEXT;

ALTER TABLE "Award" ADD COLUMN "englishName" TEXT;
ALTER TABLE "Award" ADD COLUMN "shortName" TEXT;

CREATE INDEX "Country_englishName_idx" ON "Country"("englishName");
CREATE INDEX "Country_shortName_idx" ON "Country"("shortName");
CREATE INDEX "Club_englishName_idx" ON "Club"("englishName");
CREATE INDEX "Club_shortName_idx" ON "Club"("shortName");
CREATE INDEX "Competition_englishName_idx" ON "Competition"("englishName");
CREATE INDEX "Competition_shortName_idx" ON "Competition"("shortName");
CREATE INDEX "Award_englishName_idx" ON "Award"("englishName");
CREATE INDEX "Award_shortName_idx" ON "Award"("shortName");
