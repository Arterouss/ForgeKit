// ==============================================
// DevForge — Regex Studio Utilities
// ==============================================
// Pure regex testing, group capture, replacement,
// pattern validation, and preset example library.
// ==============================================

export interface RegexMatchItem {
  index: number;
  match: string;
  start: number;
  end: number;
  groups: string[];
  namedGroups?: Record<string, string>;
}

export interface RegexTestResult {
  isValid: boolean;
  error: string | null;
  matches: RegexMatchItem[];
  totalMatches: number;
}

/**
 * Common preset patterns for DevForge Regex Studio.
 */
export interface RegexPreset {
  name: string;
  pattern: string;
  flags: string;
  sampleText: string;
  description: string;
}

export const REGEX_EXAMPLES: RegexPreset[] = [
  {
    name: 'Email Address',
    pattern: '([a-zA-Z0-9._-]+)@([a-zA-Z0-9._-]+)\\.([a-zA-Z0-9_-]+)',
    flags: 'gi',
    sampleText: 'Contact us at support@devforge.app or alex.mercer@company.io for inquiries.',
    description: 'Matches standard email addresses capturing user, domain, and TLD.',
  },
  {
    name: 'URL / Web Link',
    pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
    flags: 'gi',
    sampleText: 'Check out https://devforge.app and http://localhost:3000/dashboard/tools.',
    description: 'Matches HTTP and HTTPS URLs including path and query string.',
  },
  {
    name: 'IPv4 Address',
    pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
    flags: 'g',
    sampleText: 'Servers at 192.168.1.1, 10.0.0.42, and 255.255.255.0.',
    description: 'Matches valid IPv4 addresses from 0.0.0.0 to 255.255.255.255.',
  },
  {
    name: 'UUID v4',
    pattern: '\\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\\b',
    flags: 'g',
    sampleText: 'ID: 550e8400-e29b-41d4-a716-446655440000 and 123e4567-e89b-12d3-a456-426614174000.',
    description: 'Matches RFC 4122 UUID v4 strings.',
  },
  {
    name: 'Hex Color Code',
    pattern: '#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})\\b',
    flags: 'gi',
    sampleText: 'Primary color #00E5FF, dark bg #0D1117, border #30363d.',
    description: 'Matches 3 or 6 digit hex color codes.',
  },
];

/**
 * Tests a regex pattern against a text string and returns all matches with captured groups.
 */
export function testRegex(pattern: string, flags: string, testString: string): RegexTestResult {
  if (!pattern) {
    return {
      isValid: true,
      error: null,
      matches: [],
      totalMatches: 0,
    };
  }

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flags);
  } catch (err) {
    return {
      isValid: false,
      error: err instanceof Error ? err.message : 'Invalid regular expression syntax',
      matches: [],
      totalMatches: 0,
    };
  }

  const matches: RegexMatchItem[] = [];
  const isGlobal = flags.includes('g');

  if (!isGlobal) {
    const match = regex.exec(testString);
    if (match) {
      matches.push({
        index: 0,
        match: match[0],
        start: match.index,
        end: match.index + match[0].length,
        groups: match.slice(1),
        namedGroups: match.groups ? { ...match.groups } : undefined,
      });
    }
  } else {
    let match: RegExpExecArray | null;
    let count = 0;
    // Cap at 1000 iterations to prevent infinite loop on zero-length matches
    while ((match = regex.exec(testString)) !== null && count < 1000) {
      matches.push({
        index: count,
        match: match[0],
        start: match.index,
        end: match.index + match[0].length,
        groups: match.slice(1),
        namedGroups: match.groups ? { ...match.groups } : undefined,
      });
      count++;
      if (match[0].length === 0) {
        regex.lastIndex++;
      }
    }
  }

  return {
    isValid: true,
    error: null,
    matches,
    totalMatches: matches.length,
  };
}

/**
 * Performs a regex replacement on target string safely.
 */
export function replaceRegex(
  pattern: string,
  flags: string,
  testString: string,
  replacement: string
): { isValid: boolean; output: string; error: string | null } {
  if (!pattern) {
    return { isValid: true, output: testString, error: null };
  }

  try {
    const regex = new RegExp(pattern, flags);
    const output = testString.replace(regex, replacement);
    return { isValid: true, output, error: null };
  } catch (err) {
    return {
      isValid: false,
      output: '',
      error: err instanceof Error ? err.message : 'Invalid regular expression syntax',
    };
  }
}
