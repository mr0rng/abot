import { 
  UsersCountResponse, 
  UsersRequest, 
  UsersScenarioRequest, 
  UsersSearchRequest, 
  UsersSearchResponse 
} from '@abot/api-contract/target/users';

import APIClient from '.'

export default class APIClientUsers {
  constructor (
    public apiClient: APIClient
  ) { }

  count (request: UsersSearchRequest): Promise<UsersCountResponse> {
    throw new Error("Method not implemented")
  }

  search (request: UsersSearchRequest): Promise<UsersSearchResponse> {
    throw new Error("Method not implemented")
  }

  ban (request:  UsersRequest): Promise<undefined> {
    throw new Error("Method not implemented")
  }

  setIsAdmin (request:  UsersRequest): Promise<undefined> {
    throw new Error("Method not implemented")
  }

  setNotAdmin (request:  UsersRequest): Promise<undefined> {
    throw new Error("Method not implemented")
  }

  assignScenario (request: UsersScenarioRequest): Promise<undefined> {
    throw new Error("Method not implemented")
  }

  unassignScenario (request: UsersScenarioRequest): Promise<undefined> {
    throw new Error("Method not implemented")
  }
}