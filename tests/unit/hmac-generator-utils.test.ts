import { describe, it, expect } from 'vitest';
import {
  generateHmac,
  verifyHmacMatch,
  SAMPLE_HMAC_PRESETS,
} from '@/lib/hmac-generator-utils';

describe('HMAC Generator Utilities (hmac-generator-utils.ts)', () => {
  it('should generate HMAC-SHA256 signature with hex and base64 outputs', async () => {
    const sample = SAMPLE_HMAC_PRESETS[0];
    const result = await generateHmac(sample.message, sample.secret, sample.algorithm);

    expect(result.algorithm).toBe('SHA-256');
    expect(result.hex.length).toBeGreaterThan(0);
    expect(result.base64.length).toBeGreaterThan(0);
  });

  it('should verify matching hex signature accurately', async () => {
    const result = await generateHmac('hello payload', 'my_secret_key', 'SHA-256');
    expect(verifyHmacMatch(result, result.hex)).toBe(true);
    expect(verifyHmacMatch(result, result.base64)).toBe(true);
    expect(verifyHmacMatch(result, 'wrong_signature_here')).toBe(false);
  });
});
