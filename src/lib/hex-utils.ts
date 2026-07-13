// ==============================================
// DevForge — Hexadecimal Encoder / Decoder & Byte Dump
// ==============================================
// Encode/decode text to Hex with delimiters and generate
// classic 16-byte memory hex dumps with ASCII inspection.
// ==============================================

export type HexDelimiter = 'none' | 'space' | 'colon' | '0x';

/**
 * Encode UTF-8 string to Hexadecimal string with customizable delimiter.
 */
export function encodeHex(
  input: string,
  delimiter: HexDelimiter = 'none',
  uppercase = true
): string {
  if (!input) return '';
  const bytes = new TextEncoder().encode(input);
  const hexValues = Array.from(bytes).map((b) => {
    const hex = b.toString(16).padStart(2, '0');
    return uppercase ? hex.toUpperCase() : hex;
  });

  if (delimiter === 'space') return hexValues.join(' ');
  if (delimiter === 'colon') return hexValues.join(':');
  if (delimiter === '0x')
    return hexValues.map((h) => `0x${h}`).join(' ');
  return hexValues.join('');
}

/**
 * Clean Hex string (stripping spaces, colons, commas, 0x prefixes) and decode back to UTF-8 string.
 */
export function decodeHex(hexStr: string): {
  decodedText: string;
  byteCount: number;
  valid: boolean;
  error?: string;
} {
  const cleaned = hexStr
    .replace(/0x/gi, '')
    .replace(/[\s:,;\-\n\r]+/g, '');

  if (!cleaned) {
    return { decodedText: '', byteCount: 0, valid: true };
  }

  if (cleaned.length % 2 !== 0) {
    return {
      decodedText: '',
      byteCount: 0,
      valid: false,
      error: 'Hex string must have an even number of characters.',
    };
  }

  if (/[^0-9a-fA-F]/.test(cleaned)) {
    return {
      decodedText: '',
      byteCount: 0,
      valid: false,
      error: 'Hex string contains invalid non-hexadecimal characters.',
    };
  }

  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < cleaned.length; i += 2) {
    bytes[i / 2] = parseInt(cleaned.slice(i, i + 2), 16);
  }

  const decodedText = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
  return {
    decodedText,
    byteCount: bytes.length,
    valid: true,
  };
}

/**
 * Generate a classic 16-byte-per-line Hex & ASCII memory dump.
 */
export function generateHexDump(input: string): string {
  if (!input) return '';
  const bytes = new TextEncoder().encode(input);
  const lines: string[] = [];

  for (let offset = 0; offset < bytes.length; offset += 16) {
    const slice = bytes.slice(offset, offset + 16);
    const offsetHex = offset.toString(16).padStart(8, '0').toUpperCase();

    const hexParts: string[] = [];
    for (let i = 0; i < 16; i++) {
      if (i < slice.length) {
        hexParts.push(slice[i].toString(16).padStart(2, '0').toUpperCase());
      } else {
        hexParts.push('  ');
      }
    }

    const firstHalf = hexParts.slice(0, 8).join(' ');
    const secondHalf = hexParts.slice(8, 16).join(' ');
    const hexColumn = `${firstHalf}  ${secondHalf}`;

    let asciiColumn = '';
    for (let i = 0; i < slice.length; i++) {
      const b = slice[i];
      asciiColumn += b >= 32 && b <= 126 ? String.fromCharCode(b) : '.';
    }

    lines.push(`${offsetHex}  ${hexColumn}  |${asciiColumn}|`);
  }

  return lines.join('\n');
}

export const SAMPLE_HEX_INPUTS = [
  {
    name: 'DevForge Payload Sample',
    text: 'DevForge Security Studio v1.0 — Cryptographic Pack',
    hex: '446576466F7267652053656375726974792053747564696F2076312E3020E280942043727970746F67726170686963205061636B',
  },
  {
    name: 'Short API Secret Sample',
    text: 'api_secret_key_990123',
    hex: '6170695F7365637265745F6B65795F393930313233',
  },
];
