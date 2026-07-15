UPDATE "HonorRule"
SET
  "name" = '国家队国际三级',
  "targetType" = 'COUNTRY',
  "category" = '国际',
  "level" = '三级',
  "format" = '杯赛',
  "scopeType" = 'GLOBAL',
  "baseScore" = 4,
  "championScore" = 4,
  "runnerUpScore" = 2,
  "thirdPlaceScore" = 1.2,
  "fourthPlaceScore" = 0.8,
  "semiFinalistScore" = 1,
  "coefficient" = 1,
  "qualityCoefficient" = 1,
  "placementScope" = 'TOP_FOUR',
  "conversionType" = 'OLYMPIC_STAGE',
  "sortOrder" = 30,
  "remark" = '泛美锦标赛等国家队国际三级赛事；奥运会男足按年份阶段换算。',
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "code" = 'COUNTRY_INTERNATIONAL_LEVEL_3_OTHER'
  AND "isSystem" = true;
