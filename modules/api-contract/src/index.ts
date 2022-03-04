import { ApiContractDemands } from './demands'
import { ApiContractMessages } from './messages'
import { ApiContractScenarios } from './scenarios'
import { ApiContractUser } from './user'
import { ApiContractUsers } from './users'

export default interface ApiContract {
  demands: ApiContractDemands,
  messages: ApiContractMessages,
  scenarios: ApiContractScenarios,
  user: ApiContractUser,
  users: ApiContractUsers,
}
