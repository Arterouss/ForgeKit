import { describe, it, expect } from 'vitest';
import {
  encodeBase32,
  decodeBase32,
  formatBase32Chunks,
} from '@/lib/base32-utils';

describe('Base32 Encoder / Decoder Utilities (base32-utils.ts)', () => {
  it('should encode and decode string symmetrically', () => {
    const input = 'DevForge Base32 Test';
    const encoded = encodeBase32(input);
    const decoded = decodeBase32(encoded);

    expect(decoded.valid).toBe(true);
    expect(decoded.decodedText).toBe(input);
  });

  it('should format Base32 into 4-character chunks correctly', () => {
    const str = 'ABCDEFGH';
    expect(formatBase32Chunks(str)).toBe('ABCD EFGH');
  });

  it('should flag invalid Base32 characters like 1, 8, 9', () => {
    const decoded = decodeBase32('INVALID189');
    expect(decoded.valid).toBe(false);
    expect(decoded.error).toBeDefined();
  });
});
