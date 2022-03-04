import { JSONSchemaType } from "ajv";

import { ScenariosSearchRequest } from '@abot/api-contract/target/scenarios'

import { SearchEnv, processQuery } from '.'

export const scenariosSearchEnv = <T extends ScenariosSearchRequest>(
  path: string, 
  isCount: boolean,
  fields: string,
  schema: JSONSchemaType<T>
): SearchEnv<T> => ({
  path,
  tableName: "Scenarios",
  isCount,
  fields,
  schema,
  sql: (params: unknown[], request: ScenariosSearchRequest): string => {
    const expressions = processQuery(`("id" || ' ' || "description")`, params, request.q || '');
    
    // id
    if (request.id != null) {
      expressions.push(`"id" = $${params.push(request.id)}`)
    }

    // isDeleted
    expressions.push(`"isDeleted" = FALSE`);

    return `WHERE ${expressions.join(' AND ')}`;
  }
});