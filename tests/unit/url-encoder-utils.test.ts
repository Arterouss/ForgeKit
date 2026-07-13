import { describe, it, expect } from 'vitest';
import {
  encodeUrlText,
  decodeUrlText,
  parseUrlComponents,
  URL_ENCODER_PRESETS,
} from '@/lib/url-encoder-utils';

describe('URL Encoder / Decoder Utilities (url-encoder-utils.ts)', () => {
  it('should encode and decode URI component roundtrip correctly', () => {
    const original = 'query=DevForge Pro & tag=devops/api';
    const encoded = encodeUrlText(original, 'component');
    const decoded = decodeUrlText(encoded, 'component');

    expect(encoded).toContain('%20');
    expect(decoded).toBe(original);
  });

  it('should handle form encoding with plus signs correctly', () => {
    const input = 'hello world';
    const encoded = encodeUrlText(input, 'form');

    expect(encoded).toBe('hello+world');
    expect(decodeUrlText('hello+world', 'form')).toBe('hello world');
  });

  it('should parse URL components and extract query params correctly', () => {
    const url = URL_ENCODER_PRESETS[0].content;
    const parsed = parseUrlComponents(url);

    expect(parsed.isValid).toBe(true);
    expect(parsed.host).toBe('auth.devforge.io');
    expect(parsed.queryParams.some((q) => q.key === 'client_id' && q.value === 'forge_app_01')).toBe(
      true
    );
  });
});
