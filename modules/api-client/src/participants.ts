import { ApiContractParticipants, ParticipantGetRequest } from '@abot/api-contract/target/participants';
import { UserGetResponse } from '@abot/api-contract/target/user';

import APIClient from '.';

export default class APIClientParticipants implements ApiContractParticipants {
  constructor(public apiClient: APIClient) {}

  get(message: ParticipantGetRequest): Promise<UserGetResponse> {
    return this.apiClient.execute('participants.get', message);
  }
}
