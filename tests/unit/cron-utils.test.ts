import { describe, it, expect } from 'vitest';
import {
  generateCronExpression,
  parseCronExpression,
  explainCronExpression,
  generateCrontabEntry,
  validateCronFields,
  CRON_PRESETS,
} from '@/lib/cron-utils';

describe('Cron Expression Builder Utilities (cron-utils.ts)', () => {
  it('should generate and parse 5-field expression correctly', () => {
    const expr = generateCronExpression({
      minute: '*/5',
      hour: '*',
      dayOfMonth: '*',
      month: '*',
      dayOfWeek: '*',
    });
    expect(expr).toBe('*/5 * * * *');

    const parsed = parseCronExpression(expr);
    expect(parsed?.minute).toBe('*/5');
  });

  it('should explain presets accurately', () => {
    const fields = parseCronExpression(CRON_PRESETS[3].expression)!;
    expect(explainCronExpression(fields)).toBe('At 00:00 (midnight) every day');
  });

  it('should generate full crontab entry line', () => {
    const entry = generateCrontabEntry({
      fields: parseCronExpression('30 3 * * *')!,
      user: 'root',
      command: '/usr/bin/backup.sh',
    });
    expect(entry).toBe('30 3 * * * root /usr/bin/backup.sh');
  });

  it('should invalidate invalid characters', () => {
    const res = validateCronFields({
      minute: 'abc$',
      hour: '*',
      dayOfMonth: '*',
      month: '*',
      dayOfWeek: '*',
    });
    expect(res.isValid).toBe(false);
  });
});
