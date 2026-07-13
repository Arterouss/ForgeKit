// ==============================================
// DevForge — GraphQL Explorer & Query Builder Utils
// ==============================================
// Parse GraphQL queries/mutations, format syntax,
// inspect variables, and generate HTTP execution
// snippets (cURL / fetch).
// ==============================================

export interface GraphQlAnalysis {
  isValid: boolean;
  operationType: 'query' | 'mutation' | 'subscription' | 'unknown';
  operationName: string;
  fieldCount: number;
  formattedQuery: string;
  errorMessage?: string;
}

/**
 * Basic analyzer and formatter for GraphQL operation strings.
 */
export function analyzeGraphQlQuery(queryText: string): GraphQlAnalysis {
  const trimmed = queryText.trim();
  if (!trimmed) {
    return {
      isValid: false,
      operationType: 'unknown',
      operationName: '',
      fieldCount: 0,
      formattedQuery: '',
      errorMessage: 'GraphQL query is empty.',
    };
  }

  // Detect operation type
  let operationType: 'query' | 'mutation' | 'subscription' | 'unknown' = 'query';
  if (/^\s*mutation\b/i.test(trimmed)) {
    operationType = 'mutation';
  } else if (/^\s*subscription\b/i.test(trimmed)) {
    operationType = 'subscription';
  }

  // Detect operation name
  let operationName = 'AnonymousOperation';
  const nameMatch = trimmed.match(/(?:query|mutation|subscription)\s+([a-zA-Z0-9_]+)/);
  if (nameMatch && nameMatch[1]) {
    operationName = nameMatch[1];
  }

  // Count braces as rough proxy for field/block depth count
  const openBraceMatches = trimmed.match(/\{/g) || [];
  const fieldCount = openBraceMatches.length;

  // Simple clean indentation formatter
  const formatted = formatGraphQlQuery(trimmed);

  return {
    isValid: true,
    operationType,
    operationName,
    fieldCount,
    formattedQuery: formatted,
  };
}

/**
 * Format GraphQL syntax indentation nicely.
 */
export function formatGraphQlQuery(queryText: string): string {
  const lines = queryText.split('\n');
  let depth = 0;
  const output: string[] = [];

  lines.forEach((line) => {
    const clean = line.trim();
    if (!clean) return;

    if (clean.startsWith('}')) {
      depth = Math.max(0, depth - 1);
    }

    const indent = '  '.repeat(depth);
    output.push(`${indent}${clean}`);

    if (clean.endsWith('{')) {
      depth++;
    }
  });

  return output.join('\n');
}

/**
 * Generate cURL POST request for executing GraphQL query.
 */
export function generateGraphQlCurl(
  endpointUrl: string,
  queryText: string,
  variablesJson: string,
  authToken?: string
): string {
  const url = endpointUrl.trim() || 'https://api.devforge.io/graphql';
  let parsedVars: Record<string, unknown> = {};

  try {
    if (variablesJson.trim()) {
      parsedVars = JSON.parse(variablesJson);
    }
  } catch {
    // If invalid JSON, leave empty object
  }

  const payload = {
    query: queryText.trim(),
    variables: parsedVars,
  };

  const headers = ['-H "Content-Type: application/json"', '-H "Accept: application/json"'];
  if (authToken?.trim()) {
    headers.push(`-H "Authorization: Bearer ${authToken.trim()}"`);
  }

  return `curl -X POST "${url}" \\
  ${headers.join(' \\\n  ')} \\
  -d '${JSON.stringify(payload).replace(/'/g, "'\\''")}'`;
}

export const GRAPHQL_SAMPLE_QUERIES: {
  name: string;
  description: string;
  endpointUrl: string;
  queryText: string;
  variablesJson: string;
}[] = [
  {
    name: 'GitHub GraphQL API — Repository Stars & Issues',
    description: 'Fetch repository star count, open issue count, and latest commit ref',
    endpointUrl: 'https://api.github.com/graphql',
    queryText: `query GetRepoStats($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    name
    stargazerCount
    issues(states: OPEN) {
      totalCount
    }
    defaultBranchRef {
      name
    }
  }
}`,
    variablesJson: JSON.stringify(
      {
        owner: 'Arterouss',
        name: 'ForgeKit',
      },
      null,
      2
    ),
  },
  {
    name: 'DevForge Cloud — Update Profile Role Mutation',
    description: 'Update current developer role tags and retrieve updated user info',
    endpointUrl: 'https://api.devforge.io/graphql',
    queryText: `mutation UpdateUserRole($userId: ID!, $role: String!) {
  updateUserRole(userId: $userId, role: $role) {
    id
    username
    roles
    updatedAt
  }
}`,
    variablesJson: JSON.stringify(
      {
        userId: 'usr_88190',
        role: 'LEAD_ARCHITECT',
      },
      null,
      2
    ),
  },
];
