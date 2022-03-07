import { Scenarios, Users, Demands, UsersScenarios } from '.';
import { TestsEnv } from '..';

const env = new TestsEnv();

beforeEach(async () => {
  await env.start();
  await env.dao.prepareDB({
    Users,
    Scenarios,
    Demands,
    UsersScenarios,
  });
});
afterEach(async () => env.stop());

const session = { sessionUser: 'tstusr', isSessionUserIsAdmin: true };

test('get next', async () => {
  const result = await env.client.demands.next(session);
  expect(result.id).toBe('Location/Service');
  expect(
    await env.dao.executeOne(
      `SELECT "type" FROM "Participants" WHERE "user" = $1 AND "demand" = $2;`, [session.sessionUser, result.id]
    )
  ).toStrictEqual({type: 'donor'});
  const result2 = await env.client.demands.next(session);
  expect(result2.id).toBe('Локация/Service');
  expect(
    await env.dao.executeOne(
      `SELECT "type" FROM "Participants" WHERE "user" = $1 AND "demand" = $2;`, [session.sessionUser, result.id]
    )
  ).toStrictEqual({type: 'declined_donor'});
  expect(
    await env.dao.executeOne(
      `SELECT "type" FROM "Participants" WHERE "user" = $1 AND "demand" = $2;`, [session.sessionUser, result2.id]
    )
  ).toStrictEqual({type: 'donor'});
  
  await expect(env.client.demands.next(session)).rejects.toThrow('Not found');
  expect(
    await env.dao.executeOne(
      `SELECT "type" FROM "Participants" WHERE "user" = $1 AND "demand" = $2;`, [session.sessionUser, result2.id]
    )
  ).toStrictEqual({type: 'declined_donor'});
});

test('get next skip closed', async () => {
  await env.dao.execute(`UPDATE "Demands" SET "status" = 'closed' WHERE "id" = $1;`, [Demands[0].id]);
  const result = await env.client.demands.next(session);
  expect(result.id).toBe(Demands[2].id);
});

test('get next skip deleted scenarios', async () => {
  await env.dao.execute(`UPDATE "Scenarios" SET "isDeleted" = TRUE WHERE "id" = $1;`, [Scenarios[0].id]);
  await env.dao.execute(`INSERT INTO "UsersScenarios" ("user", "scenario") VALUES ($1, $2);`, [session.sessionUser, Scenarios[1].id]);
  const result = await env.client.demands.next(session);
  expect(result.id).toBe(Demands[1].id);
})