import { Message } from '@abot/model';

import { Scenarios, Users, Demands, Participants } from '.';
import { TestsEnv } from '..';

const env = new TestsEnv();

beforeEach(async () => {
  await env.start();
  await env.dao.prepareDB({
    Users,
    Scenarios,
    Demands,
    Participants
  });
});
afterEach(async () => env.stop());

const request: Omit<Message, 'date'> = {
  demand: Demands[0].id,
  author: Users[0].id,
  type: 'telegram',
  payload: { text: 'hey there' }
};

test('can create', async () => {
  const { id } = await env.client.messages.send(request);
  const message = (await env.dao.executeOne(`SELECT * FROM "Messages" WHERE "id"=$1;`, [id])) as Message;
  
  expect(message.demand).toBe(request.demand);
  expect(message.author).toBe(request.author);
  expect(message.type).toBe(request.type);
  expect(message.payload).toStrictEqual(request.payload);
});

test('raise 403 on wrong demand', async () => {
  await expect(env.client.messages.send({ ...request, demand: 'BLAH!' })).rejects.toThrow('Forbidden');
});

test('raise 403 on wrong user', async () => {
  await expect(env.client.messages.send({ ...request, author: 'BLAH!' })).rejects.toThrow('Forbidden');
});

test('raise 403 on no participand', async () => {
  await env.dao.execute('DELETE from "Participants"');
  await expect(env.client.messages.send(request)).rejects.toThrow('Forbidden');
});
