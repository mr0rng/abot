import { ScenariosCountResponse, ScenariosDeleteRequest, ScenariosSearchRequest } from "@abot/api-contract/target/scenarios";
import { Scenario } from '@abot/model';

import APIClient from '.'

export default class APIClientScenarios {
  constructor (
    public apiClient: APIClient
  ) { }

  count (request: ScenariosSearchRequest): Promise<ScenariosCountResponse> {
    throw new Error("Method not implemented")
  }

  search (request: ScenariosSearchRequest): Promise<Scenario[]> {
    throw new Error("Method not implemented")
  }

  create (request: Scenario): Promise<undefined> {
    throw new Error("Method not implemented")
  }
  
  update (request: Scenario): Promise<undefined> {
    throw new Error("Method not implemented")
  }
  
  delete (request:  ScenariosDeleteRequest): Promise<undefined> {
    throw new Error("Method not implemented")
  }
}