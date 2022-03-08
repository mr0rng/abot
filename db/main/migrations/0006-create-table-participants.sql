CREATE TABLE "Participants" (
  "demand"  VARCHAR   NOT NULL REFERENCES "Demands" ("id"),
  "user"    VARCHAR   NOT NULL REFERENCES "Users" ("id"),
  "type"    VARCHAR   NOT NULL,
  "payload" JSONB     NOT NULL,
  PRIMARY KEY ("demand", "user")
);

CREATE INDEX "idx_Participants_demand" ON "Participants" ("demand");
CREATE INDEX "idx_Participants_user" ON "Participants" ("user");
CREATE UNIQUE INDEX "ids_Participants_only_onw_donor" ON "Participants" ("demand", "user") WHERE "type" = 'donor';
