// ==============================================
// DevForge — Logger
// ==============================================
// Centralized logging utility.
// ==============================================

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: unknown;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const CURRENT_LEVEL: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) ??
  (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[CURRENT_LEVEL];
}

function formatEntry(entry: LogEntry): string {
  const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
  const ctx = entry.context ? ` [${entry.context}]` : '';
  return `${prefix}${ctx} ${entry.message}`;
}

function log(level: LogLevel, message: string, context?: string, data?: unknown): void {
  if (!shouldLog(level)) return;

  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
    data,
  };

  const formatted = formatEntry(entry);

  switch (level) {
    case 'debug':
      console.debug(formatted, data ?? '');
      break;
    case 'info':
      console.info(formatted, data ?? '');
      break;
    case 'warn':
      console.warn(formatted, data ?? '');
      break;
    case 'error':
      console.error(formatted, data ?? '');
      break;
  }
}

export const logger = {
  debug: (message: string, context?: string, data?: unknown) =>
    log('debug', message, context, data),
  info: (message: string, context?: string, data?: unknown) =>
    log('info', message, context, data),
  warn: (message: string, context?: string, data?: unknown) =>
    log('warn', message, context, data),
  error: (message: string, context?: string, data?: unknown) =>
    log('error', message, context, data),
};
