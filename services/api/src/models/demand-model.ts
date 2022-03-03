import {UnexpectedNumberOfRows, DAOError} from '@abot/dao';
import BaseModel from "./base-model";
import {Demand} from "@abot/model";
import { v4 } from 'uuid';

class DemandsModelError extends Error {}
class DemandsWrongScenarioError extends DemandsModelError {}


export default class DemandsModel extends BaseModel {
    async get(id: string): Promise<Demand> {
        return await this.dao.executeOne(
            'SELECT * FROM "Demands" WHERE id=$1;',
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

};


export {DemandsModelError, DemandsWrongScenarioError};
