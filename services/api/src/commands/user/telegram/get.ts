import { TelegramUserGetRequest, UserWithActiveDemands } from '@abot/api-contract/target/user/telegram';
import { ParticipantTypes, User } from '@abot/model';

import { ApplicationError, Command } from '../..';
import Application from '../../../app';

declare type UserDemandRole = User & {
  demand: string;
  role: ParticipantTypes;
  description: string;
};

export default new Command<TelegramUserGetRequest, UserWithActiveDemands>(
  'user.telegram.get',
  async (app: Application, { telegramId, login }: TelegramUserGetRequest): Promise<UserWithActiveDemands> => {
    const id = `telegram:${login || telegramId}`;
    const { rows } = await app.dao.execute<UserDemandRole>(
      `
        WITH
        "ExistingUser" AS (
          SELECT "id"
          FROM "Users"
          WHERE
            "payload"->>'telegramId' = $1
            AND "type" = $2
        ),
        "NewUser" AS (
          INSERT INTO "Users" ("id", "login", "type", "payload")
          VALUES ($3, $4, $2, $5)
          ON CONFLICT ("id") DO NOTHING
          RETURNING "id"
        )
        SELECT u.*, p."demand", p."type" as role, d."description"
        FROM "Users" u
          LEFT JOIN "Participants" p ON p."user" = u."id"
          LEFT JOIN "Demands" d ON 
            d."id" = p."demand"
            AND d."status" = 'active'
        WHERE 
          u."id" IN (
            SELECT "id"
            FROM "ExistingUser"
            UNION
            SELECT "id"
            FROM "NewUser")
          AND "isBanned" = FALSE
        `,
      [telegramId, 'telegram', id, id, { telegramId: telegramId }],
    );
    const { demand: _, role: __, ...user } = rows[0] as any;
    const { privateKeys: ___, ...payload } = user.payload;
    const demands = [];
    for (const row of rows) {
      if (row.demand) {
        demands.push({ id: row.demand, description: row.description, role: row.role });
      }
    }
    return {
      id: user.id,
      login: user.login,
      type: user.type,
      isAdmin: user.isAdmin,
      isBanned: false,
      payload,
      demands: demands
    };
  },
  {
    type: 'object',
    properties: {
      telegramId: { type: 'string' },
      login: { type: 'string', nullable: true }
    },
    required: ['telegramId'],
    additionalProperties: false,
  },
);
