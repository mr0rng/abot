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
    throw new Error(`Method not implemented: ${request}`)
  }

  search (request: UsersSearchRequest): Promise<Response<UsersSearchResponse>> {
    throw new Error(`Method not implemented: ${request}`)
  }

  ban (request:  UsersRequest): Promise<Response<undefined>> {
    throw new Error(`Method not implemented: ${request}`)
  }

  setIsAdmin (request:  UsersRequest): Promise<Response<undefined>> {
    throw new Error(`Method not implemented: ${request}`)
  }

  setNotAdmin (request:  UsersRequest): Promise<Response<undefined>> {
    throw new Error(`Method not implemented: ${request}`)
  }

  assignScenario (request: UsersScenarioRequest): Promise<Response<undefined>> {
    throw new Error(`Method not implemented: ${request}`)
  }

  unassignScenario (request: UsersScenarioRequest): Promise<Response<undefined>> {
    throw new Error(`Method not implemented: ${request}`)
  }
}