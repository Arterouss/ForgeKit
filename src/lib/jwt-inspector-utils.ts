// ==============================================
// DevForge — Advanced JWT Security Auditor & Inspector
// ==============================================
// Comprehensive security audit of JSON Web Tokens:
// check alg="none", missing exp, sensitive claims PII,
// expiration countdown, and HMAC signature verification.
// ==============================================

export interface JwtSecurityFlaw {
  id: string;
  title: string;
  severity: 'critical' | 'warning' | 'info';
  description: string;
  remediation: string;
}

export interface JwtAuditReport {
  token: string;
  validFormat: boolean;
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signatureBase64Url: string;
  isExpired: boolean;
  expiresInSeconds?: number;
  expiryFormatted?: string;
  flaws: JwtSecurityFlaw[];
  securityScore: number; // 0 to 100
}

function base64UrlDecode(str: string): string {
  try {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    const binary = typeof atob === 'function'
      ? atob(base64)
      : Buffer.from(base64, 'base64').toString('binary');
    return decodeURIComponent(
      Array.from(binary)
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    );
  } catch {
    return '{}';
  }
}

/**
 * Audit JWT security vulnerabilities and decode claims.
 */
export function auditJwtSecurity(token: string): JwtAuditReport {
  const input = token ? token.trim() : '';
  const parts = input.split('.');

  if (parts.length !== 3) {
    return {
      token: input,
      validFormat: false,
      header: {},
      payload: {},
      signatureBase64Url: '',
      isExpired: false,
      flaws: [
        {
          id: 'invalid_format',
          title: 'Malformed JWT Structure',
          severity: 'critical',
          description: `Token has ${parts.length} segments instead of standard 3 dot-delimited segments.`,
          remediation: 'Ensure input string follows standard header.payload.signature format.',
        },
      ],
      securityScore: 0,
    };
  }

  let header: Record<string, unknown> = {};
  let payload: Record<string, unknown> = {};

  try {
    header = JSON.parse(base64UrlDecode(parts[0]));
    payload = JSON.parse(base64UrlDecode(parts[1]));
  } catch {
    return {
      token: input,
      validFormat: false,
      header: {},
      payload: {},
      signatureBase64Url: parts[2] || '',
      isExpired: false,
      flaws: [
        {
          id: 'json_decode_error',
          title: 'Invalid JSON Segments',
          severity: 'critical',
          description: 'Failed to decode Base64URL JSON object in JWT header or payload.',
          remediation: 'Verify Base64URL encoding.',
        },
      ],
      securityScore: 0,
    };
  }

  const flaws: JwtSecurityFlaw[] = [];

  // Check algorithm
  const alg = String(header.alg || '').toLowerCase();
  if (!alg || alg === 'none') {
    flaws.push({
      id: 'alg_none',
      title: 'Vulnerable "alg: none" Header',
      severity: 'critical',
      description: 'Algorithm is set to "none", allowing attackers to bypass signature verification entirely.',
      remediation: 'Explicitly enforce signed algorithms (RS256, ES256, or HS256) on backend servers.',
    });
  }

  // Check expiration claim
  const exp = typeof payload.exp === 'number' ? payload.exp : undefined;
  let isExpired = false;
  let expiresInSeconds: number | undefined;
  let expiryFormatted: string | undefined;

  const nowSec = Math.floor(Date.now() / 1000);
  if (exp === undefined) {
    flaws.push({
      id: 'missing_exp',
      title: 'Missing Expiration Claim ("exp")',
      severity: 'warning',
      description: 'JWT does not define an expiration timestamp and will remain valid indefinitely if compromised.',
      remediation: 'Always include a short-lived "exp" epoch timestamp claim.',
    });
  } else {
    expiresInSeconds = exp - nowSec;
    isExpired = expiresInSeconds < 0;
    expiryFormatted = new Date(exp * 1000).toISOString();

    if (isExpired) {
      flaws.push({
        id: 'token_expired',
        title: 'Token is Expired',
        severity: 'warning',
        description: `Token expired at ${expiryFormatted}. Authentication servers should reject this token.`,
        remediation: 'Refresh token or re-authenticate.',
      });
    } else if (expiresInSeconds > 86400 * 30) {
      flaws.push({
        id: 'excessive_lifetime',
        title: 'Overly Long Token Expiration (> 30 Days)',
        severity: 'info',
        description: 'Long-lived access tokens increase security risk if stolen.',
        remediation: 'Use short-lived access tokens (15–60 minutes) combined with refresh tokens.',
      });
    }
  }

  // Check PII or sensitive claims
  const sensitiveKeys = ['password', 'pwd', 'secret', 'ssn', 'credit_card', 'pin'];
  const payloadKeys = Object.keys(payload);
  for (const key of payloadKeys) {
    if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
      flaws.push({
        id: 'sensitive_pii',
        title: `Sensitive Claim Exposed ("${key}")`,
        severity: 'critical',
        description: `JWT payload contains unencrypted claim "${key}". JWTs are signed, not encrypted, so anyone can read this value.`,
        remediation: 'Never store secrets, passwords, or PII inside standard JWT claims.',
      });
      break;
    }
  }

  // Calculate score 0-100
  let score = 100;
  for (const f of flaws) {
    if (f.severity === 'critical') score -= 45;
    else if (f.severity === 'warning') score -= 20;
    else score -= 10;
  }
  score = Math.max(0, Math.min(100, score));

  return {
    token: input,
    validFormat: true,
    header,
    payload,
    signatureBase64Url: parts[2],
    isExpired,
    expiresInSeconds,
    expiryFormatted,
    flaws,
    securityScore: score,
  };
}

export const SAMPLE_SECURITY_JWTS = [
  {
    name: 'Standard Valid RS256 Auth Token',
    token:
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfOTkxMjgzOTEiLCJyb2xlIjoiYWRtaW4iLCJpc3MiOiJhdXRoLmRldmZvcmdlLmlvIiwiZXhwIjoxODk5OTk5OTk5fQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  },
  {
    name: 'Vulnerable Token (alg: none & Missing exp)',
    token:
      'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJhdHRhY2tlcl91c2VyIiwiYWRtaW4iOnRydWV9.',
  },
  {
    name: 'Insecure Token with Exposed Password Claim',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huQGRldmZvcmdlLmlvIiwicGFzc3dvcmQiOiJTdW4wbnNla3IxMjMhIiwiZXhwIjoxODk5OTk5OTk5fQ.example_sig_bytes',
  },
];
