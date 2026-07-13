import { describe, it, expect } from 'vitest';
import {
  parseRawHeaders,
  inspectHttpHeaders,
  HTTP_HEADER_SAMPLES,
} from '@/lib/http-header-utils';

describe('HTTP Header Inspector Utilities (http-header-utils.ts)', () => {
  it('should parse raw HTTP headers into lowercase key-value record', () => {
    const raw = 'Content-Type: text/html\nServer: Apache\n';
    const parsed = parseRawHeaders(raw);

    expect(parsed['content-type']).toBe('text/html');
    expect(parsed['server']).toBe('Apache');
  });

  it('should inspect OWASP Hardened sample and grade A+', () => {
    const sample = HTTP_HEADER_SAMPLES[0].content;
    const result = inspectHttpHeaders(sample);

    expect(result.grade).toBe('A+');
    expect(result.leakedHeaders.length).toBe(0);
  });

  it('should detect Server and X-Powered-By leakage on insecure sample', () => {
    const sample = HTTP_HEADER_SAMPLES[1].content;
    const result = inspectHttpHeaders(sample);

    expect(result.leakedHeaders.length).toBe(2);
    expect(result.leakedHeaders[0].headerName).toBe('Server');
    expect(result.grade).toBe('F');
  });
});
