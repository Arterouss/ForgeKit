// ==============================================
// DevForge — UUID & ULID Generator / Decoder
// ==============================================
// Generate RFC 4122 UUID v4, RFC 9562 UUID v7, and
// sortable ULIDs. Decode embedded timestamps.
// ==============================================

export type IdentifierType = 'uuid-v4' | 'uuid-v7' | 'ulid';

export interface GeneratedIdentifier {
  type: IdentifierType;
  value: string;
  timestamp?: number; // Epoch ms if v7 or ulid
  timestampFormatted?: string;
}

export interface IdentifierDecoderResult {
  input: string;
  valid: boolean;
  detectedType: 'UUID v4' | 'UUID v7' | 'ULID' | 'Unknown';
  timestampMs?: number;
  creationDateUtc?: string;
  version?: number;
  variant?: string;
}

const ULID_ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

/**
 * Generate standard random UUID v4 string.
 */
export function generateUuidV4(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generate RFC 9562 time-ordered UUID v7 string.
 */
export function generateUuidV7(timeMs: number = Date.now()): {
  value: string;
  timestamp: number;
} {
  const hexTime = timeMs.toString(16).padStart(12, '0');
  const randA = Math.floor(Math.random() * 0x0fff)
    .toString(16)
    .padStart(3, '0');
  const randB1 = (8 + Math.floor(Math.random() * 4)).toString(16);
  const randB2 = Math.floor(Math.random() * 0x0fff)
    .toString(16)
    .padStart(3, '0');
  const randC = Math.floor(Math.random() * 0xffffffffffff)
    .toString(16)
    .padStart(12, '0');

  const uuid = `${hexTime.slice(0, 8)}-${hexTime.slice(8, 12)}-7${randA}-${randB1}${randB2}-${randC}`;
  return { value: uuid, timestamp: timeMs };
}

/**
 * Encode number into Crockford Base32 string of specified length.
 */
function encodeUlidTime(timeMs: number, len: number): string {
  let str = '';
  let curr = timeMs;
  for (let i = len - 1; i >= 0; i--) {
    const mod = curr % 32;
    str = ULID_ENCODING[mod] + str;
    curr = Math.floor(curr / 32);
  }
  return str;
}

/**
 * Generate 26-char ULID string.
 */
export function generateUlid(timeMs: number = Date.now()): {
  value: string;
  timestamp: number;
} {
  const timePart = encodeUlidTime(timeMs, 10);
  let randomPart = '';
  for (let i = 0; i < 16; i++) {
    randomPart += ULID_ENCODING[Math.floor(Math.random() * 32)];
  }
  return { value: `${timePart}${randomPart}`, timestamp: timeMs };
}

/**
 * Batch generate identifiers of given type.
 */
export function generateIdentifiersBatch(
  type: IdentifierType,
  count: number = 10,
  uppercase: boolean = false
): GeneratedIdentifier[] {
  const list: GeneratedIdentifier[] = [];
  const safeCount = Math.max(1, Math.min(100, count));

  for (let i = 0; i < safeCount; i++) {
    if (type === 'uuid-v4') {
      const val = generateUuidV4();
      list.push({
        type,
        value: uppercase ? val.toUpperCase() : val.toLowerCase(),
      });
    } else if (type === 'uuid-v7') {
      const res = generateUuidV7();
      list.push({
        type,
        value: uppercase ? res.value.toUpperCase() : res.value.toLowerCase(),
        timestamp: res.timestamp,
        timestampFormatted: new Date(res.timestamp).toISOString(),
      });
    } else {
      const res = generateUlid();
      list.push({
        type,
        value: uppercase ? res.value : res.value.toLowerCase(),
        timestamp: res.timestamp,
        timestampFormatted: new Date(res.timestamp).toISOString(),
      });
    }
  }

  return list;
}

/**
 * Inspect and decode a UUID or ULID string to extract creation time or version.
 */
export function decodeIdentifier(input: string): IdentifierDecoderResult {
  const cleaned = input ? input.trim() : '';
  if (!cleaned) {
    return {
      input: cleaned,
      valid: false,
      detectedType: 'Unknown',
    };
  }

  // Check ULID (26 chars Crockford Base32)
  if (/^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i.test(cleaned)) {
    const upper = cleaned.toUpperCase();
    const timeChars = upper.slice(0, 10);
    let timeMs = 0;
    for (let i = 0; i < timeChars.length; i++) {
      timeMs = timeMs * 32 + ULID_ENCODING.indexOf(timeChars[i]);
    }
    return {
      input: cleaned,
      valid: true,
      detectedType: 'ULID',
      timestampMs: timeMs,
      creationDateUtc: new Date(timeMs).toISOString(),
    };
  }

  // Check UUID format (36 chars with hyphens or 32 chars without)
  const uuidClean = cleaned.replace(/-/g, '');
  if (/^[0-9a-f]{32}$/i.test(uuidClean)) {
    const versionChar = uuidClean[12];
    const version = parseInt(versionChar, 16);

    if (version === 7) {
      const timeHex = uuidClean.slice(0, 12);
      const timeMs = parseInt(timeHex, 16);
      return {
        input: cleaned,
        valid: true,
        detectedType: 'UUID v7',
        version: 7,
        timestampMs: timeMs,
        creationDateUtc: new Date(timeMs).toISOString(),
      };
    } else if (version === 4) {
      return {
        input: cleaned,
        valid: true,
        detectedType: 'UUID v4',
        version: 4,
      };
    }

    return {
      input: cleaned,
      valid: true,
      detectedType: 'Unknown',
      version,
    };
  }

  return {
    input: cleaned,
    valid: false,
    detectedType: 'Unknown',
  };
}

export const SAMPLE_IDENTIFIERS_TO_DECODE = [
  {
    name: 'Sortable UUID v7 Sample',
    id: '018f6d7a-8b1e-723a-a19c-481928301928',
  },
  {
    name: 'Sortable ULID Sample',
    id: '01HY8A8V7M3P5Q4Z1K2J3H4G5F',
  },
  {
    name: 'Standard Random UUID v4',
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  },
];
