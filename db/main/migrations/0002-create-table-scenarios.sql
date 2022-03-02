CREATE TABLE "Scenarios" (
  "id"          VARCHAR PRIMARY KEY,
  "description" VARCHAR NOT NULL,
  "payload"     JSONB   NOT NULL,
  "isDeleted"   BOOLEAN NOT NULL
);