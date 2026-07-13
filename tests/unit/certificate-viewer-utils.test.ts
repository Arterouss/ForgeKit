import { describe, it, expect } from 'vitest';
import {
  analyzeCertificate,
  verifyCertPemFormat,
  SAMPLE_CERTIFICATES,
} from '@/lib/certificate-viewer-utils';

describe('X.509 Certificate Viewer Utilities (certificate-viewer-utils.ts)', () => {
  it('should verify PEM certificate format correctly', () => {
    expect(verifyCertPemFormat(SAMPLE_CERTIFICATES[0].pem)).toBe(true);
    expect(verifyCertPemFormat('invalid certificate text')).toBe(false);
  });

  it('should audit standard certificate and detect validity', () => {
    const cert = SAMPLE_CERTIFICATES[0].pem;
    const analysis = analyzeCertificate(cert);

    expect(analysis.valid).toBe(true);
    expect(analysis.subject.commonName).toBe('api.devforge.io');
    expect(analysis.isSelfSigned).toBe(false);
  });

  it('should detect self-signed certificate appropriately', () => {
    const cert = SAMPLE_CERTIFICATES[1].pem;
    const analysis = analyzeCertificate(cert);

    expect(analysis.valid).toBe(true);
    expect(analysis.isSelfSigned).toBe(true);
    expect(analysis.warnings.some((w) => w.includes('Self-Signed'))).toBe(true);
  });
});
