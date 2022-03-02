CREATE TABLE "Messages" (
  "date"    TIMESTAMP PRIMARY KEY,
  "request" TIMESTAMP NOT NULL REFERENCES "Requests" ("date"),
  "author"  VARCHAR   NOT NULL REFERENCES "Users" ("login"),
  "type"    VARCHAR   NOT NULL,
  "payload" JSONB     NOT NULL
);