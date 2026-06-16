-- Drop obsolete persisted import errors.
DROP TABLE IF EXISTS "ImportError";

-- Create dictionary tables.
CREATE TABLE "Confederation" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Confederation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PotentialRange" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PotentialRange_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Ethnicity" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ethnicity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HairColor" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HairColor_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PreferredFoot" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PreferredFoot_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Confederation_uid_key" ON "Confederation"("uid");
CREATE UNIQUE INDEX "PotentialRange_code_key" ON "PotentialRange"("code");
CREATE UNIQUE INDEX "Ethnicity_code_key" ON "Ethnicity"("code");
CREATE UNIQUE INDEX "HairColor_code_key" ON "HairColor"("code");
CREATE UNIQUE INDEX "PreferredFoot_code_key" ON "PreferredFoot"("code");

-- Add new columns as nullable first so existing rows can be backfilled.
ALTER TABLE "Country"
ADD COLUMN "importKey" TEXT,
ADD COLUMN "federationId" TEXT;

ALTER TABLE "Club"
ADD COLUMN "importKey" TEXT,
ADD COLUMN "exists" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "countryId" TEXT,
ADD COLUMN "federationId" TEXT;

ALTER TABLE "Player"
ADD COLUMN "importKey" TEXT,
ADD COLUMN "hairColorId" TEXT,
ADD COLUMN "ethnicityId" TEXT,
ADD COLUMN "preferredFootId" TEXT,
ADD COLUMN "playerTypeId" TEXT,
ADD COLUMN "confederationId" TEXT;

UPDATE "Country"
SET "importKey" = CASE
  WHEN "uid" IS NOT NULL AND "uid" <> '-' THEN '国家汇总:' || "uid"
  ELSE '国家汇总:legacy-' || "id"
END;

UPDATE "Club"
SET "importKey" = CASE
  WHEN "uid" IS NOT NULL AND "uid" <> '-' THEN '俱乐部汇总:' || "uid"
  ELSE '俱乐部汇总:legacy-' || "id"
END;

UPDATE "Player"
SET "importKey" = CASE
  WHEN "uid" IS NOT NULL AND "uid" <> '-' THEN '球员总表:' || "uid"
  ELSE '球员总表:legacy-' || "id"
END;

ALTER TABLE "Country" ALTER COLUMN "importKey" SET NOT NULL;
ALTER TABLE "Club" ALTER COLUMN "importKey" SET NOT NULL;
ALTER TABLE "Player" ALTER COLUMN "importKey" SET NOT NULL;

-- Replace old uid uniqueness with importKey uniqueness; uid may now be "-".
DROP INDEX IF EXISTS "Country_uid_key";
DROP INDEX IF EXISTS "Club_uid_key";
DROP INDEX IF EXISTS "Player_uid_key";

CREATE UNIQUE INDEX "Country_importKey_key" ON "Country"("importKey");
CREATE UNIQUE INDEX "Club_importKey_key" ON "Club"("importKey");
CREATE UNIQUE INDEX "Player_importKey_key" ON "Player"("importKey");

CREATE INDEX "Country_federationId_idx" ON "Country"("federationId");
CREATE INDEX "Club_countryId_idx" ON "Club"("countryId");
CREATE INDEX "Club_federationId_idx" ON "Club"("federationId");
CREATE INDEX "Player_confederationId_idx" ON "Player"("confederationId");
CREATE INDEX "Player_hairColorId_idx" ON "Player"("hairColorId");
CREATE INDEX "Player_ethnicityId_idx" ON "Player"("ethnicityId");
CREATE INDEX "Player_preferredFootId_idx" ON "Player"("preferredFootId");
CREATE INDEX "Player_playerTypeId_idx" ON "Player"("playerTypeId");

ALTER TABLE "Country" ADD CONSTRAINT "Country_federationId_fkey" FOREIGN KEY ("federationId") REFERENCES "Confederation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Club" ADD CONSTRAINT "Club_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Club" ADD CONSTRAINT "Club_federationId_fkey" FOREIGN KEY ("federationId") REFERENCES "Confederation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Player" ADD CONSTRAINT "Player_confederationId_fkey" FOREIGN KEY ("confederationId") REFERENCES "Confederation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Player" ADD CONSTRAINT "Player_hairColorId_fkey" FOREIGN KEY ("hairColorId") REFERENCES "HairColor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Player" ADD CONSTRAINT "Player_ethnicityId_fkey" FOREIGN KEY ("ethnicityId") REFERENCES "Ethnicity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Player" ADD CONSTRAINT "Player_preferredFootId_fkey" FOREIGN KEY ("preferredFootId") REFERENCES "PreferredFoot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Player" ADD CONSTRAINT "Player_playerTypeId_fkey" FOREIGN KEY ("playerTypeId") REFERENCES "PlayerType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
