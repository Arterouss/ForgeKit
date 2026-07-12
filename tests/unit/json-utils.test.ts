import { describe, it, expect } from 'vitest';
import {
  formatJson,
  minifyJson,
  validateJson,
  getJsonDataType,
  SAMPLE_JSON,
} from '@/lib/json-utils';

describe('JSON Utilities (json-utils.ts)', () => {
  it('should format valid JSON with 2 spaces by default', () => {
    const raw = '{"name":"DevForge","active":true}';
    const res = formatJson(raw);
    expect(res.error).toBeNull();
    expect(res.output).toContain('  "name": "DevForge"');
  });

  it('should format JSON with 4 spaces when requested', () => {
    const raw = '{"name":"DevForge","version":1}';
    const res = formatJson(raw, 4);
    expect(res.error).toBeNull();
    expect(res.output).toContain('    "name": "DevForge"');
  });

  it('should minify valid JSON', () => {
    const raw = `{\n  "title": "Hello",\n  "count": 42\n}`;
    const res = minifyJson(raw);
    expect(res.error).toBeNull();
    expect(res.output).toBe('{"title":"Hello","count":42}');
  });

  it('should return error message when formatting invalid JSON', () => {
    const bad = '{"name": "DevForge", "missing_quote: true}';
    const res = formatJson(bad);
    expect(res.error).not.toBeNull();
    expect(res.output).toBe('');
  });

  it('should validate JSON correctly', () => {
    expect(validateJson('{"valid": true}').isValid).toBe(true);
    expect(validateJson('{invalid: true}').isValid).toBe(false);
    expect(validateJson('').isValid).toBe(false);
  });

  it('should detect JSON data types accurately', () => {
    expect(getJsonDataType(null)).toBe('null');
    expect(getJsonDataType([1, 2, 3])).toBe('array');
    expect(getJsonDataType({ a: 1 })).toBe('object');
    expect(getJsonDataType(123)).toBe('number');
    expect(getJsonDataType('hello')).toBe('string');
    expect(getJsonDataType(true)).toBe('boolean');
  });

  it('should successfully parse and format the SAMPLE_JSON', () => {
    const res = formatJson(SAMPLE_JSON);
    expect(res.error).toBeNull();
    expect(res.output).toContain('"project": "DevForge Professional"');
  });
});
