CREATE TABLE "Requests" (
  "date"      TIMESTAMP PRIMARY KEY,
  "scenario"  VARCHAR NOT NULL REFERENCES "Scenarios" ("id"),
  "recipient" VARCHAR NOT NULL REFERENCES "Users" ("login"),
  "sender"    VARCHAR REFERENCES "Users" ("login"),
  "payload"   JSONB   NOT NULL
);