// ==============================================
// DevForge — Plugin SDK & Extension Types
// ==============================================

import type { ToolCategory } from '@/sdk/tool-types';

/**
 * Permissions required by a plugin to access browser or system capabilities.
 */
export type PluginPermission =
  | 'storage'       // LocalStorage / IndexedDB read & write
  | 'clipboard'     // Read/write clipboard
  | 'network'       // HTTP requests / API calls
  | 'notifications'; // System / UI notifications

/**
 * Tool metadata contributed by a plugin.
 */
export interface PluginToolMetadata {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  keywords?: string[];
}

/**
 * Strict schema for a DevForge Plugin Manifest (`plugin.json`).
 */
export interface PluginManifest {
  id: string;             // Unique kebab-case plugin ID (e.g. 'ai-prompt-studio')
  name: string;           // Human-readable plugin title
  version: string;        // Semver string (e.g. '1.0.0')
  author: string;         // Author or organization name
  description: string;    // Short summary of plugin functionality
  category: ToolCategory; // Primary category placement
  permissions: PluginPermission[]; // Declared capabilities required by this plugin
  tools: PluginToolMetadata[];     // List of tools contributed by this plugin
  homepage?: string;      // Optional repository or documentation URL
  iconName?: string;      // Optional Lucide icon name
}

/**
 * Audit log entry for sandboxed plugin executions.
 */
export interface SandboxAuditLog {
  id: string;
  pluginId: string;
  action: string;
  timestamp: string;
  permissionChecked?: PluginPermission;
  granted: boolean;
  message: string;
}

/**
 * Validation result when checking a plugin manifest.
 */
export interface PluginManifestValidationResult {
  valid: boolean;
  errors: string[];
  manifest?: PluginManifest;
}
