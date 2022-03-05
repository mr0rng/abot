import { DemandsCreateResponse, DemandsUpdateRequest } from '@abot/api-contract/target/demands';

import { ApplicationError, Command } from '..';
import Application from '../../app';
import DemandsModel, { DemandNotFoundError } from '../../models/demand-model';
import { ensureAdminUser } from '../utils/checkSession';

export default new Command<DemandsUpdateRequest, DemandsCreateResponse>(
  'demands.update',
  async (app: Application, request: DemandsUpdateRequest): Promise<DemandsCreateResponse> => {
    const demandsModel = new DemandsModel(app.dao);

    const { id, session, ...options } = request;

    await ensureAdminUser(app, session);

    try {
      return demandsModel.update(id, options);
    } catch (e) {
      if (e instanceof DemandNotFoundError) {
        throw new ApplicationError(404, 'Demand not found.');
      }
      throw e;
    }
  },
  {
    type: 'object',
    properties: {
      session: { type: 'string' },
      id: { type: 'string' },
      scenario: { type: 'string' },
      isActive: { type: 'boolean' },
      payload: { type: 'object' },
    },
    required: ['id', 'session'],
    additionalProperties: false,
  },
);
