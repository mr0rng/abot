CREATE TABLE "Declines" (
  "demand"  UUID NOT NULL REFERENCES "Demands" ("id"),
  "sender"  VARCHAR NOT NULL REFERENCES "Users" ("id"),
  PRIMARY KEY ("demand", "sender")
);
