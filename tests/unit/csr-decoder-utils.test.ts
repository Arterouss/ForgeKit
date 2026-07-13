import { describe, it, expect } from 'vitest';
import {
  decodeCsr,
  extractCsrBase64,
  SAMPLE_CSR_PRESETS,
} from '@/lib/csr-decoder-utils';

describe('CSR Decoder Utilities (csr-decoder-utils.ts)', () => {
  it('should extract base64 from PEM request', () => {
    const sample = SAMPLE_CSR_PRESETS[0];
    const { base64, validPem } = extractCsrBase64(sample.pem);
    expect(validPem).toBe(true);
    expect(base64.length).toBeGreaterThan(50);
  });

  it('should analyze DevForge CSR preset and extract subject fields', () => {
    const sample = SAMPLE_CSR_PRESETS[0];
    const analysis = decodeCsr(sample.pem);

    expect(analysis.valid).toBe(true);
    expect(analysis.subject.commonName).toBe('api.devforge.internal');
    expect(analysis.keySizeBits).toBe(2048);
    expect(analysis.subjectAlternativeNames).toContain('api.devforge.internal');
  });

  it('should flag invalid non-CSR input', () => {
    const analysis = decodeCsr('short invalid string');
    expect(analysis.valid).toBe(false);
    expect(analysis.warnings.length).toBeGreaterThan(0);
  });
});
