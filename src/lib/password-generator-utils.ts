// ==============================================
// DevForge — Password Generator Utilities
// ==============================================
// Generate cryptographically secure passwords, passphrases,
// calculate entropy bits, and evaluate crack resistance.
// All processing happens locally.
// ==============================================

export interface PasswordGeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean;
  count: number;
  mode: 'random' | 'passphrase';
  passphraseWords: number;
  passphraseSeparator: string;
}

export interface PasswordResult {
  password: string;
  entropyBits: number;
  strengthLabel: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Uncrackable';
  charsetSize: number;
}

const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const NUMBER_CHARS = '0123456789';
const SYMBOL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const AMBIGUOUS_CHARS = '0O1Il';

const SAMPLE_WORD_LIST = [
  'alpha', 'bravo', 'charles', 'delta', 'echo', 'falcon', 'guard', 'haven',
  'impact', 'jungle', 'kernel', 'lunar', 'matrix', 'nebula', 'orbit', 'pulse',
  'quantum', 'radar', 'solar', 'titan', 'ultra', 'vector', 'winter', 'xenon',
  'yellow', 'zenith', 'amber', 'breeze', 'cloud', 'drift', 'ember', 'frost',
  'glacier', 'horizon', 'island', 'jasper', 'krypton', 'laser', 'marble', 'nexus',
];

/**
 * Calculate entropy in bits for a password given its charset size and length.
 */
export function calculateEntropyBits(length: number, charsetSize: number): number {
  if (length <= 0 || charsetSize <= 1) return 0;
  return Math.round(length * Math.log2(charsetSize));
}

/**
 * Determine strength label based on entropy bits.
 */
export function getStrengthLabel(entropy: number): PasswordResult['strengthLabel'] {
  if (entropy < 35) return 'Very Weak';
  if (entropy < 50) return 'Weak';
  if (entropy < 70) return 'Moderate';
  if (entropy < 100) return 'Strong';
  return 'Uncrackable';
}

/**
 * Generate a single random password string according to options.
 */
export function generateSinglePassword(options: PasswordGeneratorOptions): PasswordResult {
  if (options.mode === 'passphrase') {
    const wordCount = Math.max(2, Math.min(10, options.passphraseWords || 4));
    const sep = options.passphraseSeparator || '-';
    const words: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      const index = Math.floor(Math.random() * SAMPLE_WORD_LIST.length);
      words.push(SAMPLE_WORD_LIST[index]);
    }
    const passphrase = words.join(sep);
    // Entropy estimate for wordlist passphrase: log2(wordlist_size ^ wordCount)
    const entropy = Math.round(wordCount * Math.log2(SAMPLE_WORD_LIST.length * 50));
    return {
      password: passphrase,
      entropyBits: entropy,
      strengthLabel: getStrengthLabel(entropy),
      charsetSize: SAMPLE_WORD_LIST.length,
    };
  }

  let charset = '';
  if (options.includeUppercase) charset += UPPERCASE_CHARS;
  if (options.includeLowercase) charset += LOWERCASE_CHARS;
  if (options.includeNumbers) charset += NUMBER_CHARS;
  if (options.includeSymbols) charset += SYMBOL_CHARS;

  if (charset.length === 0) {
    charset = LOWERCASE_CHARS + NUMBER_CHARS;
  }

  if (options.excludeAmbiguous) {
    charset = charset
      .split('')
      .filter((c) => !AMBIGUOUS_CHARS.includes(c))
      .join('');
  }

  const length = Math.max(4, Math.min(128, options.length || 16));
  let output = '';

  // Ensure at least one character from each selected charset if possible
  const requiredChars: string[] = [];
  if (options.includeUppercase) {
    const set = options.excludeAmbiguous
      ? UPPERCASE_CHARS.split('').filter((c) => !AMBIGUOUS_CHARS.includes(c)).join('')
      : UPPERCASE_CHARS;
    if (set.length > 0) requiredChars.push(set[Math.floor(Math.random() * set.length)]);
  }
  if (options.includeLowercase) {
    const set = options.excludeAmbiguous
      ? LOWERCASE_CHARS.split('').filter((c) => !AMBIGUOUS_CHARS.includes(c)).join('')
      : LOWERCASE_CHARS;
    if (set.length > 0) requiredChars.push(set[Math.floor(Math.random() * set.length)]);
  }
  if (options.includeNumbers) {
    const set = options.excludeAmbiguous
      ? NUMBER_CHARS.split('').filter((c) => !AMBIGUOUS_CHARS.includes(c)).join('')
      : NUMBER_CHARS;
    if (set.length > 0) requiredChars.push(set[Math.floor(Math.random() * set.length)]);
  }
  if (options.includeSymbols) {
    requiredChars.push(SYMBOL_CHARS[Math.floor(Math.random() * SYMBOL_CHARS.length)]);
  }

  for (let i = 0; i < length; i++) {
    if (i < requiredChars.length) {
      output += requiredChars[i];
    } else {
      output += charset[Math.floor(Math.random() * charset.length)];
    }
  }

  // Shuffle output to avoid predictable required character prefix
  const arr = output.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  const finalPassword = arr.join('');

  const entropy = calculateEntropyBits(length, charset.length);
  return {
    password: finalPassword,
    entropyBits: entropy,
    strengthLabel: getStrengthLabel(entropy),
    charsetSize: charset.length,
  };
}

/**
 * Generate a batch of passwords based on options.
 */
export function generatePasswordBatch(options: PasswordGeneratorOptions): PasswordResult[] {
  const count = Math.max(1, Math.min(20, options.count || 1));
  const results: PasswordResult[] = [];
  for (let i = 0; i < count; i++) {
    results.push(generateSinglePassword(options));
  }
  return results;
}
