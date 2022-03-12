import { DemandsCloseRequest } from '@abot/api-contract/target/demands';

import { Command, NotFoundError } from '..';
import Application from '../../app';

export default new Command<DemandsCloseRequest, void>(
  'demands.close',
  async (app: Application, request: DemandsCloseRequest): Promise<void> => {
    const result = await (request.isSessionUserIsAdmin
      ? closeByAdmin(app, request.id)
      : closeByUser(app, request.id, request.sessionUser));

    if (result.rowCount != 1) {
      throw new NotFoundError();
    }
    return;
  },
  {
    type: 'object',
    properties: {
      sessionUser: { type: 'string' },
      isSessionUserIsAdmin: { type: 'boolean' },
      id: { type: 'string' },
    },
    required: ['id', 'sessionUser', 'isSessionUserIsAdmin'],
    additionalProperties: false,
  },
);

const closeByAdmin = async (app: Application, id: string) => {
  const sql = `
        UPDATE "Demands" SET "status" = 'closed' WHERE "id" = $1;
      `;
  return app.dao.execute(sql, [id]);
};

const closeByUser = async (app: Application, id: string, user: string) => {
  const allowedTypes = ['recipient', 'moderator'].map((x) => `'${x}'`).join(', ');

  const sql = `
        UPDATE "Demands" SET "status" = 'closed'
        WHERE
          "id" = $1
          AND
          "id" IN (
            SELECT "demand"
            FROM "Participants"
            WHERE
              "type" IN (${allowedTypes})
              AND
              "user" = $2
          )
      ;
      `;
  return app.dao.execute(sql, [id, user]);
};
