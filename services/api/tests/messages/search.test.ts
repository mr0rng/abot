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
    Messages: [
      {
        id: '1',
        date: '2022-03-04T14:39:26.403Z',
        demand: Demands[0].id,
        author: Participants[0].user,
        type: 'message',
        payload: { message: 'blah' },
      },
      {
        id: '2',
        date: '2022-03-04T14:40:26.403Z',
        demand: Demands[0].id,
        author: Participants[1].user,
        type: 'message',
        payload: { message: 'blah!' },
      },
      {
        id: '3',
        date: '2022-03-04T14:41:26.403Z',
        demand: Demands[0].id,
        author: Participants[0].user,
        type: 'message',
        payload: { message: 'blah!!' },
      },
      {
        id: '4',
        date: '2022-03-04T14:21:26.403Z',
        demand: Demands[1].id,
        author: Users[1].id,
        type: 'message',
        payload: { message: 'blah!!' },
      },
      {
        id: '5',
        date: '2022-03-04T14:51:26.403Z',
        demand: Demands[1].id,
        author: Users[0].id,
        type: 'message',
        payload: { message: 'blah!!' },
      },
    ],
  });
});

afterEach(async () => env.stop());

const adminSession = { sessionUser: 'tstusr', isSessionUserIsAdmin: true };
const commonSession = { sessionUser: 'tstusr', isSessionUserIsAdmin: false };

test('admin user can search in his demands', async () => {
  const response = await env.client.messages.search({ ...adminSession, demand: Demands[0].id, order: 1, limit: 2 });
  expect(response[0].id).toBe('1');
  expect(response[1].id).toBe('2');
  expect(response).toHaveLength(2);
});

test('admin can search in his demands reversed', async () => {
  const response = await env.client.messages.search({ ...adminSession, demand: Demands[0].id, order: -1, limit: 2 });
  expect(response[0].id).toBe('3');
  expect(response[1].id).toBe('2');
  expect(response).toHaveLength(2);
});

test('admin can search in his demands after id', async () => {
  const response = await env.client.messages.search({
    ...adminSession,
    demand: Demands[0].id,
    lastSeenId: '1',
    order: 1,
    limit: 5,
  });
  expect(response[0].id).toBe('2');
  expect(response[1].id).toBe('3');
  expect(response).toHaveLength(2);
});

test('admin can search in other demands', async () => {
  const response = await env.client.messages.search({ ...adminSession, demand: Demands[1].id, order: 1, limit: 5 });
  expect(response[0].id).toBe('4');
  expect(response[1].id).toBe('5');
  expect(response).toHaveLength(2);
});

test('common user can search in his demands', async () => {
  const response = await env.client.messages.search({ ...commonSession, demand: Demands[0].id, order: 1, limit: 2 });
  expect(response[0].id).toBe('1');
  expect(response[1].id).toBe('2');
  expect(response).toHaveLength(2);
});

test('common user can`t search in alien demands', async () => {
  const response = await env.client.messages.search({ ...commonSession, demand: Demands[1].id, order: 1, limit: 2 });
  expect(response).toHaveLength(0);
});

test('common user can`t search for declined demands', async () => {
  await env.dao.execute(`INSERT INTO "Participants" ("demand", "user", "type", "payload") VALUES ($1, $2 ,$3, $4)`, [
    Demands[1].id,
    commonSession.sessionUser,
    'declined_donor',
    {},
  ]);
  const response = await env.client.messages.search({ ...commonSession, demand: Demands[1].id, order: 1, limit: 2 });
  expect(response).toHaveLength(0);
});
