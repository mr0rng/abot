import { 
  DemandsCountResponse,
  DemandsCreateRequest,
  DemandsCreateResponse,
  DemandsUpdateRequest,
  DemandsSearchRequest,
  SessionRequired,
} from "@abot/api-contract/target/demands";
import { Demand } from '@abot/model';
import { Response } from "@abot/api-contract/src/response";

import APIClient from '.'

export default class APIClientDemands {
  constructor (
    public apiClient: APIClient
  ) { }

  count (request: DemandsSearchRequest): Promise<Response<DemandsCountResponse>> {
    return this.apiClient.execute('demands.count', request);
  }

  search (request: DemandsSearchRequest): Promise<Response<Demand[]>> {
    return this.apiClient.execute('demands.search', request);
  }

  create (request: DemandsCreateRequest): Promise<Response<DemandsCreateResponse>> {
    return this.apiClient.execute('demands.create', request);
  }

  update (request: DemandsUpdateRequest): Promise<Response<undefined>> {
    return this.apiClient.execute('demands.update', request);
  }

  next (request: SessionRequired): Promise<Response<Demand>> {
    return this.apiClient.execute('demands.next', request);
  }

  close (request: SessionRequired): Promise<Response<undefined>> {
    return this.apiClient.execute('demands.close', request);
  }

  getActiveAsSender (request: SessionRequired): Promise<Response<Demand>> {
    return this.apiClient.execute('demands.getActiveAsSender', request);
  }
}
