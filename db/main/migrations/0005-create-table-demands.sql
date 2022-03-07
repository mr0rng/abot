CREATE TABLE "Demands" (
  "id"          VARCHAR PRIMARY KEY,
  "title"       VARCHAR NOT NULL,
  "description" VARCHAR NOT NULL,
  "date"        TIMESTAMP NOT NULL DEFAULT current_timestamp,
  "scenario"    VARCHAR NOT NULL REFERENCES "Scenarios" ("id"),
  "status"      VARCHAR NOT NULL,
  "payload"     JSONB   NOT NULL
);

CREATE INDEX "idx_Demands_FTS" ON "Demands" USING GIN (("title" || ' ' || "description") gin_trgm_ops);
CREATE INDEX "idx_Demands_scenario" ON "Demands" ("scenario") WHERE "status" != 'closed';
CREATE INDEX "idx_Demands_status" ON "Demands" ("status");
