-- Store player dates as millisecond timestamps.
-- Existing lakesheet birthday values were parsed from 1900-based seconds as Unix seconds,
-- so imported player birthdays are shifted forward by 25569 days. Fix them while converting.
ALTER TABLE "Player"
ALTER COLUMN "birthDate" TYPE DOUBLE PRECISION USING (
  CASE
    WHEN "birthDate" IS NULL THEN NULL
    WHEN "importKey" LIKE '球员总表:%' THEN EXTRACT(EPOCH FROM ("birthDate" - INTERVAL '25569 days')) * 1000
    ELSE EXTRACT(EPOCH FROM "birthDate") * 1000
  END
),
ALTER COLUMN "deathDate" TYPE DOUBLE PRECISION USING (
  CASE
    WHEN "deathDate" IS NULL THEN NULL
    ELSE EXTRACT(EPOCH FROM "deathDate") * 1000
  END
);
