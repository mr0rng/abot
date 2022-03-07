import { DemandsSearchRequest } from '@abot/api-contract/target/demands';

import { processQuery } from '.';

export const expressions = ({ q, id, scenario, isActive }: DemandsSearchRequest, params: unknown[]): string => {
  const expressions = processQuery(`("title" || ' ' || "description")`, params, q);

  // id
  if (id != null) {
    expressions.push(`"id" = $${params.push(id)}`);
  }

  // scenario
  if (scenario != null) {
    expressions.push(`"scenario" = $${params.push(scenario)}`);
  }

  // status
  expressions.push(`"status" ${isActive == null || isActive === true ? '<>' : '='} 'closed'`);

  return expressions.join(' AND ');
};
