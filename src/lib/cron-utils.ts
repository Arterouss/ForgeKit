// ==============================================
// DevForge — Cron Expression Builder Utils
// ==============================================
// Interactive 5-field standard cron expression
// builder, natural language describer, next run
// simulator, and full crontab entry generator.
// ==============================================

export interface CronFields {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

export interface CronCommandConfig {
  fields: CronFields;
  user?: string;
  command: string;
}

export interface CronValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Generates the 5-field Cron expression string.
 */
export function generateCronExpression(fields: CronFields): string {
  const m = fields.minute.trim() || '*';
  const h = fields.hour.trim() || '*';
  const dom = fields.dayOfMonth.trim() || '*';
  const mon = fields.month.trim() || '*';
  const dow = fields.dayOfWeek.trim() || '*';
  return `${m} ${h} ${dom} ${mon} ${dow}`;
}

/**
 * Parses a 5-field Cron expression into CronFields.
 */
export function parseCronExpression(expression: string): CronFields | null {
  const parts = expression.trim().split(/\s+/);
  if (parts.length < 5) return null;
  return {
    minute: parts[0],
    hour: parts[1],
    dayOfMonth: parts[2],
    month: parts[3],
    dayOfWeek: parts[4],
  };
}

/**
 * Explains standard cron expressions in human-readable natural language.
 */
export function explainCronExpression(fields: CronFields): string {
  const expr = generateCronExpression(fields);

  if (expr === '* * * * *') return 'Every minute, 24 hours a day, 7 days a week';
  if (expr === '*/5 * * * *') return 'Every 5 minutes, every hour of every day';
  if (expr === '*/15 * * * *') return 'Every 15 minutes, every hour of every day';
  if (expr === '0 * * * *') return 'At minute 0 past every hour';
  if (expr === '0 0 * * *') return 'At 00:00 (midnight) every day';
  if (expr === '30 3 * * *') return 'At 03:30 AM every day';
  if (expr === '0 4 * * 0') return 'At 04:00 AM on Sunday every week';
  if (expr === '0 0 1 * *') return 'At 00:00 (midnight) on day 1 of every month';

  const m = fields.minute;
  const h = fields.hour;
  const dom = fields.dayOfMonth;
  const mon = fields.month;
  const dow = fields.dayOfWeek;

  const minPart =
    m === '*' ? 'every minute' : m.startsWith('*/') ? `every ${m.slice(2)} mins` : `at minute ${m}`;
  const hrPart =
    h === '*' ? 'of every hour' : h.startsWith('*/') ? `every ${h.slice(2)} hours` : `at hour ${h}:00`;

  let dayPart = '';
  if (dom !== '*' && dow === '*') {
    dayPart = `on day ${dom} of the month`;
  } else if (dow !== '*' && dom === '*') {
    const days: Record<string, string> = {
      '0': 'Sunday',
      '1': 'Monday',
      '2': 'Tuesday',
      '3': 'Wednesday',
      '4': 'Thursday',
      '5': 'Friday',
      '6': 'Saturday',
      '7': 'Sunday',
    };
    dayPart = `on ${days[dow] ?? `day of week ${dow}`}`;
  } else if (dom === '*' && dow === '*') {
    dayPart = 'every day';
  } else {
    dayPart = `on day ${dom} and day of week ${dow}`;
  }

  const monPart = mon === '*' ? '' : `in month ${mon}`;

  return `Runs ${minPart} ${hrPart}, ${dayPart} ${monPart}`.trim();
}

/**
 * Generates the complete system crontab entry line.
 */
export function generateCrontabEntry(config: CronCommandConfig): string {
  const expr = generateCronExpression(config.fields);
  const userStr = config.user?.trim() ? `${config.user.trim()} ` : '';
  const cmdStr = config.command.trim() || '/path/to/script.sh';
  return `${expr} ${userStr}${cmdStr}`;
}

/**
 * Validates basic field formatting.
 */
export function validateCronFields(fields: CronFields): CronValidationResult {
  const errors: string[] = [];
  const allowedCharRegex = /^[\d*,\-/A-Za-z]+$/;

  if (!allowedCharRegex.test(fields.minute)) errors.push('Invalid characters in minute field.');
  if (!allowedCharRegex.test(fields.hour)) errors.push('Invalid characters in hour field.');
  if (!allowedCharRegex.test(fields.dayOfMonth)) errors.push('Invalid characters in day of month field.');
  if (!allowedCharRegex.test(fields.month)) errors.push('Invalid characters in month field.');
  if (!allowedCharRegex.test(fields.dayOfWeek)) errors.push('Invalid characters in day of week field.');

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export const CRON_PRESETS: {
  name: string;
  expression: string;
  description: string;
}[] = [
  {
    name: 'Every Minute (* * * * *)',
    expression: '* * * * *',
    description: 'Runs every 60 seconds continuously',
  },
  {
    name: 'Every 5 Minutes (*/5 * * * *)',
    expression: '*/5 * * * *',
    description: 'Runs at 0, 5, 10, 15... minutes past the hour',
  },
  {
    name: 'Hourly at Minute 0 (0 * * * *)',
    expression: '0 * * * *',
    description: 'Runs precisely at the top of every hour',
  },
  {
    name: 'Daily at Midnight (0 0 * * *)',
    expression: '0 0 * * *',
    description: 'Runs every night at 00:00 server time',
  },
  {
    name: 'Daily Nightly Backup at 3:30 AM (30 3 * * *)',
    expression: '30 3 * * *',
    description: 'Runs every night during low-traffic off-peak hours',
  },
  {
    name: 'Weekly Sunday Maintenance at 4:00 AM (0 4 * * 0)',
    expression: '0 4 * * 0',
    description: 'Runs weekly on Sunday morning',
  },
  {
    name: 'Monthly on 1st at Midnight (0 0 1 * *)',
    expression: '0 0 1 * *',
    description: 'Runs on the first calendar day of each month',
  },
];
