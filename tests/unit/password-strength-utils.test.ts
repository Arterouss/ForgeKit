import { describe, it, expect } from 'vitest';
import {
  analyzePasswordStrength,
  formatCrackTime,
  SAMPLE_PASSWORDS_TO_ANALYZE,
} from '@/lib/password-strength-utils';

describe('Password Strength Analyzer Utilities (password-strength-utils.ts)', () => {
  it('should detect weak password flaws and reduce score', () => {
    const analysis = analyzePasswordStrength('password123!');

    expect(analysis.flaws.length).toBeGreaterThan(0);
    expect(analysis.score).toBeLessThanOrEqual(40);
  });

  it('should recognize uncrackable passphrase or strong password', () => {
    const sample = SAMPLE_PASSWORDS_TO_ANALYZE[2].password;
    const analysis = analyzePasswordStrength(sample);

    expect(analysis.entropyBits).toBeGreaterThan(80);
    expect(['Strong', 'Uncrackable']).toContain(analysis.label);
  });

  it('should format crack time appropriately for high entropy', () => {
    expect(formatCrackTime(10)).toContain('Instant');
    expect(formatCrackTime(80)).toContain('Millions of years');
  });
});
