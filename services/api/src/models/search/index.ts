export const processQuery = (sql: string, params: unknown[], q = ''): string[] => {
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
