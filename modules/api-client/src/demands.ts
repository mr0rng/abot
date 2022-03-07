import {
  ApiContractDemands,
  DemandsAddParticipantRequest,
  DemandsCloseRequest,
  DemandsCountResponse,
  DemandsCreateRequest,
  DemandsCreateResponse,
  DemandsRemoveParticipantRequest,
  DemandsSearchRequest,
  DemandsUpdateRequest,
} from '@abot/api-contract/target/demands';
import { Demand, SearchRequest, WithSession } from '@abot/model';

import APIClient from '.';

export default class APIClientDemands implements ApiContractDemands {
  constructor(public apiClient: APIClient) {}

  count(request: DemandsSearchRequest): Promise<DemandsCountResponse> {
    return this.apiClient.execute('demands.count', request);
  }

  search(request: DemandsSearchRequest & SearchRequest): Promise<Demand[]> {
    return this.apiClient.execute('demands.search', request);
  }

  create(request: DemandsCreateRequest): Promise<DemandsCreateResponse> {
    return this.apiClient.execute('demands.create', request);
  }

  update(request: DemandsUpdateRequest): Promise<void> {
    return this.apiClient.execute('demands.update', request);
  }

  close(request: DemandsCloseRequest & WithSession): Promise<void> {
    return this.apiClient.execute('demands.close', request);
  }

  next(request: WithSession): Promise<Demand> {
    return this.apiClient.execute('demands.next', request);
  }

  participants = {
    add: (request: DemandsAddParticipantRequest & WithSession): Promise<void> => {
      return this.apiClient.execute('demands.add', request);
    },

    remove: (request: DemandsRemoveParticipantRequest & WithSession): Promise<void> => {
      return this.apiClient.execute('demands.add', request);
    },
  };
}
