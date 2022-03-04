CREATE TABLE "Scenarios" (
  "id"          VARCHAR PRIMARY KEY,
  "description" VARCHAR NOT NULL,
  "isDeleted"   BOOLEAN NOT NULL,
  "payload"     JSONB   NOT NULL
);

CREATE INDEX "idx_Scenarios_FTS" ON "Scenarios" USING GIN (("id" || ' ' || "description") gin_trgm_ops);