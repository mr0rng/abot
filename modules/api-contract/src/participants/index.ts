import { UserGetResponse } from '../../target/user';

export interface ApiContractParticipants {
  get: (message: ParticipantGetRequest) => Promise<UserGetResponse>;
}

export type ParticipantGetRequest = {
  demand: string;
  user?: string;
  type?: string;
};
