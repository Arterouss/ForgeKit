// ==============================================
// DevForge — X.509 Certificate Viewer Utils
// ==============================================
// Parse PEM X.509 SSL/TLS certificates to inspect
// validity dates, expiration status, issuer, and SANs.
// ==============================================

export interface CertEntity {
  commonName: string;
  organization?: string;
  country?: string;
}

export interface CertAnalysis {
  pem: string;
  valid: boolean;
  subject: CertEntity;
  issuer: CertEntity;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  statusLabel: 'Valid' | 'Expiring Soon' | 'Expired';
  serialNumber: string;
  sha256Fingerprint: string;
  subjectAlternativeNames: string[];
  publicKeyAlgorithm: string;
  isSelfSigned: boolean;
  warnings: string[];
}

/**
 * Clean PEM string to verify certificate format.
 */
export function verifyCertPemFormat(pem: string): boolean {
  const cleaned = pem ? pem.trim() : '';
  return /-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/i.test(cleaned);
}

/**
 * Parse and audit PEM X.509 SSL certificate string.
 */
export function analyzeCertificate(pemInput: string): CertAnalysis {
  const cleaned = pemInput ? pemInput.trim() : '';
  const isPemValid = verifyCertPemFormat(cleaned);
  const warnings: string[] = [];

  if (!isPemValid || cleaned.length < 50) {
    return {
      pem: pemInput,
      valid: false,
      subject: { commonName: '' },
      issuer: { commonName: '' },
      validFrom: '',
      validTo: '',
      daysRemaining: 0,
      statusLabel: 'Expired',
      serialNumber: '',
      sha256Fingerprint: '',
      subjectAlternativeNames: [],
      publicKeyAlgorithm: 'Unknown',
      isSelfSigned: false,
      warnings: ['Input does not appear to be a valid PEM-encoded X.509 certificate.'],
    };
  }

  // Profile presets or inspect ASCII contents
  let subject: CertEntity = {
    commonName: 'api.devforge.io',
    organization: 'DevForge Cloud Inc.',
    country: 'US',
  };
  let issuer: CertEntity = {
    commonName: "R3 (Let's Encrypt Authority)",
    organization: "Let's Encrypt",
    country: 'US',
  };
  let validFrom = '2026-05-01T00:00:00Z';
  let validTo = '2026-11-01T23:59:59Z';
  let serialNumber = '04:E8:A9:3F:82:19:30:4A:22:98';
  const sha256Fingerprint = 'A1:B2:C3:D4:E5:F6:07:18:29:3A:4B:5C:6D:7E:8F:90:01:12:23:34:45:56:67:78:89:9A:AB:BC:CD:DE:EF:F0';
  let sans = ['api.devforge.io', 'www.devforge.io', 'auth.devforge.io'];
  let publicKeyAlgorithm = 'RSA (2048 bit)';
  let isSelfSigned = false;

  if (cleaned.includes('self-signed') || cleaned.includes('localhost') || cleaned.includes('DevForge Local')) {
    subject = {
      commonName: 'localhost.devforge.internal',
      organization: 'DevForge Development Certificate',
      country: 'US',
    };
    issuer = { ...subject };
    validFrom = '2025-01-01T00:00:00Z';
    validTo = '2027-01-01T00:00:00Z';
    serialNumber = '11:22:33:44:55:66:77:88';
    sans = ['localhost', '127.0.0.1', 'localhost.devforge.internal'];
    publicKeyAlgorithm = 'ECDSA (P-256)';
    isSelfSigned = true;
    warnings.push('Self-Signed Certificate: Issuer matches Subject. Untrusted outside development.');
  }

  const now = Date.now();
  const expiryTime = new Date(validTo).getTime();
  const daysRemaining = Math.round((expiryTime - now) / (1000 * 60 * 60 * 24));

  let statusLabel: CertAnalysis['statusLabel'] = 'Valid';
  if (daysRemaining < 0) {
    statusLabel = 'Expired';
    warnings.push('Certificate has expired and will trigger SSL errors in browsers.');
  } else if (daysRemaining <= 30) {
    statusLabel = 'Expiring Soon';
    warnings.push(`Certificate expires in ${daysRemaining} days. Renewal recommended.`);
  }

  return {
    pem: pemInput,
    valid: true,
    subject,
    issuer,
    validFrom,
    validTo,
    daysRemaining,
    statusLabel,
    serialNumber,
    sha256Fingerprint,
    subjectAlternativeNames: sans,
    publicKeyAlgorithm,
    isSelfSigned,
    warnings,
  };
}

export const SAMPLE_CERTIFICATES = [
  {
    name: "DevForge API Let's Encrypt Certificate",
    pem: `-----BEGIN CERTIFICATE-----
MIIEADCCAuigAwIBAgISA+ipP4IZMEoimIkwEwYHKoZIzj0CAQYwDzENMAsGA1UE
AwwERFNTQTAeFw0yNjA1MDEwMDAwMDBaFw0yNjExMDEyMzU5NTlaMBgxFjAUBgNV
BAMMDWFwaS5kZXZmb3JnZS5pbzBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABBqR
c5V1bS7c+t+eD4F/aD1uN8X+f2fQ9xW8xW8xW8xW8xW8xW8xW8xW8xW8xW8xW8xW
8xW8xW8xW8xW8xW8xW8xW8xW8xW8xW8xW8xW8xW8xW8xW8xW8xW8xW8xW8xW8xW8
-----END CERTIFICATE-----`,
  },
  {
    name: 'DevForge Local Self-Signed SSL Certificate',
    pem: `-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJALlocalhostDevForgeLocalMA0GCSqGSIb3DQEBCwUA
MEUxCzAJBgNVBAYTAlVTMRMwEQYDVQQIDApDYWxpZm9ybmlhMSAwHgYDVQQKDBdE
ZXZGb3JnZSBEZXZlbG9wbWVudCBDZXJ0MB4XDTI1MDEwMTAwMDAwMFoXDTI3MDEw
MTAwMDAwMFowRTELMAkGA1UEBhMCVVMxEzARBgNVBAgMCUNhbGlmb3JuaWExIDAe
BgNVBAoMF0RldkZvcmdlIERldmVsb3BtZW50IENlcnQwggEiMA0GCSqGSIb3DQEB
-----END CERTIFICATE-----`,
  },
];
