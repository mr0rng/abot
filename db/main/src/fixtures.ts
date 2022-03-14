import config from '@abot/config';
import TestsDAO from '@abot/dao/target/tests';
import { Demand, Scenario, User } from '@abot/model';

const Users: User[] = [
  {
    id: 'tstusr',
    login: 'tstusr',
    type: 'web',
    isAdmin: true,
    isBanned: false,
    payload: {
      privateKeys: { passwordHash: 'testasgas' },
      a: 12,
    },
  },
  {
    id: 'tst',
    login: 'tstlgn22',
    type: 'web',
    isAdmin: true,
    isBanned: false,
    payload: {
      privateKeys: { passwordHash: 'testasgas' },
      a: 12,
    },
  },
];

const Scenarios: Scenario[] = [
  {
    id: 'Location/Service',
    description: '',
    isDeleted: false,
    payload: {},
  },
  {
    id: 'Локация/Сервис',
    description: 'ddddx2',
    isDeleted: false,
    payload: {},
  },
];

const Demands: Demand[] = [
  {
    id: 'Location/Service',
    title: 'title',
    description: 'we provide a service in location',
    date: '2022-03-02T14:39:26.403Z',
    scenario: 'Location/Service',
    status: 'active',
    payload: {},
  },
  {
    id: 'Location/Another',
    title: 'qqqqq',
    description: 'anthr lct',
    date: '2022-03-03T14:39:26.403Z',
    scenario: 'Локация/Сервис',
    status: 'active',
    payload: {},
  },
  {
    id: 'Локация/Service',
    title: 'wwwwww',
    description: 'srvc лок',
    date: '2022-03-04T14:39:26.403Z',
    scenario: 'Location/Service',
    status: 'active',
    payload: {},
  },
  {
    id: 'Локация/Another',
    title: 'eeeeee',
    description: 'anthr лок',
    date: '2022-03-05T14:39:26.403Z',
    scenario: 'Локация/Сервис',
    status: 'closed',
    payload: {},
  },
];

(async () => {
  const dao = new TestsDAO(config);
  await dao.clear();
  await dao.prepareDB({
    Users,
    Scenarios,
    Demands,
    Participants: [
      { demand: 'Location/Service', user: 'tstusr', type: 'recipeint', payload: {} },
      { demand: 'Location/Service', user: 'tst', type: 'recipeint', payload: {} },
      { demand: 'Location/Another', user: 'tst', type: 'recipeint', payload: {} },
    ],
  });
})();
