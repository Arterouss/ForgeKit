// ==============================================
// DevForge — SQL Formatter Pro Utilities
// ==============================================
// Pure SQL beautification, minification, validation,
// query metrics analysis, and preset library.
// ==============================================

export type SqlDialect = 'postgresql' | 'mysql' | 'sqlite' | 'tsql';

export interface SqlFormatOptions {
  dialect?: SqlDialect;
  indentSize?: number;
  uppercaseKeywords?: boolean;
}

export interface SqlAnalysisResult {
  statementType: string;
  detectedTables: string[];
  joinCount: number;
  hasWhere: boolean;
  hasOrderBy: boolean;
  hasGroupBy: boolean;
  hasLimit: boolean;
}

export interface SqlPreset {
  name: string;
  sampleSql: string;
  description: string;
}

const SQL_KEYWORDS = new Set([
  'SELECT',
  'FROM',
  'WHERE',
  'AND',
  'OR',
  'INSERT',
  'INTO',
  'VALUES',
  'UPDATE',
  'SET',
  'DELETE',
  'CREATE',
  'TABLE',
  'ALTER',
  'DROP',
  'JOIN',
  'INNER',
  'LEFT',
  'RIGHT',
  'OUTER',
  'ON',
  'GROUP',
  'BY',
  'ORDER',
  'ASC',
  'DESC',
  'LIMIT',
  'OFFSET',
  'HAVING',
  'AS',
  'DISTINCT',
  'CASE',
  'WHEN',
  'THEN',
  'ELSE',
  'END',
  'UNION',
  'ALL',
  'EXISTS',
  'IN',
  'NOT',
  'NULL',
  'IS',
]);

const MAJOR_CLAUSES = new Set([
  'SELECT',
  'FROM',
  'WHERE',
  'JOIN',
  'INNER JOIN',
  'LEFT JOIN',
  'RIGHT JOIN',
  'FULL JOIN',
  'GROUP BY',
  'ORDER BY',
  'HAVING',
  'LIMIT',
  'VALUES',
  'SET',
]);

/**
 * Beautifies and formats raw SQL queries.
 */
export function formatSql(
  input: string,
  options: SqlFormatOptions = {}
): { isValid: boolean; output: string; error: string | null } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { isValid: true, output: '', error: null };
  }

  const validation = validateSql(trimmed);
  if (!validation.isValid) {
    return {
      isValid: false,
      output: trimmed,
      error: validation.message,
    };
  }

  const indent = ' '.repeat(options.indentSize ?? 2);
  const uppercase = options.uppercaseKeywords ?? true;

  // Clean whitespace & normalize keywords
  const normalized = trimmed.replace(/\s+/g, ' ');

  // Tokenize words and punctuation
  const tokens = normalized.match(/('[^']*'|"[^"]*"|\b[a-zA-Z_0-9.]+\b|[(),;*!=<>+]+)/g) || [];

  const lines: string[] = [];
  let currentLine: string[] = [];
  let indentLevel = 0;

  tokens.forEach((token) => {
    const upper = token.toUpperCase();
    const isKeyword = SQL_KEYWORDS.has(upper);
    const displayToken = isKeyword && uppercase ? upper : token;

    if (MAJOR_CLAUSES.has(upper)) {
      if (currentLine.length > 0) {
        lines.push(indent.repeat(indentLevel) + currentLine.join(' '));
        currentLine = [];
      }
      currentLine.push(displayToken);
    } else if (token === '(') {
      currentLine.push(displayToken);
      indentLevel++;
    } else if (token === ')') {
      indentLevel = Math.max(0, indentLevel - 1);
      currentLine.push(displayToken);
    } else if (token === ',') {
      currentLine.push(displayToken);
      lines.push(indent.repeat(indentLevel) + currentLine.join(' '));
      currentLine = [];
    } else {
      currentLine.push(displayToken);
    }
  });

  if (currentLine.length > 0) {
    lines.push(indent.repeat(indentLevel) + currentLine.join(' '));
  }

  return {
    isValid: true,
    output: lines.join('\n'),
    error: null,
  };
}

/**
 * Minifies SQL query onto a single line.
 */
export function minifySql(input: string): { output: string; isValid: boolean } {
  if (!input.trim()) return { output: '', isValid: true };
  return {
    output: input
      .replace(/--.*$/gm, '') // Remove inline comments
      .replace(/\s+/g, ' ')
      .trim(),
    isValid: true,
  };
}

