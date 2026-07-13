/**
 * DevForge Privacy-First Analytics Abstraction
 * Zero-PII client telemetry for tracking tool execution frequency and UI interactions.
 */

export interface AnalyticsEvent {
  id: string;
  eventName: string;
  timestamp: string;
  properties?: Record<string, unknown>;
}

const analyticsLogBuffer: AnalyticsEvent[] = [];
const MAX_ANALYTICS_BUFFER = 200;

export function trackEvent(eventName: string, properties?: Record<string, unknown>): void {
  const event: AnalyticsEvent = {
    id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    eventName,
    timestamp: new Date().toISOString(),
    properties,
  };

  analyticsLogBuffer.unshift(event);
  if (analyticsLogBuffer.length > MAX_ANALYTICS_BUFFER) {
    analyticsLogBuffer.pop();
  }
}

export function trackPageView(pathname: string): void {
  trackEvent('page_view', { pathname });
}

export function trackToolUsage(toolSlug: string, action = 'execute'): void {
  trackEvent('tool_usage', { toolSlug, action });
}

export function trackThemeChange(theme: string): void {
  trackEvent('theme_change', { theme });
}

export function getAnalyticsLog(): AnalyticsEvent[] {
  return [...analyticsLogBuffer];
}

export function clearAnalyticsLog(): void {
  analyticsLogBuffer.length = 0;
}
