// ==============================================
// DevForge — RFC 4648 Base32 Encoder / Decoder
// ==============================================
// RFC 4648 Base32 encoding/decoding and TOTP secret
// formatting utility.
// ==============================================

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/**
 * Encode UTF-8 string into standard RFC 4648 Base32 string.
 */
export function encodeBase32(input: string, withPadding = true): string {
  if (!input) return '';
  const bytes = new TextEncoder().encode(input);
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8) | bytes[i];
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  if (withPadding) {
    while (output.length % 8 !== 0) {
      output += '=';
    }
  }

  return output;
}

/**
 * Decode RFC 4648 Base32 string into UTF-8 text string.
 */
export function decodeBase32(encoded: string): { decodedText: string; hexString: string; valid: boolean; error?: string } {
  const cleaned = encoded.replace(/\s+/g, '').replace(/=+$/, '').toUpperCase();
  if (!cleaned) {
    return { decodedText: '', hexString: '', valid: true };
  }

  const bytes: number[] = [];
  let bits = 0;
  let value = 0;

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    const idx = BASE32_ALPHABET.indexOf(char);
    if (idx === -1) {
      return {
        decodedText: '',
        hexString: '',
        valid: false,
        error: `Invalid character "${char}" found outside RFC 4648 Base32 alphabet (A-Z, 2-7).`,
      };
    }
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  const uint8 = new Uint8Array(bytes);
  let decodedText = '';
  try {
    decodedText = new TextDecoder('utf-8', { fatal: true }).decode(uint8);
  } catch {
    decodedText = '[Binary / Non-UTF8 Bytes]';
  }

  const hexString = bytes.map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');

  return {
    decodedText,
    hexString,
    valid: true,
  };
}

/**
 * Format Base32 string into groups of 4 characters for easy manual reading.
 */
export function formatBase32Chunks(base32Str: string, chunkSize = 4): string {
  const cleaned = base32Str.replace(/\s+/g, '');
  const regex = new RegExp(`.{1,${chunkSize}}`, 'g');
  const matches = cleaned.match(regex);
  return matches ? matches.join(' ') : cleaned;
}

export const SAMPLE_BASE32_INPUTS = [
  {
    name: 'DevForge Secret Token',
    text: 'DevForgeSecretToken2026!',
    base32: 'IRSWYZLPOIQHIZLNOBCXERLNEBXXE5DPMNXW4===',
  },
  {
    name: 'TOTP Secret Key (16 bytes)',
    text: 'MySecretTOTP2026',
    base32: 'JV4V6U3FMNRGK2LUFRPXGZDGMY======',
  },
];
