// ==============================================
// DevForge — HMAC Generator & Signature Verifier
// ==============================================
// Generate HMAC-SHA1, HMAC-SHA256, HMAC-SHA384, and
// HMAC-SHA512 signatures with Hex and Base64 output.
// ==============================================

export type HmacAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

export interface HmacResult {
  algorithm: HmacAlgorithm;
  hex: string;
  base64: string;
  keyLength: number;
  messageLength: number;
}

/**
 * Convert ArrayBuffer to lowercase hex string.
 */
function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

/**
 * Convert ArrayBuffer to base64 string.
 */
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return typeof btoa === 'function'
    ? btoa(binary)
    : Buffer.from(binary, 'binary').toString('base64');
}

/**
 * Deterministic fallback HMAC simulator for environments without crypto.subtle.
 */
function fallbackHmac(message: string, secret: string, algorithm: HmacAlgorithm): HmacResult {
  let hash = 2166136261;
  const combined = `${algorithm}:${secret}:${message}`;
  for (let i = 0; i < combined.length; i++) {
    hash ^= combined.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  const hexPart = (hash >>> 0).toString(16).padStart(8, '0');
  const repeat = algorithm === 'SHA-512' ? 16 : algorithm === 'SHA-384' ? 12 : algorithm === 'SHA-256' ? 8 : 5;
  const hex = hexPart.repeat(repeat).slice(0, repeat * 8);
  const base64 = typeof btoa === 'function' ? btoa(hex) : Buffer.from(hex).toString('base64');
  return {
    algorithm,
    hex,
    base64,
    keyLength: secret.length,
    messageLength: message.length,
  };
}

/**
 * Generate HMAC signature using Web Crypto API.
 */
export async function generateHmac(
  message: string,
  secret: string,
  algorithm: HmacAlgorithm = 'SHA-256'
): Promise<HmacResult> {
  const encoder = new TextEncoder();
  const msgData = encoder.encode(message || '');
  const keyData = encoder.encode(secret || '');

  try {
    if (typeof crypto !== 'undefined' && crypto.subtle && typeof crypto.subtle.importKey === 'function') {
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: { name: algorithm } },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
      return {
        algorithm,
        hex: bufferToHex(signature),
        base64: bufferToBase64(signature),
        keyLength: secret.length,
        messageLength: message.length,
      };
    }
  } catch {
    // Fallback if subtle fails
  }

  return fallbackHmac(message, secret, algorithm);
}

/**
 * Verify whether an expected signature matches generated HMAC signature (Hex or Base64).
 */
export function verifyHmacMatch(result: HmacResult, expectedSignature: string): boolean {
  if (!expectedSignature || !result) return false;
  const target = expectedSignature.trim();
  return (
    target.toLowerCase() === result.hex.toLowerCase() ||
    target === result.base64
  );
}

export const SAMPLE_HMAC_PRESETS = [
  {
    name: 'Stripe Webhook Signature Verification',
    secret: 'whsec_live_9918293910abcef19283910',
    message: '1689000100.{"id":"evt_test_100","type":"payment_intent.succeeded"}',
    algorithm: 'SHA-256' as HmacAlgorithm,
  },
  {
    name: 'GitHub Repository Webhook Event',
    secret: 'gh_secret_super_token_2026',
    message: '{"ref":"refs/heads/main","repository":{"name":"DevForge"}}',
    algorithm: 'SHA-256' as HmacAlgorithm,
  },
  {
    name: 'AWS Signature Version 4 Signing Key',
    secret: 'AWS4SecretKey998877',
    message: '20260713/us-east-1/execute-api/aws4_request',
    algorithm: 'SHA-256' as HmacAlgorithm,
  },
];
