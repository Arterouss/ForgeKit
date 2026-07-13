import { describe, it, expect } from 'vitest';
import {
  generateAuthSnippets,
  AUTH_SAMPLE_PRESETS,
} from '@/lib/api-auth-utils';

describe('API Authentication Helper Utilities (api-auth-utils.ts)', () => {
  it('should generate Bearer token header correctly', () => {
    const preset = AUTH_SAMPLE_PRESETS[0].config;
    const result = generateAuthSnippets(preset, 'https://api.devforge.io/test');

    expect(result.headerKey).toBe('Authorization');
    expect(result.headerValue).toContain('Bearer ');
    expect(result.curlSnippet).toContain('Authorization: Bearer');
  });

  it('should base64 encode username:password for Basic auth', () => {
    const preset = AUTH_SAMPLE_PRESETS[1].config;
    const result = generateAuthSnippets(preset, 'https://api.devforge.io/test');

    expect(result.headerKey).toBe('Authorization');
    expect(result.headerValue).toContain('Basic ');
    expect(result.curlSnippet).toContain('-u "devops_lead:StrongSecretPassword!2026"');
  });

  it('should generate OAuth 2.0 Client Credentials POST cURL snippet', () => {
    const preset = AUTH_SAMPLE_PRESETS[3].config;
    const result = generateAuthSnippets(preset);

    expect(result.curlSnippet).toContain('curl -X POST "https://auth.devforge.io/oauth/token"');
    expect(result.curlSnippet).toContain('grant_type=client_credentials');
  });
});
