import { describe, it, expect } from 'vitest';
import {
  encodeBase64Text,
  decodeBase64Text,
  isLikelyBase64,
  SAMPLE_BASE64_TEXT,
} from '@/lib/base64-utils';

describe('Base64 Utilities (base64-utils.ts)', () => {
  it('should encode UTF-8 string to Base64 accurately', () => {
    const encoded = encodeBase64Text('Hello DevForge');
    expect(encoded).toBe('SGVsbG8gRGV2Rm9yZ2U=');
  });

  it('should decode Base64 string back to UTF-8 text', () => {
    const res = decodeBase64Text('SGVsbG8gRGV2Rm9yZ2U=');
    expect(res.isValid).toBe(true);
    expect(res.text).toBe('Hello DevForge');
  });

  it('should decode SAMPLE_BASE64_TEXT containing Unicode characters', () => {
    const res = decodeBase64Text(SAMPLE_BASE64_TEXT);
    expect(res.isValid).toBe(true);
    expect(res.text).toContain('DevForge');
  });

  it('should format URL-safe Base64 when urlSafe is true', () => {
    const encoded = encodeBase64Text('Subjects?a=1&b=2/test+value', true);
    expect(encoded).not.toContain('+');
    expect(encoded).not.toContain('/');
    expect(encoded).not.toContain('=');
  });

  it('should detect invalid Base64 input correctly', () => {
    const res = decodeBase64Text('!@#$not-base-64%^&*');
    expect(res.isValid).toBe(false);
    expect(res.error).toBeDefined();
  });

  it('should identify PNG image header magic signatures', () => {
    const pngSample = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    const res = decodeBase64Text(pngSample);
    expect(res.isValid).toBe(true);
    expect(res.isImage).toBe(true);
    expect(res.detectedMime).toBe('image/png');
  });

  it('should verify isLikelyBase64 logic', () => {
    expect(isLikelyBase64('SGVsbG8gRGV2Rm9yZ2U=')).toBe(true);
    expect(isLikelyBase64('ab')).toBe(false);
  });
});
