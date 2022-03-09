import { UserScenario } from '@abot/dao/target/tests';
import { Demand, Scenario, User } from '@abot/model';

export const Users: User[] = [
  {
    id: 'test',
    login: 'test',
    type: 'web',
    isAdmin: true,
    isBanned: false,
    payload: {
      privateKeys: { passwordHash: 'testasgas' },
      a: 12,
    },
  },
  {
    id: 'test2',
    login: 'test2',
    type: 'web',
    isAdmin: true,
    isBanned: false,
    payload: {
      privateKeys: { passwordHash: 'testasgas' },
      a: 12,
    },
  },
];

export const Scenarios: Scenario[] = [
  {
    id: 'Location/Service',
    description: '',
    isDeleted: false,
    payload: {},
  }
];

export const Demands: Demand[] = [
  {
    id: 'Location/Service/test',
    title: 'Location/Service/test',
    description: 'need beer',
    date: '2022-03-02T14:39:26.403Z',
    scenario: 'Location/Service',
    status: 'active',
    payload: {},
  },
];

export const Participants = [
  {
    demand: 'Location/Service/test',
    user: 'test',
    type: 'donor',
    payload: {}
  }
];



