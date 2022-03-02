CREATE TABLE "Scenarios" (
  "id"          VARCHAR PRIMARY KEY,
  "description" VARCHAR NOT NULL,
  "isDeleted"   BOOLEAN NOT NULL,
  "payload"     JSONB   NOT NULL
);