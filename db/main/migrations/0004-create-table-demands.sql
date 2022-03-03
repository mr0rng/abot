CREATE TABLE "Demands" (
  "id"        UUID PRIMARY KEY,
  "date"      TIMESTAMP NOT NULL DEFAULT current_timestamp,
  "scenario"  VARCHAR NOT NULL REFERENCES "Scenarios" ("id"),
  "recipient" VARCHAR NOT NULL REFERENCES "Users" ("id"),
  "sender"    VARCHAR REFERENCES "Users" ("id"),
  "isActive"  BOOLEAN NOT NULL,
  "payload"   JSONB   NOT NULL
);

CREATE INDEX IF NOT EXISTS "GetNewDemand_INDEX" ON "Demands" ("scenario", "id") WHERE "isActive" AND "sender" IS NULL;
CREATE INDEX IF NOT EXISTS "GetActiveAsSender_INDEX" ON "Demands" ("sender", "id") WHERE "isActive" AND "sender" IS NOT NULL;
