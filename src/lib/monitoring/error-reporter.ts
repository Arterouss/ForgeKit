/**
 * DevForge Privacy-First Error Monitoring Abstraction
 * Supports client-side exception capture, contextual logs, and pluggable telemetry hooks.
 */

export interface ErrorLogEntry {
  id: string;
  timestamp: string;
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
}

const errorLogBuffer: ErrorLogEntry[] = [];
const MAX_LOG_BUFFER = 100;

export function logError(message: string, context?: Record<string, unknown>): void {
  const entry: ErrorLogEntry = {
    id: `err-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    message,
    context,
  };

  errorLogBuffer.unshift(entry);
  if (errorLogBuffer.length > MAX_LOG_BUFFER) {
    errorLogBuffer.pop();
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[DevForge ErrorMonitor] ${message}`, context || '');
  }
}

export function captureException(error: unknown, context?: Record<string, unknown>): void {
  const message =
    error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error occurred';
  const stack = error instanceof Error ? error.stack : undefined;

  const entry: ErrorLogEntry = {
    id: `exc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    message,
    stack,
    context,
  };

  errorLogBuffer.unshift(entry);
  if (errorLogBuffer.length > MAX_LOG_BUFFER) {
    errorLogBuffer.pop();
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[DevForge Exception] ${message}`, { stack, ...context });
  }
}

export function getErrorLogs(): ErrorLogEntry[] {
  return [...errorLogBuffer];
}

export function clearErrorLogs(): void {
  errorLogBuffer.length = 0;
}
