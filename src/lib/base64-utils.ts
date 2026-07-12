// ==============================================
// DevForge — Base64 Studio Utilities
// ==============================================
// Pure encoding, decoding, detection, and URL-safe
// transformations for strings and binary inputs.
// ==============================================

export interface Base64DecodeResult {
  isValid: boolean;
  text: string | null;
  error: string | null;
  detectedMime: string | null;
  isImage: boolean;
  dataUrl: string | null;
  sizeBytes: number;
}

/**
 * Encodes plain text string to Base64 (supports UTF-8 characters properly).
 */
export function encodeBase64Text(input: string, urlSafe = false): string {
  if (!input) return '';
  let encoded: string;

  try {
    if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
      encoded = window.btoa(
        encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1: string) =>
          String.fromCharCode(parseInt(p1, 16))
        )
      );
    } else {
      encoded = Buffer.from(input, 'utf-8').toString('base64');
    }
  } catch {
    encoded = '';
  }

  if (urlSafe && encoded) {
    return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  return encoded;
}

/**
 * Decodes a Base64 string back to UTF-8 string, detecting image headers / MIME.
 */
export function decodeBase64Text(input: string): Base64DecodeResult {
  let cleaned = input.trim();

  // Strip data URL header if present (e.g. data:image/png;base64,...)
  let detectedMime: string | null = null;
  const dataUrlMatch = /^data:([a-zA-Z0-9/+-]+);base64,(.+)$/.exec(cleaned);
  if (dataUrlMatch) {
    detectedMime = dataUrlMatch[1];
    cleaned = dataUrlMatch[2];
  }

  // Restore URL-safe characters
  cleaned = cleaned.replace(/-/g, '+').replace(/_/g, '/');
  while (cleaned.length % 4 !== 0) {
    cleaned += '=';
  }

  // Basic Base64 regex check
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned)) {
    return {
      isValid: false,
      text: null,
      error: 'Input string contains non-Base64 characters',
      detectedMime: null,
      isImage: false,
      dataUrl: null,
      sizeBytes: 0,
    };
  }

  // Detect magic signatures early
  if (!detectedMime) {
    if (cleaned.startsWith('iVBORw0KGgo')) {
      detectedMime = 'image/png';
    } else if (cleaned.startsWith('/9j/')) {
      detectedMime = 'image/jpeg';
    } else if (cleaned.startsWith('R0lGOD')) {
      detectedMime = 'image/gif';
    } else if (cleaned.startsWith('JVBERi0')) {
      detectedMime = 'application/pdf';
    }
  }

  let decodedText: string;
  try {
    if (typeof window !== 'undefined' && typeof window.atob === 'function') {
      const raw = window.atob(cleaned);
      try {
        decodedText = decodeURIComponent(
          Array.prototype.map
            .call(raw, (c: string) => {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
        );
      } catch {
        // Binary fallback
        decodedText = raw;
      }
    } else {
      decodedText = Buffer.from(cleaned, 'base64').toString('utf-8');
    }
  } catch {
    return {
      isValid: false,
      text: null,
      error: 'Failed to decode Base64 string (invalid padding or corrupted sequence)',
      detectedMime: null,
      isImage: false,
      dataUrl: null,
      sizeBytes: 0,
    };
  }

  if (!detectedMime) {
    if (decodedText.trim().startsWith('{') || decodedText.trim().startsWith('[')) {
      detectedMime = 'application/json';
    } else {
      detectedMime = 'text/plain';
    }
  }

  const isImage = Boolean(detectedMime && detectedMime.startsWith('image/'));
  const dataUrl = isImage ? `data:${detectedMime};base64,${cleaned}` : null;

  return {
    isValid: true,
    text: decodedText,
    error: null,
    detectedMime,
    isImage,
    dataUrl,
    sizeBytes: Math.floor((cleaned.length * 3) / 4),
  };
}

/**
 * Checks if string is likely valid Base64
 */
export function isLikelyBase64(input: string): boolean {
  const trimmed = input.trim();
  if (trimmed.length < 4 || trimmed.length % 4 !== 0) return false;
  return /^[A-Za-z0-9+/]+={0,2}$/.test(trimmed);
}

export const SAMPLE_BASE64_TEXT =
  'RGV2Rm9yZ2Ug4oCUIFRoZSBVbHRpbWF0ZSBEZXZlbG9wZXIgVG9vbGJveA==';
