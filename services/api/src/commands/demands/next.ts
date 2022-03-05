import { Demand, SessionRequired } from '@abot/api-contract/target/demands';

import { ApplicationError, Command } from '..';
import Application from '../../app';
import DemandsModel from '../../models/demand-model';
import { ensureUser } from '../utils/checkSession';

export default new Command<SessionRequired, Demand>(
  'demands.next',
  async (app: Application, request: SessionRequired): Promise<Demand> => {
    const demandsModel = new DemandsModel(app.dao);

    const user = await ensureUser(app, request.session);

    const demand = await demandsModel.next(user.id);
    if (demand === null) {
      throw new ApplicationError(404, 'Demand not found.');
    }
    return demand;
  },
  {
    type: 'object',
    properties: {
      session: { type: 'string' },
    },
    required: ['session'],
    additionalProperties: false,
  },
);
