import { DemandsUpdateRequest } from '@abot/api-contract/target/demands';
import { Demand } from '@abot/model';

import { NotFoundError, Command } from '..';
import Application from '../../app';

export default new Command<DemandsUpdateRequest, Demand>(
  'demands.update',
  async (app: Application, request: DemandsUpdateRequest): Promise<Demand> => {
  
    const {
      id,
      sessionUser,
      isSessionUserIsAdmin,
      ...options
    } = request;
    
    const params: unknown[] = [];
  
    const set_string = Object.keys(options)
    .map((field_name) => {
      params.push(options[field_name]);
      return `"${field_name}" = $${params.length}`;
    })
    .join(', ');
  
    
    let where;
    params.push(id);
    
    if (!isSessionUserIsAdmin) {
      params.push(sessionUser);
      where = `
        "id" = $${params.length - 1}
        AND
        EXISTS(
          SELECT "demand"
          FROM "Participants"
          WHERE
            "demand" = $${params.length - 1}
            AND
            "user" = $${params.length}
        )`
    } else {
      where = `"id" = $${params.length}`;
    }
    
    const sql = `UPDATE "Demands" SET ${set_string} WHERE ${where} RETURNING *;`;
    
    const result = await app.dao.execute(sql, params);
  
    if (result.rowCount != 1) {
      throw new NotFoundError();
    }
    
    return result.rows[0] as Demand;
  },
  {
    type: 'object',
    properties: {
      sessionUser: { type: 'string' },
      isSessionUserIsAdmin: { type: 'boolean' },
      id: { type: 'string' },
      title: { type: 'string' },
      description: { type: 'string' },
      scenario: { type: 'string' },
      payload: { type: 'object' },
    },
    required: ['id', 'sessionUser', 'isSessionUserIsAdmin'],
    additionalProperties: false,
  },
);
