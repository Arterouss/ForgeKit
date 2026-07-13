import { describe, it, expect } from 'vitest';
import {
  generateUuidV4,
  generateUuidV7,
  generateUlid,
  generateIdentifiersBatch,
  decodeIdentifier,
  SAMPLE_IDENTIFIERS_TO_DECODE,
} from '@/lib/uuid-ulid-utils';

describe('UUID / ULID Generator & Decoder Utilities (uuid-ulid-utils.ts)', () => {
  it('should generate valid UUID v4', () => {
    const v4 = generateUuidV4();
    expect(v4).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('should generate UUID v7 and extract its creation timestamp', () => {
    const now = Date.now();
    const v7 = generateUuidV7(now);
    expect(v7.value).toContain('-7');
    const decoded = decodeIdentifier(v7.value);
    expect(decoded.valid).toBe(true);
    expect(decoded.detectedType).toBe('UUID v7');
    expect(decoded.timestampMs).toBe(now);
  });

  it('should generate ULID and decode timestamp', () => {
    const now = 1700000000000;
    const ulid = generateUlid(now);
    expect(ulid.value.length).toBe(26);
    const decoded = decodeIdentifier(ulid.value);
    expect(decoded.valid).toBe(true);
    expect(decoded.detectedType).toBe('ULID');
    expect(decoded.timestampMs).toBe(now);
  });

  it('should batch generate requested count', () => {
    const list = generateIdentifiersBatch('uuid-v7', 5, true);
    expect(list.length).toBe(5);
    expect(list[0].value).toBe(list[0].value.toUpperCase());
  });

  it('should decode sample identifiers accurately', () => {
    const decodedUlid = decodeIdentifier(SAMPLE_IDENTIFIERS_TO_DECODE[1].id);
    expect(decodedUlid.detectedType).toBe('ULID');
  });
});
