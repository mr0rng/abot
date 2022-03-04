CREATE TABLE "Users" (
  "id"       VARCHAR PRIMARY KEY,
  "login"    VARCHAR NOT NULL,
  "type"     VARCHAR NOT NULL,
  "isAdmin"  BOOLEAN NOT NULL DEFAULT FALSE,
  "isBanned" BOOLEAN NOT NULL DEFAULT FALSE,
  "passwordHash" VARCHAR NOT NULL,
  "payload"  JSONB   NOT NULL,
  UNIQUE ("login", "type")
);
