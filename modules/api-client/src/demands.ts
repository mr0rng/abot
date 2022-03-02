import { 
  DemandsCountResponse, 
  DemandsCreateResponse, 
  DemandsSearchRequest 
} from "@abot/api-contract/target/demands";
import { Demand } from '@abot/model';
import { Response } from "@abot/api-contract/src/response";

import APIClient from '.'

export default class APIClientDemands {
  constructor (
    public apiClient: APIClient
  ) { }

  count (request: DemandsSearchRequest): Promise<Response<DemandsCountResponse>> {
    throw new Error("Method not implemented")
  }

  search (request: DemandsSearchRequest): Promise<Response<Demand[]>> {
    throw new Error("Method not implemented")
  }
  create (request: Omit<Demand, "date" | "recipient">): Promise<Response<DemandsCreateResponse>> {
    throw new Error("Method not implemented")
  }

  update (request: Omit<Demand, "recipient">): Promise<Response<undefined>> {
    throw new Error("Method not implemented")
  }

  next (request: null): Promise<Response<Demand>> {
    throw new Error("Method not implemented")
  }
}