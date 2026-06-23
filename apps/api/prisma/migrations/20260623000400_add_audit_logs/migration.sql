CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'RECALCULATE', 'IMPORT', 'UPSERT', 'OTHER');

CREATE TABLE "AuditLog" (
  "id" TEXT NOT NULL,
  "action" "AuditAction" NOT NULL DEFAULT 'OTHER',
  "module" TEXT NOT NULL,
  "method" TEXT NOT NULL,
  "path" TEXT NOT NULL,
  "success" BOOLEAN NOT NULL,
  "statusCode" INTEGER,
  "objectType" TEXT,
  "objectId" TEXT,
  "summary" TEXT,
  "actor" TEXT NOT NULL DEFAULT 'LOCAL_USER',
  "ip" TEXT,
  "userAgent" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");
CREATE INDEX "AuditLog_module_idx" ON "AuditLog"("module");
CREATE INDEX "AuditLog_success_idx" ON "AuditLog"("success");
CREATE INDEX "AuditLog_objectType_idx" ON "AuditLog"("objectType");
CREATE INDEX "AuditLog_objectId_idx" ON "AuditLog"("objectId");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
