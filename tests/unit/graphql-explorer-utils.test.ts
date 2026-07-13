import { describe, it, expect } from 'vitest';
import {
  analyzeGraphQlQuery,
  formatGraphQlQuery,
  generateGraphQlCurl,
  GRAPHQL_SAMPLE_QUERIES,
} from '@/lib/graphql-explorer-utils';

describe('GraphQL Explorer Utilities (graphql-explorer-utils.ts)', () => {
  it('should analyze GraphQL query string and detect operation type and name', () => {
    const sample = GRAPHQL_SAMPLE_QUERIES[0].queryText;
    const analysis = analyzeGraphQlQuery(sample);

    expect(analysis.isValid).toBe(true);
    expect(analysis.operationType).toBe('query');
    expect(analysis.operationName).toBe('GetRepoStats');
  });

  it('should format GraphQL query string cleanly', () => {
    const raw = `query Test { me { id name } }`;
    const formatted = formatGraphQlQuery(raw);

    expect(formatted).toContain('query Test {');
    expect(formatted).toContain('me {');
  });

  it('should generate valid cURL command containing query and variables payload', () => {
    const sample = GRAPHQL_SAMPLE_QUERIES[0];
    const curl = generateGraphQlCurl(
      sample.endpointUrl,
      sample.queryText,
      sample.variablesJson,
      'ghp_sample_token_123'
    );

    expect(curl).toContain('curl -X POST "https://api.github.com/graphql"');
    expect(curl).toContain('Authorization: Bearer ghp_sample_token_123');
    expect(curl).toContain('GetRepoStats');
  });
});
