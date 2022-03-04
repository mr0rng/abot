import {UnexpectedNumberOfRows} from '@abot/dao';
import BaseModel from "./base-model";
import {Demand} from "@abot/model";
import { v4 } from 'uuid';

class DemandsModelError extends Error {}
class DemandsWrongScenarioError extends DemandsModelError {}
class DemandNotFoundError extends DemandsModelError {}


type UpdateOptions = {
    scenario? : string,
    sender? : string,
    isActive? : string,
    payload? : string,
}

export default class DemandsModel extends BaseModel {
    async get(id: string): Promise<Demand> {
        return await this.dao.executeOne(
            'SELECT * FROM "Demands" WHERE "id"=$1;',
            [id],
        ) as Demand;
    }

    async create(scenario: string, recipient: string, payload: object, isActive: boolean): Promise<{id: string}> {
        try {
            return await this.dao.executeOne(
                'INSERT INTO "Demands" ("id", "date", "scenario", "recipient", "payload", "isActive") VALUES ($1, CURRENT_TIMESTAMP, $2, $3, $4, $5) RETURNING "id";',
                [v4(), scenario, recipient, payload, isActive]
            )
        } catch (e) {
            if (e.constraint === 'Demands_scenario_fkey') {
                throw new DemandsWrongScenarioError();
            }
        }
    }

    async update(id: string, options: UpdateOptions): Promise<Demand> {
        const params: unknown[] = [];

        const set_string = Object.keys(options).map((field_name) => {
            params.push(options[field_name]);
            return `"${field_name}" = $${params.length}`;
        }).join(", ");

        params.push(id);

        const sql = `UPDATE "Demands" SET ${set_string} WHERE "id" = $${params.length};`;
        const result = await this.dao.execute(sql, params);

        if (result.rowCount == 0) {
            throw new DemandNotFoundError();
        }
        return;
    }

    async getActiveAsSender(sender: string): Promise<Demand> {
        try {
            return await this.dao.executeOne(
              `SELECT * FROM "Demands" WHERE "sender" = $1 AND "isActive" AND "sender" IS NOT NULL;`,
              [sender],
            );
        } catch (e) {
            const error = e as UnexpectedNumberOfRows;
            if (error.isUnexpectedNumberOfRows) {
                return null;
            }
            throw e;
        }
    }

    async next(sender: string): Promise<Demand | null> {
        const sql = `
            WITH 
            "AssignedDemands" AS (
                SELECT "id", "sender", "recipient"
                FROM "Demands"
                WHERE
                    "sender" = $1
                    AND
                    "isActive" = TRUE
                FOR UPDATE
            ),
            "Decline" AS (
                INSERT INTO "Declines"
                SELECT
                    "id" as "demand",
                    "sender" as "sender"
                FROM "AssignedDemands"
                RETURNING "demand"
            ),
            "UnassignDemands" AS (
                UPDATE "Demands" SET "sender" = NULL WHERE "id" in (SELECT "demand" FROM "Decline") RETURNING "id"
            ),
            "GetNewDemand" AS (
                SELECT "Demands"."id"
                FROM "Demands"
                INNER JOIN "Users" ON "Demands"."recipient" = "Users"."id"
                WHERE
                    "Demands"."scenario" IN (SELECT "scenario" FROM "UsersScenarios" WHERE "user" = $1)
                    AND
                    "Demands"."sender" IS NULL
                    AND
                    "Demands"."isActive"
                    AND
                    "Demands"."id" NOT IN (SELECT "id" FROM "UnassignDemands")
                    AND
                    NOT "Users"."isBanned"
                   ORDER BY "Demands"."date" ASC
                   LIMIT 1
                FOR UPDATE SKIP LOCKED
            ),
            "UpdateNewDemand" AS (
                UPDATE "Demands" SET "sender" = $1 WHERE "id" in (SELECT "id" FROM "GetNewDemand")
                RETURNING *
            )
            SELECT * FROM "UpdateNewDemand";
        `;

        try {
            return await this.dao.executeOne(sql, [sender]) as Demand;
        }  catch (e) {
            const error = e as UnexpectedNumberOfRows;
            if (error.isUnexpectedNumberOfRows) {
                return null;
            }
            throw e;
        }
    }

    async close(sender: string): Promise<void> {
        await this.dao.execute(
          `UPDATE "Demands" SET "isActive" = FALSE WHERE "sender" = $1 AND "isActive";`,
          [sender]
        );
    }
}

export {DemandsModelError, DemandNotFoundError, DemandsWrongScenarioError, UpdateOptions};
