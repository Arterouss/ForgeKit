import { describe, it, expect } from 'vitest';
import {
  buildFullUrl,
  generateCurlSnippet,
  generateFetchSnippet,
  REST_REQUEST_PRESETS,
} from '@/lib/rest-request-utils';

describe('REST Request Builder Utilities (rest-request-utils.ts)', () => {
  it('should build full URL with enabled query parameters correctly', () => {
    const preset = REST_REQUEST_PRESETS[0].config;
    const url = buildFullUrl(preset.url, preset.queryParams);

    expect(url).toBe(
      'https://api.devforge.io/v1/users/profile?include_roles=true&format=extended'
    );
  });

  it('should generate cURL POST snippet with JSON payload correctly', () => {
    const preset = REST_REQUEST_PRESETS[1].config;
    const curl = generateCurlSnippet(preset);

    expect(curl).toContain('curl -X POST "https://api.devforge.io/v1/deployments"');
    expect(curl).toContain('Authorization: Bearer');
    expect(curl).toContain('devforge-webapp');
  });

  it('should generate fetch() snippet with headers and method', () => {
    const preset = REST_REQUEST_PRESETS[0].config;
    const fetchCode = generateFetchSnippet(preset);

    expect(fetchCode).toContain('await fetch("https://api.devforge.io/v1/users/profile');
    expect(fetchCode).toContain('method: "GET"');
  });
});
