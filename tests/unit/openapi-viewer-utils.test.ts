import { describe, it, expect } from 'vitest';
import {
  parseOpenApiSpec,
  generateEndpointCurl,
  OPENAPI_SAMPLE_SPECS,
} from '@/lib/openapi-viewer-utils';

describe('OpenAPI Viewer Utilities (openapi-viewer-utils.ts)', () => {
  it('should parse OpenAPI 3.0 sample spec correctly', () => {
    const specJson = OPENAPI_SAMPLE_SPECS[0].jsonText;
    const summary = parseOpenApiSpec(specJson);

    expect(summary.isValid).toBe(true);
    expect(summary.title).toBe('DevForge Cloud Management API');
    expect(summary.endpoints.length).toBe(3);
  });

  it('should generate sample cURL command for endpoint correctly', () => {
    const specJson = OPENAPI_SAMPLE_SPECS[0].jsonText;
    const summary = parseOpenApiSpec(specJson);
    const getDeployments = summary.endpoints.find((e) => e.path === '/deployments' && e.method === 'GET');

    expect(getDeployments).toBeDefined();
    if (getDeployments) {
      const curl = generateEndpointCurl('https://api.devforge.io/v1', getDeployments);
      expect(curl).toContain('https://api.devforge.io/v1/deployments');
      expect(curl).toContain('-H "Accept: application/json"');
    }
  });
});
