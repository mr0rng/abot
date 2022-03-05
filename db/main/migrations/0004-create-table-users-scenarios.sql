CREATE TABLE "UsersScenarios" (
  "user"     VARCHAR NOT NULL REFERENCES "Users" ("id"),
  "scenario" VARCHAR NOT NULL REFERENCES "Scenarios" ("id"),
  PRIMARY KEY ("user", "scenario")
);