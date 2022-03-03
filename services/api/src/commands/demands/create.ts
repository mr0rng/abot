import { DemandsCreateRequest, DemandsCreateResponse } from '@abot/api-contract/target/demands'

import Application from '../../app';
import {ApplicationError, Command} from '..';
import DemandsModel, {DemandsWrongScenarioError} from "../../models/demand-model";


export default new Command<DemandsCreateRequest, DemandsCreateResponse>(
    "demands.create",
    async (app: Application, request: DemandsCreateRequest): Promise<DemandsCreateResponse> => {
        const demandsModel = new DemandsModel(app.dao);
        const user = await app.sessions.get_session(request.session);

        if (user === null) {
            throw new ApplicationError(403, "Session is wrong.")
        }

        try {
            return await demandsModel.create(request.scenario, user.id, request.payload, request.isActive);
        } catch (e) {
            if (e instanceof DemandsWrongScenarioError) {
                throw new ApplicationError(
                    400,
                    "Invalid scenario!",
                )
            }
            throw e;
        }
    },
    {
        type: "object",
        properties: {
            session: {type: "string"},
            scenario: {type: "string"},
            isActive: {type: "boolean"},
            payload: {type: "object"},
        },
        required: ["scenario", "session", "isActive", "payload"],
        additionalProperties: false
    }
)
