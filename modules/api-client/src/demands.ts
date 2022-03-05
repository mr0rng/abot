import {
  DemandsCountResponse,
  DemandsCreateRequest,
  DemandsCreateResponse,
  DemandsSearchRequest,
  DemandsUpdateRequest,
} from '@abot/api-contract/target/demands';
import { Demand, WithSession } from '@abot/model';

import APIClient from '.';

export default class APIClientDemands {
  constructor(public apiClient: APIClient) {}

  count(request: DemandsSearchRequest): Promise<DemandsCountResponse> {
    return this.apiClient.execute('demands.count', request);
  }

  search(request: DemandsSearchRequest): Promise<Demand[]> {
    return this.apiClient.execute('demands.search', request);
  }

  create(request: DemandsCreateRequest): Promise<DemandsCreateResponse> {
    return this.apiClient.execute('demands.create', request);
  }

  update(request: DemandsUpdateRequest): Promise<void> {
    return this.apiClient.execute('demands.update', request);
  }

  next(request: WithSession): Promise<Demand> {
    return this.apiClient.execute('demands.next', request);
  }

  close(request: WithSession): Promise<void> {
    return this.apiClient.execute('demands.close', request);
  }

  getActiveAsSender(request: WithSession): Promise<Demand> {
    return this.apiClient.execute('demands.getActiveAsSender', request);
  }
}
