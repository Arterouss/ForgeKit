// ==============================================
// DevForge — JWT Utilities
// ==============================================
// Pure, client-side JWT decoding, validation,
// claim parsing, and timestamp inspection.
// ==============================================

export interface JwtClaimInfo {
  key: string;
  label: string;
  value: unknown;
  humanReadable?: string;
  isExpired?: boolean;
}

export interface JwtDecodeResult {
  isValid: boolean;
  error: string | null;
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signature: string | null;
  rawHeader: string;
  rawPayload: string;
  isExpired: boolean;
  isNotYetValid: boolean;
  claims: JwtClaimInfo[];
}

/**
 * Base64URL decode helper safe for browser & Node environments.
 */
function decodeBase64Url(str: string): string {
  // Replace Base64URL characters (- -> +, _ -> /)
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // Pad with '='
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }

  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    return decodeURIComponent(
      Array.prototype.map
        .call(window.atob(base64), (c: string) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  } else {
    // Node / SSR fallback
    return Buffer.from(base64, 'base64').toString('utf-8');
  }
}

/**
 * Formats a UNIX timestamp (seconds) to a human-readable date & relative string.
 */
export function formatUnixTimestamp(seconds: number): {
  formattedDate: string;
  relativeTime: string;
  isPast: boolean;
} {
  const date = new Date(seconds * 1000);
  const now = Date.now();
  const diffSec = Math.round((date.getTime() - now) / 1000);
  const isPast = diffSec < 0;
  const absDiff = Math.abs(diffSec);

  let relativeTime = '';
  if (absDiff < 60) {
    relativeTime = isPast ? `${absDiff} seconds ago` : `in ${absDiff} seconds`;
  } else if (absDiff < 3600) {
    const mins = Math.floor(absDiff / 60);
    relativeTime = isPast ? `${mins} minutes ago` : `in ${mins} minutes`;
  } else if (absDiff < 86400) {
    const hours = Math.floor(absDiff / 3600);
    relativeTime = isPast ? `${hours} hours ago` : `in ${hours} hours`;
  } else {
    const days = Math.floor(absDiff / 86400);
    relativeTime = isPast ? `${days} days ago` : `in ${days} days`;
  }

  return {
    formattedDate: date.toUTCString(),
    relativeTime,
    isPast,
  };
}

/**
 * Decodes a JWT token string into Header, Payload, Signature, and Metadata.
 */
export function decodeJwt(tokenString: string): JwtDecodeResult {
  const trimmed = tokenString.trim();
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Empty JWT token provided',
      header: null,
      payload: null,
      signature: null,
      rawHeader: '',
      rawPayload: '',
      isExpired: false,
      isNotYetValid: false,
      claims: [],
    };
  }

  const parts = trimmed.split('.');
  if (parts.length !== 3) {
    return {
      isValid: false,
      error: `Invalid JWT structure: expected 3 segments separated by ".", found ${parts.length}`,
      header: null,
      payload: null,
      signature: null,
      rawHeader: '',
      rawPayload: '',
      isExpired: false,
      isNotYetValid: false,
      claims: [],
    };
  }

  const [headerB64, payloadB64, signature] = parts;

  let header: Record<string, unknown>;
  let payload: Record<string, unknown>;
  let rawHeader = '';
  let rawPayload = '';

  try {
    rawHeader = decodeBase64Url(headerB64);
    header = JSON.parse(rawHeader) as Record<string, unknown>;
  } catch {
    return {
      isValid: false,
      error: 'Failed to decode or parse JWT Header segment (invalid Base64URL / JSON)',
      header: null,
      payload: null,
      signature: null,
      rawHeader: '',
      rawPayload: '',
      isExpired: false,
      isNotYetValid: false,
      claims: [],
    };
  }

  try {
    rawPayload = decodeBase64Url(payloadB64);
    payload = JSON.parse(rawPayload) as Record<string, unknown>;
  } catch {
    return {
      isValid: false,
      error: 'Failed to decode or parse JWT Payload segment (invalid Base64URL / JSON)',
      header: null,
      payload: null,
      signature: null,
      rawHeader: '',
      rawPayload: '',
      isExpired: false,
      isNotYetValid: false,
      claims: [],
    };
  }

  // Inspect standard timestamps & claims
  const claims: JwtClaimInfo[] = [];
  let isExpired = false;
  let isNotYetValid = false;

  const standardClaimsMap: Record<string, string> = {
    exp: 'Expiration Time (exp)',
    nbf: 'Not Before (nbf)',
    iat: 'Issued At (iat)',
    iss: 'Issuer (iss)',
    sub: 'Subject (sub)',
    aud: 'Audience (aud)',
    jti: 'JWT ID (jti)',
  };

  for (const [key, label] of Object.entries(standardClaimsMap)) {
    if (payload[key] !== undefined) {
      const val = payload[key];
      let humanReadable: string | undefined;

      if ((key === 'exp' || key === 'iat' || key === 'nbf') && typeof val === 'number') {
        const timeInfo = formatUnixTimestamp(val);
        humanReadable = `${timeInfo.formattedDate} (${timeInfo.relativeTime})`;
        if (key === 'exp' && timeInfo.isPast) {
          isExpired = true;
        }
        if (key === 'nbf' && !timeInfo.isPast) {
          isNotYetValid = true;
        }
      }

      claims.push({
        key,
        label,
        value: val,
        humanReadable,
        isExpired: key === 'exp' ? isExpired : undefined,
      });
    }
  }

  return {
    isValid: true,
    error: null,
    header,
    payload,
    signature,
    rawHeader: JSON.stringify(header, null, 2),
    rawPayload: JSON.stringify(payload, null, 2),
    isExpired,
    isNotYetValid,
    claims,
  };
}

/**
 * SAMPLE JWT token (expired sample with standard claims for demo purposes).
 * Header: {"alg":"HS256","typ":"JWT"}
 * Payload: {"sub":"user-4250","name":"Alex Mercer","role":"Lead Architect","iss":"devforge.app","iat":1700000000,"exp":2100000000}
 */
export const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOiJ1c2VyLTQyNTAiLCJuYW1lIjoiQWxleCBNZXJjZXIiLCJyb2xlIjoiTGVhZCBBcmNoaXRlY3QiLCJpc3MiOiJkZXZmb3JnZS5hcHAiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjEwMDAwMDAwMH0.' +
  'K4kSjQeK3OWe-r3dY2z4gV0h_Zk8yM6eWqL9qS7mE1A';
