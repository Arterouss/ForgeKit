import { describe, it, expect } from 'vitest';
import {
  encodeHex,
  decodeHex,
  generateHexDump,
} from '@/lib/hex-utils';

describe('Hexadecimal Encoder / Decoder Utilities (hex-utils.ts)', () => {
  it('should encode string to uppercase hex cleanly', () => {
    const encoded = encodeHex('ABC', 'none', true);
    expect(encoded).toBe('414243');
  });

  it('should encode hex with colon delimiter', () => {
    const encoded = encodeHex('AB', 'colon', true);
    expect(encoded).toBe('41:42');
  });

  it('should decode hex string with delimiters back to UTF-8 text', () => {
    const decoded = decodeHex('41:42:43');
    expect(decoded.valid).toBe(true);
    expect(decoded.decodedText).toBe('ABC');
  });

  it('should generate 16-byte hex dump with offset and ASCII column', () => {
    const dump = generateHexDump('Hello DevForge Hex Dump');
    expect(dump).toContain('00000000');
    expect(dump).toContain('|Hello DevForge H|');
  });

  it('should reject invalid non-hex characters', () => {
    const decoded = decodeHex('ZZZZ99');
    expect(decoded.valid).toBe(false);
    expect(decoded.error).toBeDefined();
  });
});
