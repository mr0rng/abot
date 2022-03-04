import createCommand from '../../factory/search'
import { scenariosSearchEnv } from '../../factory/search/scenarios'

export default createCommand(scenariosSearchEnv(
  "scenarios.count", 
  true,
  "count(id)::INTEGER as count",
  {
    type: "object",
    properties: {
      q: {type: "string", nullable: true},
      id: {type: "string", nullable: true},
    },
    required: [],
    additionalProperties: false
  }
))