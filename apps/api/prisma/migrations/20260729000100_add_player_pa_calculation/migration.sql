CREATE TABLE "PlayerPaEvaluation" (
  "id" TEXT NOT NULL,
  "playerId" TEXT NOT NULL,
  "initialPa" INTEGER,
  "reincarnationPa" TEXT,
  "superDiamondPa" TEXT,
  "websitePa" TEXT,
  "doubaoPa" TEXT,
  "dpPa" TEXT,
  "yuanbaoPa" TEXT,
  "qianwenPa" TEXT,
  "geminiPa" TEXT,
  "codexPa" TEXT,
  "coreEvaluation" TEXT,
  "playerPositioning" TEXT,
  "teamContribution" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PlayerPaEvaluation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PlayerPaAdjustmentBatch" (
  "id" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "remark" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PlayerPaAdjustmentBatch_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PlayerPaAdjustmentEntry" (
  "id" TEXT NOT NULL,
  "batchId" TEXT NOT NULL,
  "playerId" TEXT NOT NULL,
  "pa" INTEGER,
  "remark" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PlayerPaAdjustmentEntry_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PlayerPaEvaluation_playerId_key" ON "PlayerPaEvaluation"("playerId");
CREATE INDEX "PlayerPaEvaluation_playerId_idx" ON "PlayerPaEvaluation"("playerId");
CREATE INDEX "PlayerPaAdjustmentBatch_label_idx" ON "PlayerPaAdjustmentBatch"("label");
CREATE INDEX "PlayerPaAdjustmentBatch_createdAt_idx" ON "PlayerPaAdjustmentBatch"("createdAt");
CREATE UNIQUE INDEX "PlayerPaAdjustmentEntry_batchId_playerId_key" ON "PlayerPaAdjustmentEntry"("batchId", "playerId");
CREATE INDEX "PlayerPaAdjustmentEntry_batchId_idx" ON "PlayerPaAdjustmentEntry"("batchId");
CREATE INDEX "PlayerPaAdjustmentEntry_playerId_idx" ON "PlayerPaAdjustmentEntry"("playerId");

ALTER TABLE "PlayerPaEvaluation"
  ADD CONSTRAINT "PlayerPaEvaluation_playerId_fkey"
  FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PlayerPaAdjustmentEntry"
  ADD CONSTRAINT "PlayerPaAdjustmentEntry_batchId_fkey"
  FOREIGN KEY ("batchId") REFERENCES "PlayerPaAdjustmentBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PlayerPaAdjustmentEntry"
  ADD CONSTRAINT "PlayerPaAdjustmentEntry_playerId_fkey"
  FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

DO $$
DECLARE
  pele_id TEXT;
BEGIN
  SELECT "id"
    INTO pele_id
    FROM "Player"
   WHERE "chineseName" ILIKE '%贝利%'
      OR "englishName" ILIKE '%Pelé%'
      OR "englishName" ILIKE '%Pele%'
   ORDER BY "pa" DESC NULLS LAST, "createdAt" ASC
   LIMIT 1;

  IF pele_id IS NOT NULL THEN
    UPDATE "Player"
       SET "pa" = 197
     WHERE "id" = pele_id;

    INSERT INTO "PlayerPaEvaluation" (
      "id",
      "playerId",
      "initialPa",
      "reincarnationPa",
      "superDiamondPa",
      "websitePa",
      "doubaoPa",
      "dpPa",
      "yuanbaoPa",
      "qianwenPa",
      "geminiPa",
      "codexPa",
      "coreEvaluation",
      "playerPositioning",
      "teamContribution"
    )
    VALUES (
      'seed_player_pa_evaluation_pele',
      pele_id,
      197,
      '200',
      '200',
      '199',
      '197',
      '200',
      '195-200',
      '190-200',
      '198',
      '197',
      '三夺世界杯冠军，足坛历史第一球王，千球纪录保持者',
      '历史级球王，游戏中的终极球员',
      NULL
    )
    ON CONFLICT ("playerId") DO UPDATE SET
      "initialPa" = COALESCE("PlayerPaEvaluation"."initialPa", EXCLUDED."initialPa"),
      "reincarnationPa" = COALESCE("PlayerPaEvaluation"."reincarnationPa", EXCLUDED."reincarnationPa"),
      "superDiamondPa" = COALESCE("PlayerPaEvaluation"."superDiamondPa", EXCLUDED."superDiamondPa"),
      "websitePa" = COALESCE("PlayerPaEvaluation"."websitePa", EXCLUDED."websitePa"),
      "doubaoPa" = COALESCE("PlayerPaEvaluation"."doubaoPa", EXCLUDED."doubaoPa"),
      "dpPa" = COALESCE("PlayerPaEvaluation"."dpPa", EXCLUDED."dpPa"),
      "yuanbaoPa" = COALESCE("PlayerPaEvaluation"."yuanbaoPa", EXCLUDED."yuanbaoPa"),
      "qianwenPa" = COALESCE("PlayerPaEvaluation"."qianwenPa", EXCLUDED."qianwenPa"),
      "geminiPa" = COALESCE("PlayerPaEvaluation"."geminiPa", EXCLUDED."geminiPa"),
      "codexPa" = COALESCE("PlayerPaEvaluation"."codexPa", EXCLUDED."codexPa"),
      "coreEvaluation" = COALESCE("PlayerPaEvaluation"."coreEvaluation", EXCLUDED."coreEvaluation"),
      "playerPositioning" = COALESCE("PlayerPaEvaluation"."playerPositioning", EXCLUDED."playerPositioning"),
      "teamContribution" = COALESCE("PlayerPaEvaluation"."teamContribution", EXCLUDED."teamContribution"),
      "updatedAt" = CURRENT_TIMESTAMP;
  END IF;
END $$;
