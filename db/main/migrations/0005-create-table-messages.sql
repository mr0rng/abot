CREATE TABLE "Messages" (
  "date"    TIMESTAMP PRIMARY KEY,
  "demand"  UUID NOT NULL REFERENCES "Demands" ("id"),
  "author"  VARCHAR   REFERENCES "Users" ("id"),
  "type"    VARCHAR   NOT NULL,
  "payload" JSONB     NOT NULL
);