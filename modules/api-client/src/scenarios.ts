import { ScenariosCountResponse, ScenariosDeleteRequest, ScenariosSearchRequest } from "@abot/api-contract/target/scenarios";
import { Scenario } from '@abot/model';
import { Response } from "@abot/api-contract/src/response";

import APIClient from '.'

export default class APIClientScenarios {
  constructor (
    public apiClient: APIClient
  ) { }

  count (request: ScenariosSearchRequest): Promise<Response<ScenariosCountResponse>> {
    throw new Error("Method not implemented")
  }

  search (request: ScenariosSearchRequest): Promise<Response<Scenario[]>> {
    throw new Error("Method not implemented")
  }

  create (request: Scenario): Promise<Response<undefined>> {
    throw new Error("Method not implemented")
  }
  
  update (request: Scenario): Promise<Response<undefined>> {
    throw new Error("Method not implemented")
  }
  
  delete (request:  ScenariosDeleteRequest): Promise<Response<undefined>> {
    throw new Error("Method not implemented")
  }
}