-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "chineseName" TEXT NOT NULL,
    "englishName" TEXT,
    "primaryRole" TEXT,
    "ca" INTEGER,
    "pa" INTEGER,
    "countryId" TEXT,
    "clubId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "federation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT,
    "federation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HonorRule" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "championScore" DOUBLE PRECISION,
    "runnerUpScore" DOUBLE PRECISION,
    "thirdPlaceScore" DOUBLE PRECISION,
    "coefficient" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HonorRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerHonor" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "season" TEXT,

    CONSTRAINT "PlayerHonor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountryHonor" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "season" TEXT,

    CONSTRAINT "CountryHonor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubHonor" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "season" TEXT,

    CONSTRAINT "ClubHonor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "group" TEXT,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerType" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportTask" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL DEFAULT 'lakesheet',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "totalRows" INTEGER NOT NULL DEFAULT 0,
    "successRows" INTEGER NOT NULL DEFAULT 0,
    "failedRows" INTEGER NOT NULL DEFAULT 0,
    "errorReportUrl" TEXT,
    "createdBy" TEXT,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImportTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportError" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "sheetName" TEXT,
    "rowNumber" INTEGER,
    "fieldName" TEXT,
    "code" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "rawValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportError_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_uid_key" ON "Player"("uid");

-- CreateIndex
CREATE INDEX "Player_countryId_idx" ON "Player"("countryId");

-- CreateIndex
CREATE INDEX "Player_clubId_idx" ON "Player"("clubId");

-- CreateIndex
CREATE INDEX "Player_pa_idx" ON "Player"("pa");

-- CreateIndex
CREATE UNIQUE INDEX "Country_uid_key" ON "Country"("uid");

-- CreateIndex
CREATE INDEX "Country_federation_idx" ON "Country"("federation");

-- CreateIndex
CREATE UNIQUE INDEX "Club_uid_key" ON "Club"("uid");

-- CreateIndex
CREATE INDEX "Club_country_idx" ON "Club"("country");

-- CreateIndex
CREATE INDEX "Club_federation_idx" ON "Club"("federation");

-- CreateIndex
CREATE UNIQUE INDEX "HonorRule_code_key" ON "HonorRule"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Position_code_key" ON "Position"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerType_code_key" ON "PlayerType"("code");

-- CreateIndex
CREATE INDEX "ImportTask_status_idx" ON "ImportTask"("status");

-- CreateIndex
CREATE INDEX "ImportTask_sourceType_idx" ON "ImportTask"("sourceType");

-- CreateIndex
CREATE INDEX "ImportTask_createdAt_idx" ON "ImportTask"("createdAt");

-- CreateIndex
CREATE INDEX "ImportError_taskId_idx" ON "ImportError"("taskId");

-- CreateIndex
CREATE INDEX "ImportError_code_idx" ON "ImportError"("code");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerHonor" ADD CONSTRAINT "PlayerHonor_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryHonor" ADD CONSTRAINT "CountryHonor_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubHonor" ADD CONSTRAINT "ClubHonor_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportError" ADD CONSTRAINT "ImportError_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "ImportTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

