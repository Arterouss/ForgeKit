// ==============================================
// DevForge — Password Strength Analyzer Utils
// ==============================================
// Comprehensive local password strength evaluation,
// entropy calculation, flaw detection, and crack time estimation.
// ==============================================

export interface PasswordComposition {
  length: number;
  uppercaseCount: number;
  lowercaseCount: number;
  numberCount: number;
  symbolCount: number;
  uniqueCharCount: number;
}

export interface PasswordFlaw {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
}

export interface PasswordStrengthAnalysis {
  password: string;
  score: number; // 0 to 100
  label: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Uncrackable';
  entropyBits: number;
  estimatedCrackTime: string;
  composition: PasswordComposition;
  flaws: PasswordFlaw[];
  suggestions: string[];
}

const COMMON_SEQUENCES = [
  '12345',
  'qwerty',
  'asdfgh',
  'password',
  'admin',
  'abcde',
  'iloveyou',
  'welcome',
];

/**
 * Estimate crack time string given total combinations at 100 billion guesses/sec.
 */
export function formatCrackTime(entropyBits: number): string {
  if (entropyBits < 20) return 'Instant (< 1 millisecond)';
  if (entropyBits < 30) return 'Less than 1 second';
  if (entropyBits < 40) return 'A few minutes';
  if (entropyBits < 50) return 'A few days';
  if (entropyBits < 60) return 'Several years';
  if (entropyBits < 75) return 'Centuries';
  return 'Millions of years (Uncrackable)';
}

/**
 * Analyze password strength, composition, flaws, and suggestions.
 */
export function analyzePasswordStrength(password: string): PasswordStrengthAnalysis {
  const input = password || '';
  const length = input.length;

  let uppercaseCount = 0;
  let lowercaseCount = 0;
  let numberCount = 0;
  let symbolCount = 0;
  const uniqueChars = new Set<string>();

  for (const char of input) {
    uniqueChars.add(char);
    if (/[A-Z]/.test(char)) uppercaseCount++;
    else if (/[a-z]/.test(char)) lowercaseCount++;
    else if (/[0-9]/.test(char)) numberCount++;
    else symbolCount++;
  }

  // Calculate effective charset size
  let charsetSize = 0;
  if (uppercaseCount > 0) charsetSize += 26;
  if (lowercaseCount > 0) charsetSize += 26;
  if (numberCount > 0) charsetSize += 10;
  if (symbolCount > 0) charsetSize += 32;

  let entropyBits = length > 0 && charsetSize > 1
    ? Math.round(length * Math.log2(charsetSize))
    : 0;

  const flaws: PasswordFlaw[] = [];
  const suggestions: string[] = [];

  // Check length
  if (length < 8) {
    flaws.push({
      id: 'short_length',
      title: 'Extremely Short Password',
      severity: 'high',
      description: 'Password is fewer than 8 characters and can be cracked instantly by modern hardware.',
    });
    suggestions.push('Increase password length to at least 14–16 characters.');
  }

  // Check composition variety
  if (charsetSize <= 10 && length > 0) {
    flaws.push({
      id: 'numeric_only',
      title: 'Numeric or Single Charset Only',
      severity: 'high',
      description: 'Password uses only digits or one character type, dramatically reducing entropy.',
    });
    suggestions.push('Mix uppercase letters, lowercase letters, numbers, and symbols.');
  }

  // Check common sequences
  const lowerInput = input.toLowerCase();
  for (const seq of COMMON_SEQUENCES) {
    if (lowerInput.includes(seq)) {
      flaws.push({
        id: 'common_pattern',
        title: `Predictable Pattern Detected ("${seq}")`,
        severity: 'high',
        description: 'Password contains a well-known dictionary sequence or keyboard walk.',
      });
      entropyBits = Math.max(10, entropyBits - 20);
      suggestions.push('Avoid common words, keyboard rows (qwerty), or sequential numbers.');
      break;
    }
  }

  // Check character repetition
  if (uniqueChars.size < length * 0.4 && length > 6) {
    flaws.push({
      id: 'low_diversity',
      title: 'High Character Repetition',
      severity: 'medium',
      description: 'Password reuses a small set of characters repeatedly.',
    });
    suggestions.push('Use a wider variety of unique characters.');
  }

  // Calculate score 0-100
  let score = Math.min(100, Math.round((entropyBits / 90) * 100));
  if (flaws.some((f) => f.severity === 'high')) {
    score = Math.min(40, score);
  }

  let label: PasswordStrengthAnalysis['label'] = 'Very Weak';
  if (score >= 85 && entropyBits >= 80) label = 'Uncrackable';
  else if (score >= 70) label = 'Strong';
  else if (score >= 50) label = 'Moderate';
  else if (score >= 30) label = 'Weak';

  if (suggestions.length === 0) {
    suggestions.push('Password exhibits strong cryptographic entropy and no obvious flaws.');
  }

  return {
    password: input,
    score,
    label,
    entropyBits,
    estimatedCrackTime: formatCrackTime(entropyBits),
    composition: {
      length,
      uppercaseCount,
      lowercaseCount,
      numberCount,
      symbolCount,
      uniqueCharCount: uniqueChars.size,
    },
    flaws,
    suggestions,
  };
}

export const SAMPLE_PASSWORDS_TO_ANALYZE = [
  {
    name: 'Weak Dictionary Password',
    password: 'password123!',
  },
  {
    name: 'Moderate Mixed Password',
    password: 'DevForge2026#',
  },
  {
    name: 'Strong High Entropy Password',
    password: 'vK9#mQ2$xP8!zL4@wN7*',
  },
  {
    name: 'Uncrackable Word Passphrase',
    password: 'glacier-horizon-titan-jasper-nebula',
  },
];