/**
 * Validates SQL query parentheses and structure.
 */
export function validateSql(input: string): {
  isValid: boolean;
  message: string;
} {
  const trimmed = input.trim();
  if (!trimmed) {
    return { isValid: false, message: 'SQL query is empty.' };
  }

  let balance = 0;
  for (let i = 0; i < trimmed.length; i++) {
    if (trimmed[i] === '(') balance++;
    else if (trimmed[i] === ')') balance--;

    if (balance < 0) {
      return {
        isValid: false,
        message: 'Unbalanced closing parenthesis ")" detected.',
      };
    }
  }

  if (balance !== 0) {
    return {
      isValid: false,
      message: `Unbalanced opening parenthesis "(" (${balance} unclosed).`,
    };
  }

  return {
    isValid: true,
    message: 'Valid SQL statement syntax.',
  };
}

/**
 * Analyzes SQL query to extract tables, JOIN count, clauses, and statement type.
 */
export function analyzeSql(input: string): SqlAnalysisResult {
  const upper = input.toUpperCase();

  let statementType = 'UNKNOWN';
  if (upper.startsWith('SELECT')) statementType = 'SELECT';
  else if (upper.startsWith('INSERT')) statementType = 'INSERT';
  else if (upper.startsWith('UPDATE')) statementType = 'UPDATE';
  else if (upper.startsWith('DELETE')) statementType = 'DELETE';
  else if (upper.startsWith('CREATE')) statementType = 'CREATE TABLE';
  else if (upper.startsWith('ALTER')) statementType = 'ALTER TABLE';

  const joinMatches = upper.match(/\bJOIN\b/g);
  const joinCount = joinMatches ? joinMatches.length : 0;

  // Extract simple table references after FROM or JOIN or UPDATE or INTO
  const tables = new Set<string>();
  const fromMatches = input.matchAll(/\b(?:FROM|JOIN|UPDATE|INTO)\s+([a-zA-Z0-9_]+)/gi);
  for (const m of fromMatches) {
    const tbl = m[1].toLowerCase();
    if (!SQL_KEYWORDS.has(tbl.toUpperCase())) {
      tables.add(tbl);
    }
  }

  return {
    statementType,
    detectedTables: Array.from(tables),
    joinCount,
    hasWhere: /\bWHERE\b/.test(upper),
    hasOrderBy: /\bORDER\s+BY\b/.test(upper),
    hasGroupBy: /\bGROUP\s+BY\b/.test(upper),
    hasLimit: /\bLIMIT\b/.test(upper),
  };
}

export const SQL_PRESETS: SqlPreset[] = [
  {
    name: 'SELECT with JOINs',
    sampleSql: `SELECT u.id, u.username, u.email, p.title AS latest_post, COUNT(c.id) AS comment_count FROM users u LEFT JOIN posts p ON u.id = p.user_id LEFT JOIN comments c ON p.id = c.post_id WHERE u.status = 'active' GROUP BY u.id, u.username, u.email, p.title ORDER BY comment_count DESC LIMIT 25;`,
    description: 'Analytics query aggregating posts and comments per active user',
  },
  {
    name: 'INSERT INTO Statement',
    sampleSql: `INSERT INTO users (id, username, email, created_at, role) VALUES (101, 'devforge_admin', 'admin@devforge.app', '2026-07-12 10:00:00', 'SUPERADMIN'), (102, 'arterouss', 'dev@devforge.app', '2026-07-12 10:05:00', 'DEVELOPER');`,
    description: 'Bulk insert of developer user records',
  },
  {
    name: 'UPDATE Query',
    sampleSql: `UPDATE accounts SET balance = balance + 500.00, last_activity = '2026-07-12' WHERE tier = 'PREMIUM' AND status = 'ACTIVE';`,
    description: 'Conditional update of account balances',
  },
  {
    name: 'CREATE TABLE Schema',
    sampleSql: `CREATE TABLE developer_tools ( id UUID PRIMARY KEY DEFAULT gen_random_uuid(), slug VARCHAR(100) UNIQUE NOT NULL, name VARCHAR(255) NOT NULL, category VARCHAR(100) NOT NULL, usage_count BIGINT DEFAULT 0, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() );`,
    description: 'PostgreSQL table definition schema',
  },
];
