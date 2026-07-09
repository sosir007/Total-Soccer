ALTER TABLE "Club"
ADD COLUMN "visibleInCatalog" BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX "Club_visibleInCatalog_idx" ON "Club"("visibleInCatalog");

WITH seed_clubs("countryName", "clubName", "uid", "remark") AS (
  VALUES
    ('巴西', '科林蒂安', '316', NULL),
    ('巴西', '瓦斯科达伽马', '339', NULL),
    ('沙特阿拉伯', '吉达联合', '106063', NULL),
    ('巴西', '巴西国际', '326', NULL),
    ('日本', '浦和红钻', '1195', NULL),
    ('墨西哥', '帕丘卡', '116204', NULL),
    ('阿根廷', '拉普拉塔大学生', '85', NULL),
    ('韩国', '浦项制铁', '106818', NULL),
    ('墨西哥', '蒙特雷', '1257', NULL),
    ('中国', '广州队', '409', '曾用名：广州恒大'),
    ('阿根廷', '圣洛伦索', '96', NULL),
    ('新西兰', '奥克兰城', '1301557', NULL),
    ('日本', '广岛三箭', '1193', NULL),
    ('日本', '鹿岛鹿角', '1189', NULL),
    ('哥伦比亚', '国民竞技', '427', NULL),
    ('沙特阿拉伯', '利雅得新月', '102852', NULL),
    ('巴西', '弗鲁米嫩塞', '323', NULL)
),
resolved_clubs AS (
  SELECT
    seed_clubs."countryName",
    seed_clubs."clubName",
    seed_clubs."uid",
    seed_clubs."remark",
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
    "exists" = true,
    "visibleInCatalog" = false,
    "countryId" = COALESCE(club."countryId", resolved_clubs."countryId"),
    "countryUid" = COALESCE(club."countryUid", resolved_clubs."countryUid"),
    "country" = COALESCE(club."country", resolved_clubs."countryName"),
    "federationId" = COALESCE(club."federationId", resolved_clubs."federationId"),
    "federation" = COALESCE(club."federation", resolved_clubs."federation"),
    "remark" = COALESCE(club."remark", resolved_clubs."remark"),
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
  "exists",
  "visibleInCatalog",
  "countryId",
  "countryUid",
  "country",
  "federationId",
  "federation",
  "remark",
  "createdAt",
  "updatedAt"
)
SELECT
  'seed_club_world_cup_' || resolved_clubs."uid",
  'seed:club:' || resolved_clubs."uid",
  resolved_clubs."uid",
  resolved_clubs."clubName",
  true,
  false,
  resolved_clubs."countryId",
  resolved_clubs."countryUid",
  resolved_clubs."countryName",
  resolved_clubs."federationId",
  resolved_clubs."federation",
  resolved_clubs."remark",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM resolved_clubs
WHERE NOT EXISTS (
  SELECT 1
  FROM "Club" club
  WHERE club."uid" = resolved_clubs."uid" OR club."name" = resolved_clubs."clubName"
);
