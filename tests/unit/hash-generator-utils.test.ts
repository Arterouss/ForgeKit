import { describe, it, expect } from 'vitest';
import {
  generateHash,
  generateAllHashes,
  verifyHashMatch,
} from '@/lib/hash-generator-utils';

describe('Hash Generator Utilities (hash-generator-utils.ts)', () => {
  it('should generate SHA-256 hash string', async () => {
    const result = await generateHash('hello world', 'SHA-256');
    expect(result.algorithm).toBe('SHA-256');
    expect(result.hex.length).toBeGreaterThan(0);
    expect(result.uppercaseHex).toBe(result.hex.toUpperCase());
  });

  it('should generate all supported hashes simultaneously', async () => {
    const all = await generateAllHashes('devforge test');
    expect(all['SHA-1']).toBeDefined();
    expect(all['SHA-256']).toBeDefined();
    expect(all['SHA-384']).toBeDefined();
    expect(all['SHA-512']).toBeDefined();
  });

  it('should verify hash match case-insensitively', () => {
    expect(verifyHashMatch('a1b2c3d4', 'A1B2C3D4')).toBe(true);
    expect(verifyHashMatch('a1b2c3d4', 'x9y8z7w6')).toBe(false);
  });
});
