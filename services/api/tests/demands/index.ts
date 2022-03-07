import { Demand, Scenario, User } from '@abot/model';

export const Scenarios: Scenario[] = [
  {
    id: 'serv1',
    description: '',
    isDeleted: false,
    payload: {},
  },
  {
    id: 'serv2',
    description: 'ddddx2',
    isDeleted: false,
    payload: {},
  },
];

export const Demands: Demand[] = [
  {
    id: 'Location/Service',
    title: 'title',
    description: 'we provide a service in location',
    date: '2022-03-02T14:39:26.403Z',
    scenario: 'serv1',
    status: 'active',
    payload: {},
  },
  {
    id: 'Location/Another',
    title: 'qqqqq',
    description: 'anthr lct',
    date: '2022-03-03T14:39:26.403Z',
    scenario: 'serv2',
    status: 'active',
    payload: {},
  },
  {
    id: 'Локация/Service',
    title: 'wwwwww',
    description: 'srvc лок',
    date: '2022-03-04T14:39:26.403Z',
    scenario: 'serv1',
    status: 'active',
    payload: {},
  },
  {
    id: 'Локация/Another',
    title: 'eeeeee',
    description: 'anthr лок',
    date: '2022-03-05T14:39:26.403Z',
    scenario: 'serv2',
    status: 'closed',
    payload: {},
  },
];
export const DemandsUTC: Demand[] = Demands.map((demand) => {
  const date = new Date(demand.date);
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

  return {
    ...demand,
    date: date.toISOString(),
  };
});

export const Users: User[] = [
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
  {
    id: 'tst2',
    login: 'tstlgn42',
    type: 'web',
    isAdmin: false,
    isBanned: false,
    payload: {
      privateKeys: { passwordHash: 'testasgas' },
      a: 12,
    },
  },
];
