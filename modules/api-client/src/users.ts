import { 
  UsersCountResponse, 
  UsersRequest, 
  UsersScenarioRequest, 
  UsersSearchRequest, 
  UsersSearchResponse 
} from '@abot/api-contract/target/users';
import { Response } from "@abot/api-contract/src/response";

import APIClient from '.'

export default class APIClientUsers {
  constructor (
    public apiClient: APIClient
  ) { }

  count (request: UsersSearchRequest): Promise<Response<UsersCountResponse>> {
    throw new Error("Method not implemented")
  }

  search (request: UsersSearchRequest): Promise<Response<UsersSearchResponse>> {
    throw new Error("Method not implemented")
  }

  ban (request:  UsersRequest): Promise<Response<undefined>> {
    throw new Error("Method not implemented")
  }

  setIsAdmin (request:  UsersRequest): Promise<Response<undefined>> {
    throw new Error("Method not implemented")
  }

  setNotAdmin (request:  UsersRequest): Promise<Response<undefined>> {
    throw new Error("Method not implemented")
  }

  assignScenario (request: UsersScenarioRequest): Promise<Response<undefined>> {
    throw new Error("Method not implemented")
  }

  unassignScenario (request: UsersScenarioRequest): Promise<Response<undefined>> {
    throw new Error("Method not implemented")
  }
}