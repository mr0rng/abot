import { Demand, ParticipantTypes, User } from '@abot/model';
import { UserGetResponse } from '..';

export interface ApiContractUserTelegram {
  get: (request: TelegramUserGetRequest) => Promise<UserWithActiveDemands>;
  signUp: (request: TelegramUserSignUpRequest) => Promise<UserGetResponse>;
}

export type TelegramUserGetRequest = {
  telegramId: string;
  login: string;
};

export type TelegramUserSignUpRequest = {
  telegramId: string;
  login: string;
};

export type UserWithActiveDemands = User & {
  demands: (Demand & { role: ParticipantTypes })[]
};
