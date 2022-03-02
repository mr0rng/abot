CREATE TABLE "Users" (
  "login"   VARCHAR PRIMARY KEY,
  "type"    VARCHAR NOT NULL,
  "isAdmin" BOOLEAN NOT NULL,
  "payload" JSONB   NOT NULL
);