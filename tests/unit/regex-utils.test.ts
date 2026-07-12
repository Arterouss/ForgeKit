import { describe, it, expect } from 'vitest';
import { testRegex, replaceRegex, REGEX_EXAMPLES } from '@/lib/regex-utils';

describe('Regex Utilities (regex-utils.ts)', () => {
  it('should match multiple emails using global flag', () => {
    const emailPreset = REGEX_EXAMPLES[0];
    const res = testRegex(emailPreset.pattern, emailPreset.flags, emailPreset.sampleText);
    expect(res.isValid).toBe(true);
    expect(res.totalMatches).toBe(2);
    expect(res.matches[0].match).toContain('@');
  });

  it('should capture groups accurately', () => {
    const res = testRegex('(\\w+)@(\\w+)\\.(\\w+)', 'g', 'user@domain.com');
    expect(res.isValid).toBe(true);
    expect(res.matches[0].groups).toEqual(['user', 'domain', 'com']);
  });

  it('should handle invalid regex syntax without crashing', () => {
    const res = testRegex('[unclosed-bracket', 'g', 'test string');
    expect(res.isValid).toBe(false);
    expect(res.error).toBeDefined();
  });

  it('should replace matches accurately in replace mode', () => {
    const res = replaceRegex('cat', 'gi', 'The Cat sat on the mat with another cat.', 'dog');
    expect(res.isValid).toBe(true);
    expect(res.output).toBe('The dog sat on the mat with another dog.');
  });

  it('should cap infinite zero-length matches safely', () => {
    const res = testRegex('', 'g', 'abc');
    expect(res.isValid).toBe(true);
    expect(res.matches.length).toBeLessThanOrEqual(1000);
  });
});
