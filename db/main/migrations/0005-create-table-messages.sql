CREATE TABLE "Messages" (
  "date"    TIMESTAMP PRIMARY KEY,
  "demand"  TIMESTAMP NOT NULL REFERENCES "Demands" ("date"),
  "author"  VARCHAR   NOT NULL REFERENCES "Users" ("login"),
  "type"    VARCHAR   NOT NULL,
  "payload" JSONB     NOT NULL
);