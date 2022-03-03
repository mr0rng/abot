CREATE TABLE "Demands" (
  "id"        UUID PRIMARY KEY,
  "date"      TIMESTAMP,
  "scenario"  VARCHAR NOT NULL REFERENCES "Scenarios" ("id"),
  "recipient" VARCHAR NOT NULL REFERENCES "Users" ("id"),
  "sender"    VARCHAR REFERENCES "Users" ("id"),
  "isActive"  BOOLEAN NOT NULL,
  "payload"   JSONB   NOT NULL
);