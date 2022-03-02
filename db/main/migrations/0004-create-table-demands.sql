CREATE TABLE "Demands" (
  "date"      TIMESTAMP PRIMARY KEY,
  "scenario"  VARCHAR NOT NULL REFERENCES "Scenarios" ("id"),
  "recipient" VARCHAR NOT NULL REFERENCES "Users" ("id"),
  "sender"    VARCHAR REFERENCES "Users" ("id"),
  "isActive"  BOOLEAN NOT NULL,
  "payload"   JSONB   NOT NULL
);