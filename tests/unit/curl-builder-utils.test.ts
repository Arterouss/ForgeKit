import { describe, it, expect } from 'vitest';
import {
  generateCurlCommand,
  CURL_BUILDER_PRESETS,
} from '@/lib/curl-builder-utils';

describe('cURL Builder Utilities (curl-builder-utils.ts)', () => {
  it('should generate multi-line POST cURL command with Bearer auth correctly', () => {
    const config = CURL_BUILDER_PRESETS[0].config;
    const output = generateCurlCommand(config);

    expect(output.singleline).toContain('curl -X POST');
    expect(output.multiline).toContain('-X POST');
    expect(output.multiline).toContain('Authorization: Bearer df_live_sec_token_98210');
    expect(output.multiline).toContain('-L');
    expect(output.multiline).toContain('api-gateway');
  });

  it('should include insecure SSL (-k) and basic auth (-u) flags when configured', () => {
    const config = CURL_BUILDER_PRESETS[1].config;
    const output = generateCurlCommand(config);

    expect(output.singleline).toContain('-k');
    expect(output.singleline).toContain('-u "admin:secretDevOps2026"');
  });

  it('should generate equivalent JS fetch snippet correctly', () => {
    const config = CURL_BUILDER_PRESETS[0].config;
    const output = generateCurlCommand(config);

    expect(output.fetchSnippet).toContain('await fetch("https://api.devforge.io/v1/deployments/create"');
    expect(output.fetchSnippet).toContain('method: "POST"');
  });
});
