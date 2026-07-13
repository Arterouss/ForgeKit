// ==============================================
// DevForge — Plugin Sandbox & Execution Guard
// ==============================================

import type { PluginPermission, SandboxAuditLog } from './plugin-types';

let auditLogs: SandboxAuditLog[] = [];

/**
 * Execute a plugin action inside a secure permission-checked sandbox wrapper.
 * Throws an error if the plugin attempts to access a capability without declaring the required permission.
 */
export function executeSandboxed<T>(
  pluginId: string,
  grantedPermissions: PluginPermission[],
  requiredPermission: PluginPermission | undefined,
  actionName: string,
  fn: () => T
): T {
  const timestamp = new Date().toISOString();
  const logId = `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  if (requiredPermission && !grantedPermissions.includes(requiredPermission)) {
    const errorMsg = `[Sandbox Security Violation] Plugin "${pluginId}" attempted action "${actionName}" requiring "${requiredPermission}" permission, but permission was not granted.`;
    auditLogs.unshift({
      id: logId,
      pluginId,
      action: actionName,
      timestamp,
      permissionChecked: requiredPermission,
      granted: false,
      message: errorMsg,
    });
    throw new Error(errorMsg);
  }

  auditLogs.unshift({
    id: logId,
    pluginId,
    action: actionName,
    timestamp,
    permissionChecked: requiredPermission,
    granted: true,
    message: `Granted execution of action "${actionName}" for plugin "${pluginId}".`,
  });

  // Keep max 100 recent audit logs in memory
  if (auditLogs.length > 100) {
    auditLogs = auditLogs.slice(0, 100);
  }

  try {
    return fn();
  } catch (err) {
    throw new Error(
      `[Plugin Runtime Error] Plugin "${pluginId}" threw error during "${actionName}": ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}

/**
 * Retrieve recent sandbox audit logs.
 */
export function getSandboxAuditLogs(): SandboxAuditLog[] {
  return [...auditLogs];
}

/**
 * Clear all sandbox audit logs.
 */
export function clearSandboxAuditLogs(): void {
  auditLogs = [];
}
