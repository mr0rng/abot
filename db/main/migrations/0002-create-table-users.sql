CREATE TABLE "Users" (
  "id"       VARCHAR PRIMARY KEY,
  "login"    VARCHAR NOT NULL,
  "type"     VARCHAR NOT NULL,
  "isAdmin"  BOOLEAN NOT NULL DEFAULT FALSE,
  "isBanned" BOOLEAN NOT NULL DEFAULT FALSE,
  "payload"  JSONB   NOT NULL,
  UNIQUE ("login", "type")
);

CREATE INDEX "idx_Users_FTS" ON "Users" USING GIN ("login" gin_trgm_ops);