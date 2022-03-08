import { UserGetResponse } from '..';

export interface ApiContractUserTelegram {
  get: (request: TelegramUserGetRequest) => Promise<UserGetResponse>;
  signUp: (request: TelegramUserSignUpRequest) => Promise<UserGetResponse>;
}

export type TelegramUserGetRequest = {
  telegramId: string;
};

export type TelegramUserSignUpRequest = {
  telegramId: string;
  login: string;
};
