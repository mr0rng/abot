import { 
  DemandsCountResponse, 
  DemandsCreateResponse, 
  DemandsSearchRequest 
} from "@abot/api-contract/target/demands";
import { Demand } from '@abot/model';

import APIClient from '.'

export default class APIClientDemands {
  constructor (
    public apiClient: APIClient
  ) { }

  count (request: DemandsSearchRequest): Promise<DemandsCountResponse> {
    throw new Error("Method not implemented")
  }

  search (request: DemandsSearchRequest): Promise<Demand[]> {
    throw new Error("Method not implemented")
  }
  create (request: Omit<Demand, "date" | "recipient">): Promise<DemandsCreateResponse> {
    throw new Error("Method not implemented")
  }

  update (request: Omit<Demand, "recipient">): Promise<undefined> {
    throw new Error("Method not implemented")
  }

  next (request: null): Promise<Demand> {
    throw new Error("Method not implemented")
  }
}