import {Demand, Scenario, User, Participant } from '@abot/model';

export const Scenarios: Scenario[] = [
  {
    id: 'serv1',
    description: '',
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
    id: 'Локация/Service',
    title: 'wwwwww',
    description: 'srvc лок',
    date: '2022-03-04T14:39:26.403Z',
    scenario: 'serv1',
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
    isAdmin: false,
    isBanned: false,
    payload: {
      privateKeys: { passwordHash: 'testasgas' },
      a: 12,
    },
  },
];

export const Participants: Participant[] = [
  {
    demand: 'Location/Service',
    user: 'tst',
    type: 'recipient',
    payload: {},
  },
  {
    demand: 'Location/Service',
    user: 'tstusr',
    type: 'donor',
    payload: {},
  },
]
