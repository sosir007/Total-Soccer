-- Create city dictionary and player nationality relations.
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "importKey" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "countryId" TEXT,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PlayerNationality" (
    "playerId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerNationality_pkey" PRIMARY KEY ("playerId","countryId")
);

ALTER TABLE "Player"
ADD COLUMN "birthCountryId" TEXT,
ADD COLUMN "birthCityId" TEXT;

CREATE UNIQUE INDEX "City_importKey_key" ON "City"("importKey");
CREATE INDEX "City_uid_idx" ON "City"("uid");
CREATE INDEX "City_name_idx" ON "City"("name");
CREATE INDEX "City_countryId_idx" ON "City"("countryId");
CREATE INDEX "Player_birthCountryId_idx" ON "Player"("birthCountryId");
CREATE INDEX "Player_birthCityId_idx" ON "Player"("birthCityId");
CREATE INDEX "PlayerNationality_countryId_idx" ON "PlayerNationality"("countryId");

ALTER TABLE "City" ADD CONSTRAINT "City_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Player" ADD CONSTRAINT "Player_birthCountryId_fkey" FOREIGN KEY ("birthCountryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Player" ADD CONSTRAINT "Player_birthCityId_fkey" FOREIGN KEY ("birthCityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PlayerNationality" ADD CONSTRAINT "PlayerNationality_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PlayerNationality" ADD CONSTRAINT "PlayerNationality_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

WITH source("sortOrder", "countryUid", "cityUid", "name") AS (
  VALUES
    (1, '757', '14', '布鲁塞尔'),
    (2, '769', '247', '里尔'),
    (3, '769', '270', '巴黎'),
    (4, '796', '341', '马德里'),
    (5, '796', '370', '巴塞罗那'),
    (6, '796', '393', '希洪'),
    (7, '797', '402', '斯德哥尔摩'),
    (8, '797', '416', '赫尔辛堡'),
    (9, '776', '459', '亚历山德里亚'),
    (10, '763', '476', '布拉格斯巴达'),
    (11, '776', '494', '克雷莫纳'),
    (12, '776', '509', '米兰'),
    (13, '776', '548', '韦尔切利（维尔切利）'),
    (14, '776', '553', '罗马'),
    (15, '776', '575', '乌迪内'),
    (16, '771', '583', '柏林'),
    (17, '771', '585', '凯泽斯劳滕'),
    (18, '771', '599', '法兰克福'),
    (19, '771', '612', '汉堡'),
    (20, '771', '626', '波鸿'),
    (21, '390', '666', '芝加哥'),
    (22, '784', '715', '阿姆斯特丹'),
    (23, '784', '768', '卡特韦克'),
    (24, '788', '818', '波尔图'),
    (25, '765', '100023', '伦敦'),
    (26, '765', '100065', '纽卡斯尔'),
    (27, '765', '100075', '斯托克'),
    (28, '765', '100084', '谢菲尔德'),
    (29, '801', '100090', '斯旺西'),
    (30, '1649', '102431', '布宜诺斯艾利斯'),
    (31, '1651', '102498', '里约热内卢'),
    (32, '1651', '102499', '贝洛奥里藏特'),
    (33, '1651', '102508', '桑托斯'),
    (34, '793', '102579', '爱丁堡'),
    (35, '793', '102580', '格拉斯哥'),
    (36, '793', '102581', '阿伯丁'),
    (37, '1655', '102926', '亚松森'),
    (38, '781', '102970', '斯科普里'),
    (39, '1652', '102988', '圣地亚哥'),
    (40, '1656', '102996', '利马'),
    (41, '1657', '102998', '蒙得维的亚'),
    (42, '5', '103002', '阿尔及尔'),
    (43, '45', '103067', '约翰内斯堡'),
    (44, '34', '103107', '卡萨布兰卡'),
    (45, '379', '103113', '墨西哥城'),
    (46, '111', '103195', '香港'),
    (47, '1435', '104445', '悉尼'),
    (48, '11', '105265', '杜阿拉'),
    (49, '34', '105297', '马拉喀什'),
    (50, '765', '106595', '盖茨黑德'),
    (51, '1651', '107183', '圣保罗'),
    (52, '1651', '107184', '尼泰罗伊'),
    (53, '1649', '108540', '拉努斯'),
    (54, '765', '115260', '别根海特'),
    (55, '1651', '121264', '巴西利亚'),
    (56, '110', '128039', '天津'),
    (57, '110', '128044', '沈阳'),
    (58, '110', '128046', '上海'),
    (59, '110', '128055', '广州'),
    (60, '110', '128057', '大连'),
    (61, '1438', '130069', '克莱斯特彻奇'),
    (62, '110', '131134', '长春'),
    (63, '110', '131171', '南京'),
    (64, '110', '131180', '鞍山'),
    (65, '763', '136111', '拉科夫尼克'),
    (66, '1651', '309611', '圣贡萨洛'),
    (67, '1651', '310633', '阿拉拉奎拉'),
    (68, '1651', '310886', '特莱斯考拉考斯'),
    (69, '785', '410018', '托伯莫尔'),
    (70, '116', '781367', '鹿儿岛县'),
    (71, '784', '856523', '荷恩（霍恩）'),
    (72, '784', '856803', '沃尔豪特'),
    (73, '771', '892777', '迪伦'),
    (74, '764', '940367', '阿斯纳斯'),
    (75, '1649', '955863', '伯纳尔'),
    (76, '1649', '955869', '英格涅罗布鲁吉'),
    (77, '755', '1300072', '维也纳'),
    (78, '759', '1300142', '莫斯塔尔'),
    (79, '761', '1300226', '斯拉沃尼亚布罗德'),
    (80, '763', '1300275', '布拉格'),
    (81, '763', '1300286', '兹林'),
    (82, '773', '1300576', '布达佩斯'),
    (83, '785', '1300831', '贝尔法斯特'),
    (84, '789', '1300899', '都柏林'),
    (85, '791', '1301073', '莫斯科'),
    (86, '798', '1301199', '巴塞尔'),
    (87, '799', '1301222', '伊斯坦布尔'),
    (88, '801', '1301309', '加的夫'),
    (89, '757', '3201958', '莱贝克'),
    (90, '793', '5202244', '阿丁斯顿'),
    (91, '793', '5202285', '拉纳克'),
    (92, '793', '5202285', '拉纳克'),
    (93, '794', '5606305', '斯尼纳'),
    (94, '110', '5620163', '江门'),
    (95, '110', '5620172', '郑州'),
    (96, '110', '5627781', '烟台'),
    (97, '796', '7444856', '拉科鲁尼亚'),
    (98, '760', '7500898', '博泰夫格勒'),
    (99, '790', '7540003', '雷希察'),
    (100, '774', '7840015', '埃伊尔斯塔济'),
    (101, '774', '7840015', '埃伊尔斯塔济'),
    (102, '765', '7940519', '罗姆福'),
    (103, '776', '7982998', '布莱拉'),
    (104, '776', '7983030', '蒙泰贝卢纳'),
    (105, '776', '7983225', '特拉瓦利亚托'),
    (106, '776', '7987966', '鲁达'),
    (107, '776', '7988136', '马里亚诺德尔夫留利'),
    (108, '757', '8153980', '贝尔塞尔'),
    (109, '769', '8431417', '讷莱米讷'),
    (110, '769', '8431417', '讷莱米讷'),
    (111, '765', '8600114', '维克菲尔德'),
    (112, '765', '8600203', '斯坦福郡汉利'),
    (113, '765', '8600624', '阿兴顿'),
    (114, '765', '8600855', '汉普顿'),
    (115, '771', '8700571', '哈尔滕'),
    (116, '1657', '8825016', '卡内洛内斯'),
    (117, '1651', '8825072', '马日'),
    (118, '1653', '8826920', '图尔博（图尔波）'),
    (119, '38', '13127900', '阿博'),
    (120, '1651', '19302206', '特雷斯科罗阿斯（特雷斯科拉松伊斯）'),
    (121, '765', '28070161', '海顿'),
    (122, '765', '29085795', '惠斯顿'),
    (123, '761', '35000122', '马卡斯卡'),
    (124, '772', '36062988', '斯基摩尼科'),
    (125, '776', '43126232', '卡萨布尔塔诺埃杜尼蒂'),
    (126, '776', '43126232', '卡萨尔步塔诺埃杜尼蒂'),
    (127, '776', '43147525', '卡萨诺（卡萨诺瓦洛纳蒂）'),
    (128, '776', '43149849', '维尼亚莱蒙费拉托'),
    (129, '769', '49055721', '朗瓜朗'),
    (130, '769', '85020417', '迪涅莱班'),
    (131, '110', '131171', '南京'),
    (132, '797', '-', '林哈姆'),
    (133, '797', '-', 'Limhamn')
),
prepared AS (
  SELECT
    'city:' || "countryUid" || ':' || "cityUid" || ':' || "name" AS "importKey",
    "countryUid",
    "cityUid",
    "name",
    MIN("sortOrder") AS "sortOrder"
  FROM source
  GROUP BY "countryUid", "cityUid", "name"
)
INSERT INTO "City" ("id", "importKey", "uid", "name", "countryId", "sortOrder", "createdAt", "updatedAt")
SELECT
  'city_' || md5(prepared."importKey"),
  prepared."importKey",
  prepared."cityUid",
  prepared."name",
  country."id",
  prepared."sortOrder",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM prepared
LEFT JOIN LATERAL (
  SELECT "id"
  FROM "Country"
  WHERE "uid" = prepared."countryUid"
  ORDER BY "name" ASC
  LIMIT 1
) country ON true
ON CONFLICT ("importKey") DO UPDATE SET
  "name" = EXCLUDED."name",
  "countryId" = EXCLUDED."countryId",
  "sortOrder" = EXCLUDED."sortOrder",
  "updatedAt" = CURRENT_TIMESTAMP;

WITH city_by_uid AS (
  SELECT DISTINCT ON ("uid") "id", "uid", "name", "countryId"
  FROM "City"
  WHERE "uid" <> '-'
  ORDER BY "uid", "sortOrder" ASC, "name" ASC
)
UPDATE "Player" player
SET
  "birthCityId" = city_by_uid."id",
  "birthCountryId" = COALESCE(city_by_uid."countryId", player."birthCountryId"),
  "birthCityUid" = city_by_uid."uid",
  "birthCity" = city_by_uid."name"
FROM city_by_uid
WHERE player."birthCityUid" IS NOT NULL
  AND player."birthCityUid" = city_by_uid."uid";

UPDATE "Player" player
SET "birthCountryId" = country."id"
FROM "Country" country
WHERE player."birthCountryId" IS NULL
  AND player."birthCity" ILIKE '%(' || country."name" || ')%';

INSERT INTO "PlayerNationality" ("playerId", "countryId")
SELECT "id", "countryId"
FROM "Player"
WHERE "countryId" IS NOT NULL
ON CONFLICT DO NOTHING;
