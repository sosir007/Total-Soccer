ALTER TABLE "Club"
ADD COLUMN "formerName" TEXT,
ADD COLUMN "alias" TEXT;

WITH seed_clubs("countryName", "clubName", "uid", "formerName", "alias") AS (
  VALUES
    ('墨西哥', '内卡萨', '1258', NULL, NULL),
    ('哥斯达黎加', '萨普里萨', '102367', NULL, NULL),
    ('埃及', '开罗国民', '106756', NULL, NULL),
    ('突尼斯', '沙希尔星', '131255', NULL, NULL),
    ('厄瓜多尔', '基多大学', '5270338', NULL, NULL),
    ('民主刚果', '马赞姆贝', '5341691', NULL, NULL),
    ('韩国', '城南FC', '200373', '城南一和天马', NULL),
    ('卡塔尔', '萨德', '102853', NULL, NULL),
    ('阿联酋', '阿布扎比半岛', '135450', NULL, NULL),
    ('摩洛哥', '卡萨布兰卡拉贾', '1201011', NULL, NULL),
    ('阿联酋', '阿尔艾因', '950376', NULL, NULL)
),
resolved_clubs AS (
  SELECT
    seed_clubs."countryName",
    seed_clubs."clubName",
    seed_clubs."uid",
    seed_clubs."formerName",
    seed_clubs."alias",
    country."id" AS "countryId",
    country."uid" AS "countryUid",
    country."federation" AS "federation",
    country."federationId" AS "federationId"
  FROM seed_clubs
  LEFT JOIN "Country" country ON country."name" = seed_clubs."countryName"
),
updated_clubs AS (
  UPDATE "Club" club
  SET
    "uid" = resolved_clubs."uid",
    "name" = resolved_clubs."clubName",
    "formerName" = COALESCE(club."formerName", resolved_clubs."formerName"),
    "alias" = COALESCE(club."alias", resolved_clubs."alias"),
    "exists" = true,
    "visibleInCatalog" = false,
    "countryId" = COALESCE(club."countryId", resolved_clubs."countryId"),
    "countryUid" = COALESCE(club."countryUid", resolved_clubs."countryUid"),
    "country" = COALESCE(club."country", resolved_clubs."countryName"),
    "federationId" = COALESCE(club."federationId", resolved_clubs."federationId"),
    "federation" = COALESCE(club."federation", resolved_clubs."federation"),
    "updatedAt" = CURRENT_TIMESTAMP
  FROM resolved_clubs
  WHERE club."uid" = resolved_clubs."uid" OR club."name" = resolved_clubs."clubName"
  RETURNING club."uid"
)
INSERT INTO "Club" (
  "id",
  "importKey",
  "uid",
  "name",
  "formerName",
  "alias",
  "exists",
  "visibleInCatalog",
  "countryId",
  "countryUid",
  "country",
  "federationId",
  "federation",
  "createdAt",
  "updatedAt"
)
SELECT
  'seed_club_world_cup_' || resolved_clubs."uid",
  'seed:club:' || resolved_clubs."uid",
  resolved_clubs."uid",
  resolved_clubs."clubName",
  resolved_clubs."formerName",
  resolved_clubs."alias",
  true,
  false,
  resolved_clubs."countryId",
  resolved_clubs."countryUid",
  resolved_clubs."countryName",
  resolved_clubs."federationId",
  resolved_clubs."federation",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM resolved_clubs
WHERE NOT EXISTS (
  SELECT 1
  FROM "Club" club
  WHERE club."uid" = resolved_clubs."uid" OR club."name" = resolved_clubs."clubName"
);

UPDATE "Club"
SET
  "alias" = COALESCE("alias", '老虎大学'),
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "uid" = '1260';

UPDATE "Club"
SET
  "formerName" = COALESCE("formerName", '广州恒大'),
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "uid" = '409';
