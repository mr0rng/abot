CREATE TABLE "Messages" (
  "date"    TIMESTAMP PRIMARY KEY,
  "demand"  VARCHAR   NOT NULL REFERENCES "Demands" ("id"),
  "author"  VARCHAR   REFERENCES "Users" ("id"),
  "type"    VARCHAR   NOT NULL,
  "payload" JSONB     NOT NULL
);

CREATE INDEX "idx_Messages_date" ON "Messages" ("demand", "date");