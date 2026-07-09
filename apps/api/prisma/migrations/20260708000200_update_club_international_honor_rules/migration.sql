DELETE FROM "HonorRule"
WHERE "code" = 'CLUB_INTERNATIONAL_LEVEL_3_CUP'
  AND "isSystem" = true;

UPDATE "HonorRule"
SET
  "name" = '俱乐部国际一级杯赛',
  "targetType" = 'CLUB',
  "category" = '国际',
  "level" = '一级',
  "format" = '杯赛',
  "scopeType" = 'GLOBAL',
  "baseScore" = 16,
  "championScore" = 16,
  "runnerUpScore" = 8,
  "thirdPlaceScore" = 4.8,
  "fourthPlaceScore" = 3.2,
  "semiFinalistScore" = 4,
  "coefficient" = 1,
  "qualityCoefficient" = 1,
  "placementScope" = 'TOP_FOUR',
  "conversionType" = 'CLUB_WORLD_CUP_STAGE',
  "sortOrder" = 110,
  "remark" = '世俱杯等俱乐部国际一级杯赛；2025 前按阶段换算为 8 分，2025 起为 16 分。',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "code" = 'CLUB_INTERNATIONAL_LEVEL_1_CUP'
  AND "isSystem" = true;

UPDATE "HonorRule"
SET
  "name" = '俱乐部国际二级杯赛',
  "targetType" = 'CLUB',
  "category" = '国际',
  "level" = '二级',
  "format" = '杯赛',
  "scopeType" = 'GLOBAL',
  "baseScore" = 6,
  "championScore" = 6,
  "runnerUpScore" = 3,
  "thirdPlaceScore" = NULL,
  "fourthPlaceScore" = NULL,
  "semiFinalistScore" = NULL,
  "coefficient" = 1,
  "qualityCoefficient" = 1,
  "placementScope" = 'TOP_TWO',
  "conversionType" = 'NONE',
  "sortOrder" = 120,
  "remark" = '丰田杯、洲际杯等单场世界冠军杯。',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "code" = 'CLUB_INTERNATIONAL_LEVEL_2_CUP'
  AND "isSystem" = true;
