import { User, Scenario, Demand, Message } from '@abot/model'
import DAO from '.';

export default class TestsDAO extends DAO {
  async clear () {
    await this.execute(`
      WITH
        messages AS (DELETE FROM "Messages" RETURNING date),
        demands AS (DELETE FROM "Demands" RETURNING date),
        "usersScenarios" AS (DELETE FROM "UsersScenarios" RETURNING user),
        scenarios AS (DELETE FROM "Scenarios" RETURNING id),
        users AS (DELETE FROM "Users" RETURNING login)
      SELECT 1
    `);
  }

  async prepareDB (data: DBData) {
    for (const key in data) {
      const tableName = key as keyof DBData;
      await this.execute(
        `INSERT INTO "${tableName}" SELECT * FROM json_populate_recordset(null::"${tableName}", $1::JSON)`,
        [ JSON.stringify(data[tableName]) ]
      );
    }
  }

  async tableData<T extends keyof DBData>(tableName: T, order: string): Promise<DBData[T]> {
    const { rows } = await this.execute(`SELECT * FROM "${tableName}" ORDER BY ${order}`);

    return rows as unknown as DBData[T];
  }
}

export type UserScenario = {
  user: string,
  scenario: string,
};

export type DBData = {
  Users?: User[],
  Scenarios?: Scenario[],
  UsersScenarios?: UserScenario[],
  Demands?: Demand[],
  Messages?: Message[],
};

export type DBDataMapCallback<T> = (item: T) => T;

export type DBDataMap = {
  users?: DBDataMapCallback<User>,
  scenarios?: DBDataMapCallback<Scenario>,
  userScenario?: DBDataMapCallback<UserScenario>,
  demands?: DBDataMapCallback<Demand>,
  messages?: DBDataMapCallback<Message>,
};