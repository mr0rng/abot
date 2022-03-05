import {
  UsersCountResponse,
  UsersRequest,
  UsersScenarioRequest,
  UsersSearchRequest,
  UsersSearchResponse,
} from '@abot/api-contract/target/users';

import APIClient from '.';

export default class APIClientUsers {
  constructor(public apiClient: APIClient) {}

  count(request: UsersSearchRequest): Promise<UsersCountResponse> {
    throw new Error(`Method not implemented: ${request}`);
  }

  search(request: UsersSearchRequest): Promise<UsersSearchResponse> {
    throw new Error(`Method not implemented: ${request}`);
  }

  ban(request: UsersRequest): Promise<undefined> {
    throw new Error(`Method not implemented: ${request}`);
  }

  setIsAdmin(request: UsersRequest): Promise<undefined> {
    throw new Error(`Method not implemented: ${request}`);
  }

  setNotAdmin(request: UsersRequest): Promise<undefined> {
    throw new Error(`Method not implemented: ${request}`);
  }

  assignScenario(request: UsersScenarioRequest): Promise<undefined> {
    throw new Error(`Method not implemented: ${request}`);
  }

  unassignScenario(request: UsersScenarioRequest): Promise<undefined> {
    throw new Error(`Method not implemented: ${request}`);
  }
}
