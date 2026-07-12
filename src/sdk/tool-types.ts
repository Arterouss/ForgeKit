// ==============================================
// DevForge — Tool SDK Types
// ==============================================
// Defines the interface every tool must implement.
// ==============================================

import type { ComponentType } from 'react';

/**
 * Tool categories matching the Project Bible.
 */
export type ToolCategory =
  | 'formatting'
  | 'encoding'
  | 'generators'
  | 'docker'
  | 'devops'
  | 'linux'
  | 'git'
  | 'database'
  | 'network'
  | 'api'
  | 'security'
  | 'utilities'
  | 'images'
  | 'color'
  | 'time'
  | 'text';

/**
 * Tool status for UI display.
 */
export type ToolStatus = 'stable' | 'beta' | 'experimental' | 'deprecated';

/**
 * Metadata for a registered tool.
 */
export interface ToolMetadata {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  tags: string[];
  keywords: string[];
  shortcut?: string;
  version: string;
  status: ToolStatus;
  author?: string;
}

/**
 * Full tool definition including the React component.
 */
export interface ToolDefinition extends ToolMetadata {
  component: ComponentType;
}

/**
 * Category metadata for display.
 */
export interface CategoryDefinition {
  id: ToolCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
}
