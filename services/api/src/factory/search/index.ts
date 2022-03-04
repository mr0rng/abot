import { JSONSchemaType } from "ajv";

import DAO from "@abot/dao";
import { SearchRequest } from "@abot/model";

import { Command } from "../../commands";

export const createCallback = <Request, Response>(env: SearchEnv<Request>) => async (
  { dao }: SearchApp, 
  request: Request
): Promise<Response> => {
  const params: unknown[] = [];
  const searchRequest = request as unknown as SearchRequest;

  const { rows } = await dao.execute<Response>(
    `
      SELECT ${env.fields} 
      FROM "${env.tableName}"
      ${env.sql(params, request)}
      ${typeof searchRequest.limit === 'number' ? `LIMIT $${params.push(searchRequest.limit)}` : ''}
      ${typeof searchRequest.offset === 'number' ? `OFFSET $${params.push(searchRequest.offset)}` : ''}
    `, 
    params
  );

  if (env.isCount) {
    return rows[0];
  }

  return rows as unknown as Response;
}

export default <Request, Response>(env: SearchEnv<Request>): Command<Request, Response> => 
  new Command(
    env.path,
    createCallback(env),
    env.schema
  )
;

export interface SearchEnv<Request> {  
  path: string,
  tableName: string,
  isCount: boolean,
  fields: string,
  sql: (params: unknown[], request: Request) => string,
  schema: JSONSchemaType<Request>,
}

export const processQuery = (sql: string, params: unknown[], q: string): string[] => {
  const tokens = new Set();
  const result: string[] = [];

  for (const token of q.split(/[^a-z0-9]/)) {
    if (token.length < 3 || tokens.has(token)) {
      continue;
    }

    tokens.add(token);
    result.push(`${sql} ILIKE $${params.push(`%${token}%`)}`);
  }

  return result;
};

  
export type SearchApp = { dao: DAO };