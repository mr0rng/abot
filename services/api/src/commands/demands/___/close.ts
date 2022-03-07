import { WithSession } from '@abot/model';

import { Command } from '..';
import Application from '../../app';
import DemandsModel from '../../models/demand-model';

export default new Command<WithSession, void>(
  'demands.close',
  async (app: Application, request: WithSession): Promise<void> => {
    const demandsModel = new DemandsModel(app.dao);

    const user = await ensureUser(app, request.session);

    await demandsModel.close(user.id);
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
