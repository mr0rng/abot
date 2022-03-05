CREATE TABLE "Demands" (
  "id"          VARCHAR PRIMARY KEY,
  "description" VARCHAR NOT NULL,
  "date"        TIMESTAMP NOT NULL DEFAULT current_timestamp,
  "scenario"    VARCHAR NOT NULL REFERENCES "Scenarios" ("id"),
  "recipient"   VARCHAR NOT NULL REFERENCES "Users" ("id"),
  "sender"      VARCHAR REFERENCES "Users" ("id"),
  "isActive"    BOOLEAN NOT NULL,
  "payload"     JSONB   NOT NULL
);

CREATE INDEX "idx_Demands_description" ON "Demands" USING GIN ("description" gin_trgm_ops);
CREATE INDEX "idx_Demands_scenario" ON "Demands" ("scenario") WHERE "isActive" AND "sender" IS NULL;
CREATE INDEX "idx_Demands_recipient" ON "Demands" ("recipient");
CREATE INDEX "idx_Demands_sender" ON "Demands" ("sender" NULLS FIRST);
CREATE INDEX "idx_Demands_isActive" ON "Demands" ("isActive");