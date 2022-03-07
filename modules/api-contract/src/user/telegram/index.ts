import { UserGetResponse } from "..";

export interface ApiContractUserTelegram {
    get: (request: TelegramUserGetRequest) => Promise<UserGetResponse>;
    signUp: (request: TelegramUserSignUpRequest) => Promise<UserGetResponse>;
  }
  
  export type TelegramUserGetRequest = {
    session: string;
    telegramId: string;
  };

  export type TelegramUserSignUpRequest = {
    session: string;
    telegramId: string;
    login: string;
  };
  