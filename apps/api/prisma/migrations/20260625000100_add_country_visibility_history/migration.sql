ALTER TABLE "Country"
ADD COLUMN "uidSort" INTEGER,
ADD COLUMN "visibleInCatalog" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "isHistorical" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "detailRedirectCountryId" TEXT;

UPDATE "Country"
SET "uidSort" = CASE
  WHEN "uid" ~ '^[0-9]+$' THEN "uid"::INTEGER
  ELSE NULL
END;

CREATE TABLE "CountrySuccessor" (
  "historicalCountryId" TEXT NOT NULL,
  "successorCountryId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CountrySuccessor_pkey" PRIMARY KEY ("historicalCountryId", "successorCountryId")
);

CREATE INDEX "Country_uidSort_idx" ON "Country"("uidSort");
CREATE INDEX "Country_visibleInCatalog_idx" ON "Country"("visibleInCatalog");
CREATE INDEX "Country_isHistorical_idx" ON "Country"("isHistorical");
CREATE INDEX "Country_detailRedirectCountryId_idx" ON "Country"("detailRedirectCountryId");
CREATE INDEX "CountrySuccessor_successorCountryId_idx" ON "CountrySuccessor"("successorCountryId");

ALTER TABLE "Country"
ADD CONSTRAINT "Country_detailRedirectCountryId_fkey"
FOREIGN KEY ("detailRedirectCountryId") REFERENCES "Country"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CountrySuccessor"
ADD CONSTRAINT "CountrySuccessor_historicalCountryId_fkey"
FOREIGN KEY ("historicalCountryId") REFERENCES "Country"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CountrySuccessor"
ADD CONSTRAINT "CountrySuccessor_successorCountryId_fkey"
FOREIGN KEY ("successorCountryId") REFERENCES "Country"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
