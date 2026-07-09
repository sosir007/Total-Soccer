ALTER TABLE "Competition"
  ADD COLUMN "alias" TEXT;

CREATE INDEX "Competition_alias_idx" ON "Competition"("alias");

UPDATE "Competition"
SET
  "alias" = '世界杯',
  "externalUrl" = COALESCE(NULLIF("externalUrl", ''), 'https://en.wikipedia.org/wiki/FIFA_World_Cup'),
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "code" = 'FIFA_WORLD_CUP';

UPDATE "Competition"
SET
  "alias" = '联合会杯',
  "externalUrl" = COALESCE(NULLIF("externalUrl", ''), 'https://en.wikipedia.org/wiki/FIFA_Confederations_Cup'),
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "code" = 'FIFA_CONFEDERATIONS_CUP';

UPDATE "Competition"
SET
  "alias" = '奥运男足',
  "externalUrl" = COALESCE(NULLIF("externalUrl", ''), 'https://en.wikipedia.org/wiki/Football_at_the_Summer_Olympics'),
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "code" = 'OLYMPIC_MENS_FOOTBALL';

UPDATE "Competition"
SET
  "alias" = '欧洲杯',
  "externalUrl" = COALESCE(NULLIF("externalUrl", ''), 'https://en.wikipedia.org/wiki/UEFA_European_Championship'),
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "code" = 'UEFA_EURO';

UPDATE "Competition"
SET
  "name" = '南美足联美洲杯',
  "alias" = '美洲杯',
  "externalUrl" = COALESCE(NULLIF("externalUrl", ''), 'https://en.wikipedia.org/wiki/Copa_Am%C3%A9rica'),
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "code" = 'COPA_AMERICA';

UPDATE "Competition"
SET
  "alias" = '亚洲杯',
  "externalUrl" = COALESCE(NULLIF("externalUrl", ''), 'https://en.wikipedia.org/wiki/AFC_Asian_Cup'),
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "code" = 'AFC_ASIAN_CUP';

UPDATE "Competition"
SET
  "alias" = '非洲杯',
  "externalUrl" = COALESCE(NULLIF("externalUrl", ''), 'https://en.wikipedia.org/wiki/Africa_Cup_of_Nations'),
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "code" = 'AFRICA_CUP';

UPDATE "Competition"
SET
  "alias" = '金杯',
  "externalUrl" = COALESCE(NULLIF("externalUrl", ''), 'https://en.wikipedia.org/wiki/CONCACAF_Gold_Cup'),
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "code" = 'CONCACAF_GOLD_CUP';

UPDATE "Competition"
SET
  "alias" = '大洋洲杯',
  "externalUrl" = COALESCE(NULLIF("externalUrl", ''), 'https://en.wikipedia.org/wiki/OFC_Men%27s_Nations_Cup'),
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "code" = 'OFC_NATIONS_CUP';

UPDATE "Competition"
SET
  "alias" = '世俱杯',
  "externalUrl" = COALESCE(NULLIF("externalUrl", ''), 'https://en.wikipedia.org/wiki/FIFA_Club_World_Cup'),
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "code" = 'FIFA_CLUB_WORLD_CUP';
