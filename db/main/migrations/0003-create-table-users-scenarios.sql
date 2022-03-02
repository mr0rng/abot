CREATE TABLE "UsersScenarios" (
  "user"     VARCHAR NOT NULL REFERENCES "Users" ("login"),
  "scenario" VARCHAR NOT NULL REFERENCES "Scenarios" ("id"),
  PRIMARY KEY ("user", "scenario")
);