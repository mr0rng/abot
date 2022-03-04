import { 
  ScenariosCountResponse, 
  ScenariosDeleteRequest, 
  ScenariosSearchRequest 
} from "@abot/api-contract/target/scenarios";
import { Scenario, SearchRequest } from '@abot/model';
import { Response } from "@abot/api-contract/src/response";

import APIClient from '.'

export default class APIClientScenarios {
  constructor (
    public apiClient: APIClient
  ) { }

  count (request: ScenariosSearchRequest): Promise<Response<ScenariosCountResponse>> {
    return this.apiClient.execute('scenarios.count', request);
  }

  search (request: ScenariosSearchRequest & SearchRequest): Promise<Response<Scenario[]>> {
    return this.apiClient.execute('scenarios.search', request);
  }

  create (request: Scenario): Promise<Response<undefined>> {
    return this.apiClient.execute('scenarios.create', request);
  }
  
  update (request: Scenario): Promise<Response<undefined>> {
    return this.apiClient.execute('scenarios.update', request);
  }
  
  delete (request:  ScenariosDeleteRequest): Promise<Response<undefined>> {
    return this.apiClient.execute('scenarios.delete', request);
  }
}