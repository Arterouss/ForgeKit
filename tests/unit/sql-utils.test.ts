import { describe, it, expect } from 'vitest';
import {
  formatSql,
  minifySql,
  validateSql,
  analyzeSql,
  SQL_PRESETS,
} from '@/lib/sql-utils';

describe('SQL Utilities (sql-utils.ts)', () => {
  it('should format SELECT query with uppercase keywords', () => {
    const raw = 'select id, name from users where status = 1';
    const res = formatSql(raw, { uppercaseKeywords: true, indentSize: 2 });
    expect(res.isValid).toBe(true);
    expect(res.output).toContain('SELECT');
    expect(res.output).toContain('FROM');
  });

  it('should minify SQL query cleanly', () => {
    const raw = 'SELECT * \n FROM users \n WHERE id = 1;';
    const res = minifySql(raw);
    expect(res.isValid).toBe(true);
    expect(res.output).toBe('SELECT * FROM users WHERE id = 1;');
  });

  it('should validate unbalanced parentheses', () => {
    const raw = 'SELECT * FROM users WHERE (id = 1';
    const res = validateSql(raw);
    expect(res.isValid).toBe(false);
    expect(res.message).toContain('Unbalanced');
  });

  it('should analyze SQL preset and detect JOINs and tables', () => {
    const selectPreset = SQL_PRESETS[0];
    const analysis = analyzeSql(selectPreset.sampleSql);
    expect(analysis.statementType).toBe('SELECT');
    expect(analysis.joinCount).toBe(2);
    expect(analysis.hasWhere).toBe(true);
    expect(analysis.hasGroupBy).toBe(true);
    expect(analysis.detectedTables).toContain('users');
  });
});
