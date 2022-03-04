import { SearchRequest } from '@abot/model';
import { ScenariosSearchRequest } from '@abot/api-contract/target/scenarios'

import createCommand from '../../factory/search'
import { scenariosSearchEnv } from '../../factory/search/scenarios'

export default createCommand(scenariosSearchEnv<SearchRequest & ScenariosSearchRequest>(
  "scenarios.search", 
  false,
  `"id", "description", "payload"`,
  {
    type: "object",
    properties: {
      q: {type: "string", nullable: true},
      id: {type: "string", nullable: true},
      limit: {type: "number", nullable: false, minimum: 1, maximum: 100},
      offset: {type: "number", nullable: false, minimum: 0, maximum: 10000},
    },
    required: [ "limit", "offset" ],
    additionalProperties: false
  }
));