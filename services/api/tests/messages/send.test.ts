import { Demands, Participants, Scenarios, Users } from '.';
import { TestsEnv } from '..';

const env = new TestsEnv();

beforeEach(async () => {
  await env.start();
  await env.dao.prepareDB({
    Users,
    Scenarios,
    Demands,
    Participants,
  });
});
afterEach(async () => env.stop());

const adminSession = { sessionUser: 'tstusr', isSessionUserIsAdmin: true };
const commonSession = { sessionUser: 'tstusr', isSessionUserIsAdmin: false };

test('user can send', async () => {
  const response = await env.client.messages.send({
    ...commonSession,
    demand: Demands[0].id,
    type: 'message',
    payload: { 'may message': 'here!' },
  });
  await expect(env.dao.executeOne(`SELECT * FROM "Messages" WHERE "id" = $1;`, [response.id])).resolves.toStrictEqual({
    id: response.id,
    author: commonSession.sessionUser,
    date: new Date(response.date),
    demand: Demands[0].id,
    type: 'message',
    payload: { 'may message': 'here!' },
  });
});

test('admin can send anywhere', async () => {
  const response = await env.client.messages.send({
    ...adminSession,
    demand: Demands[1].id,
    type: 'message',
    payload: { 'may message': 'here!' },
  });
  await expect(env.dao.executeOne(`SELECT * FROM "Messages" WHERE "id" = $1;`, [response.id])).resolves.toStrictEqual({
    id: response.id,
    author: adminSession.sessionUser,
    date: new Date(response.date),
    demand: Demands[1].id,
    type: 'message',
    payload: { 'may message': 'here!' },
  });
});

test('user can`t send if not participant', async () => {
  await expect(
    env.client.messages.send({
      ...commonSession,
      demand: Demands[1].id,
      type: 'message',
      payload: { 'may message': 'here!' },
    }),
  ).rejects.toThrow('Forbidden');
});

test('admin can`t send if demand does not exists', async () => {
  await expect(
    env.client.messages.send({
      ...adminSession,
      demand: 'some strange id',
      type: 'message',
      payload: { 'may message': 'here!' },
    }),
  ).rejects.toThrow('Wrong demand');
});
