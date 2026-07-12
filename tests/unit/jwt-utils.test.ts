import { describe, it, expect } from 'vitest';
import { decodeJwt, formatUnixTimestamp, SAMPLE_JWT } from '@/lib/jwt-utils';

describe('JWT Utilities (jwt-utils.ts)', () => {
  it('should successfully decode the SAMPLE_JWT', () => {
    const res = decodeJwt(SAMPLE_JWT);
    expect(res.isValid).toBe(true);
    expect(res.error).toBeNull();
    expect(res.header?.alg).toBe('HS256');
    expect(res.payload?.sub).toBe('user-4250');
    expect(res.payload?.name).toBe('Alex Mercer');
    expect(res.signature).toBe('K4kSjQeK3OWe-r3dY2z4gV0h_Zk8yM6eWqL9qS7mE1A');
  });

  it('should fail gracefully for invalid JWT structure', () => {
    const res = decodeJwt('invalid-jwt-token-string');
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('expected 3 segments');
  });

  it('should fail gracefully for empty token', () => {
    const res = decodeJwt('');
    expect(res.isValid).toBe(false);
    expect(res.error).toBe('Empty JWT token provided');
  });

  it('should inspect standard claims and timestamps', () => {
    const res = decodeJwt(SAMPLE_JWT);
    expect(res.claims.some((c) => c.key === 'iss' && c.value === 'devforge.app')).toBe(true);
    expect(res.claims.some((c) => c.key === 'exp')).toBe(true);
  });

  it('should accurately format UNIX timestamps', () => {
    const nowSec = Math.floor(Date.now() / 1000);
    const pastInfo = formatUnixTimestamp(nowSec - 3600); // 1 hour ago
    expect(pastInfo.isPast).toBe(true);
    expect(pastInfo.relativeTime).toContain('ago');

    const futureInfo = formatUnixTimestamp(nowSec + 3600);
    expect(futureInfo.isPast).toBe(false);
  });
});
