import {
  ApiContractScenarios,
  ScenariosCountResponse,
  ScenariosDeleteRequest,
  ScenariosSearchRequest,
} from '@abot/api-contract/target/scenarios';
import { Scenario, SearchRequest, WithSessionUser } from '@abot/model';

import APIClient from '.';

export default class APIClientScenarios implements ApiContractScenarios {
  constructor(public apiClient: APIClient) {}

  count(request: ScenariosSearchRequest): Promise<ScenariosCountResponse> {
    return this.apiClient.execute('scenarios.count', request);
  }

  search(request: ScenariosSearchRequest & SearchRequest): Promise<Scenario[]> {
    return this.apiClient.execute('scenarios.search', request);
  }

  create(request: Omit<Scenario, 'isDeleted'> & WithSessionUser): Promise<void> {
    return this.apiClient.execute('scenarios.create', request);
  }

  update(request: Omit<Scenario, 'isDeleted'> & WithSessionUser): Promise<void> {
    return this.apiClient.execute('scenarios.update', request);
  }

  delete(request: ScenariosDeleteRequest): Promise<void> {
    return this.apiClient.execute('scenarios.delete', request);
  }
}
