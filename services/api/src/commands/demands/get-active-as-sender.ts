import { SessionRequired, Demand } from '@abot/api-contract/target/demands'

import Application from '../../app';
import {ApplicationError, Command} from '..';
import DemandsModel from "../../models/demand-model";
import {ensureUser} from "../utils/checkSession";


export default new Command<SessionRequired, Demand>(
  "demands.getActiveAsSender",
  async (app: Application, request: SessionRequired): Promise<Demand> => {
    const demandsModel = new DemandsModel(app.dao);

    const user = await ensureUser(app, request.session);

    const demand = await demandsModel.getActiveAsSender(user.id);
    if (demand === null) {
      throw new ApplicationError(404, "Demand not found.");
    }
    return demand;
  },
  {
    type: "object",
    properties: {
      session: {type: "string"},
    },
    required: ["session"],
    additionalProperties: false
  }
)