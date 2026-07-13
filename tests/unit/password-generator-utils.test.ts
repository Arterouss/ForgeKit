import { describe, it, expect } from 'vitest';
import {
  calculateEntropyBits,
  getStrengthLabel,
  generateSinglePassword,
  generatePasswordBatch,
  type PasswordGeneratorOptions,
} from '@/lib/password-generator-utils';

describe('Password Generator Utilities (password-generator-utils.ts)', () => {
  it('should calculate entropy bits correctly', () => {
    const entropy = calculateEntropyBits(16, 62);
    expect(entropy).toBeGreaterThanOrEqual(90);
  });

  it('should return correct strength label based on entropy', () => {
    expect(getStrengthLabel(30)).toBe('Very Weak');
    expect(getStrengthLabel(45)).toBe('Weak');
    expect(getStrengthLabel(60)).toBe('Moderate');
    expect(getStrengthLabel(85)).toBe('Strong');
    expect(getStrengthLabel(110)).toBe('Uncrackable');
  });

  it('should generate a random password with required length', () => {
    const opts: PasswordGeneratorOptions = {
      length: 20,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeAmbiguous: false,
      count: 1,
      mode: 'random',
      passphraseWords: 4,
      passphraseSeparator: '-',
    };
    const result = generateSinglePassword(opts);

    expect(result.password).toHaveLength(20);
    expect(result.entropyBits).toBeGreaterThan(0);
  });

  it('should generate passphrase with specified number of words and separator', () => {
    const opts: PasswordGeneratorOptions = {
      length: 16,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeAmbiguous: false,
      count: 1,
      mode: 'passphrase',
      passphraseWords: 3,
      passphraseSeparator: '.',
    };
    const result = generateSinglePassword(opts);

    expect(result.password.split('.')).toHaveLength(3);
  });

  it('should generate batch of passwords correctly', () => {
    const opts: PasswordGeneratorOptions = {
      length: 12,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: false,
      excludeAmbiguous: false,
      count: 5,
      mode: 'random',
      passphraseWords: 4,
      passphraseSeparator: '-',
    };
    const batch = generatePasswordBatch(opts);

    expect(batch).toHaveLength(5);
  });
});
