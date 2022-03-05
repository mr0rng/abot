import { ScenariosSearchRequest } from '@abot/api-contract/target/scenarios';

import { processQuery } from '.';

export const expressions = ({ q, id }: ScenariosSearchRequest, params: unknown[]): string => {
  const expressions = processQuery(`("id" || ' ' || "description")`, params, q);

  // id
  if (id != null) {
    expressions.push(`"id" = $${params.push(id)}`);
  }

  // isDeleted
  expressions.push(`"isDeleted" = FALSE`);

  return expressions.join(' AND ');
};
