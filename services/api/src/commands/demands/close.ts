import { SessionRequired, Demand } from '@abot/api-contract/target/demands'

import Application from '../../app';
import {ApplicationError, Command} from '..';
import DemandsModel, {DemandNotFoundError} from "../../models/demand-model";
import {ensureUser} from "../utils/checkSession";


export default new Command<SessionRequired, undefined>(
  "demands.close",
  async (app: Application, request: SessionRequired): Promise<undefined> => {
    const demandsModel = new DemandsModel(app.dao);

    const user = await ensureUser(app, request.session);

    await demandsModel.close(user.id);
    return;
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
