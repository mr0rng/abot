import { Demand, Participants } from '@abot/model';

import { Scenarios, Users } from '.';
import { TestsEnv } from '..';

const env = new TestsEnv();

beforeEach(async () => {
  await env.start();
  await env.dao.prepareDB({
    Users,
    Scenarios,
  });
});
afterEach(async () => env.stop());

const request = {
  sessionUser: 'tstusr',
  isSessionUserIsAdmin: true,
  id: 'some title',
  title: 'some title',
  description: 'some description',
  scenario: 'serv1',
  payload: {},
};

test('can create', async () => {
  const result = await env.client.demands.create(request);
  const demand = (await env.dao.executeOne(`SELECT * FROM "Demands" WHERE "id"=$1;`, [result.id])) as Demand;
  const participant = (await env.dao.executeOne(`SELECT * FROM "Participants" WHERE "demand"=$1;`, [
    result.id,
  ])) as Participants;
  expect(demand.title).toBe(request.title);
  expect(demand.scenario).toBe(request.scenario);
  expect(demand.payload).toStrictEqual(request.payload);
  expect(demand.status).toBe('active');
  expect(participant.user).toBe(request.sessionUser);
  expect(participant.type).toBe('recipient');
});

test('raise 400 on wrong scenario', async () => {
  await expect(env.client.demands.create({ ...request, scenario: 'BLAH!' })).rejects.toThrow('Wrong scenario');
});
test('raise 403 on wrong user', async () => {
  await expect(env.client.demands.create({ ...request, sessionUser: 'BLAH!' })).rejects.toThrow('Forbidden');
});
