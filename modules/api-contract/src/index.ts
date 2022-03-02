import { ApiContractDemands } from './demands'
import { ApiContractScenarios } from './scenarios'
import { ApiContractUser } from './user'
import { ApiContractUsers } from './users'

export type ApiContract = {
  demands: ApiContractDemands,
  scenarios: ApiContractScenarios,
  user: ApiContractUser,
  users: ApiContractUsers,
};