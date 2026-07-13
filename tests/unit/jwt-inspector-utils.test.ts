import { describe, it, expect } from 'vitest';
import {
  auditJwtSecurity,
  SAMPLE_SECURITY_JWTS,
} from '@/lib/jwt-inspector-utils';

describe('JWT Inspector & Security Auditor Utilities (jwt-inspector-utils.ts)', () => {
  it('should audit valid standard token cleanly', () => {
    const report = auditJwtSecurity(SAMPLE_SECURITY_JWTS[0].token);
    expect(report.validFormat).toBe(true);
    expect(report.header.alg).toBe('RS256');
    expect(report.securityScore).toBeGreaterThanOrEqual(80);
  });

  it('should detect alg: none vulnerability and missing exp claim', () => {
    const report = auditJwtSecurity(SAMPLE_SECURITY_JWTS[1].token);
    expect(report.validFormat).toBe(true);
    expect(report.flaws.some((f) => f.id === 'alg_none')).toBe(true);
    expect(report.flaws.some((f) => f.id === 'missing_exp')).toBe(true);
    expect(report.securityScore).toBeLessThan(50);
  });

  it('should detect unencrypted password/PII claim in payload', () => {
    const report = auditJwtSecurity(SAMPLE_SECURITY_JWTS[2].token);
    expect(report.flaws.some((f) => f.id === 'sensitive_pii')).toBe(true);
  });
});
