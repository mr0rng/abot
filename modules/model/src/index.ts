export type UserBase = {
  id: string;
  login: string;
  type: string;
  isAdmin: boolean;
  isBanned: boolean;
  payload: object;
};

export type UserWeb = UserBase & {
  type: 'web';
  payload: {
    privateKeys: {
      passwordHash: string;
    };
  } & Record<string, unknown>;
};

export type UserTelegram = UserBase & {
  type: 'telegram';
  payload: {
    telegramId: string;
  } & Record<string, unknown>;
};

export type User = UserWeb | UserTelegram;

export type Scenario = {
  id: string;
  description: string;
  isDeleted: boolean;
  payload: object;
};

export type Demand = {
  id: string;
  description: string;
  date: string;
  scenario: string;
  recipient: string;
  sender: string;
  isActive: boolean;
  payload: object;
};

export type Message = {
  date: number;
  demand: number;
  author: string;
  type: string;
  payload: string;
};

export type Decline = {
  sender: string;
  demand: string;
};

export type SearchRequest = {
  limit: number;
  offset: number;
};

export type WithSession = {
  session: string;
};
