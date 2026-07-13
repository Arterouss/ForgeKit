// ==============================================
// DevForge — Workspace Storage & Snapshot Engine
// ==============================================
// Provides interfaces and helper utilities for multi-workspace
// management, custom tool collections, portable JSON export/import,
// and local snapshot backup/restore points.
// ==============================================

export interface WorkspaceProfile {
  id: string;
  name: string;
  description: string;
  icon: string;
  createdAt: string;
  isDefault?: boolean;
}

export interface ToolCollection {
  id: string;
  name: string;
  description: string;
  icon: string;
  toolSlugs: string[];
  createdAt: string;
}

export interface WorkspaceSnapshotData {
  favorites: string[];
  recentTools: string[];
  notes: string;
  collections: ToolCollection[];
  snippets: Array<{
    id: string;
    title: string;
    language: string;
    code: string;
    createdAt: string;
  }>;
  historyItems: Array<{
    id: string;
    timestamp: string;
    toolName: string;
    action: string;
    detail?: string;
  }>;
}

export interface WorkspaceSnapshot {
  id: string;
  label: string;
  timestamp: string;
  workspaceId: string;
  data: WorkspaceSnapshotData;
}

export interface PortableWorkspaceExport {
  app: 'DevForge Developer Studio';
  version: string;
  exportedAt: string;
  workspaces: WorkspaceProfile[];
  activeWorkspaceId: string;
  collections: ToolCollection[];
  snapshot: WorkspaceSnapshotData;
}

export const DEFAULT_WORKSPACES: WorkspaceProfile[] = [
  {
    id: 'ws-default',
    name: 'Default Workspace',
    description: 'Main production workspace for daily engineering tasks',
    icon: 'Briefcase',
    createdAt: '2026-01-01T00:00:00Z',
    isDefault: true,
  },
  {
    id: 'ws-sandbox',
    name: 'Personal Sandbox',
    description: 'Experimental testing ground for payloads, regex, and API tokens',
    icon: 'Sparkles',
    createdAt: '2026-01-01T00:00:00Z',
  },
];

export const DEFAULT_COLLECTIONS: ToolCollection[] = [
  {
    id: 'col-devops',
    name: 'Daily DevOps & Docker Kit',
    description: 'Essential containerization and Kubernetes configuration tools',
    icon: 'Container',
    toolSlugs: ['docker-compose-builder', 'dockerfile-builder', 'kubernetes-builder', 'nginx-builder'],
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'col-security',
    name: 'API Security Audit Kit',
    description: 'Cryptographic inspection and authentication auditing tools',
    icon: 'Shield',
    toolSlugs: ['jwt-inspector', 'certificate-viewer', 'hmac-generator', 'password-generator'],
    createdAt: '2026-01-01T00:00:00Z',
  },
];

/**
 * Validates whether an imported object conforms to the PortableWorkspaceExport schema.
 */
export function validateWorkspaceExport(json: unknown): {
  valid: boolean;
  data?: PortableWorkspaceExport;
  error?: string;
} {
  if (!json || typeof json !== 'object') {
    return { valid: false, error: 'Imported payload is not a valid JSON object.' };
  }

  const obj = json as Record<string, unknown>;

  if (obj.app !== 'DevForge Developer Studio') {
    return {
      valid: false,
      error: 'Invalid export identifier. Expected app="DevForge Developer Studio".',
    };
  }

  if (!obj.snapshot || typeof obj.snapshot !== 'object') {
    return {
      valid: false,
      error: 'Missing or corrupt snapshot data object in import file.',
    };
  }

  return {
    valid: true,
    data: obj as unknown as PortableWorkspaceExport,
  };
}

/**
 * Creates a serialized export payload for the current workspace state.
 */
export function buildWorkspaceExportPayload(
  workspaces: WorkspaceProfile[],
  activeWorkspaceId: string,
  collections: ToolCollection[],
  snapshot: WorkspaceSnapshotData
): PortableWorkspaceExport {
  return {
    app: 'DevForge Developer Studio',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    workspaces,
    activeWorkspaceId,
    collections,
    snapshot,
  };
}

/**
 * Formats a snapshot label with date/time.
 */
export function createSnapshotMetadata(
  label: string,
  workspaceId: string,
  data: WorkspaceSnapshotData
): WorkspaceSnapshot {
  return {
    id: `snap_${Date.now()}`,
    label: label.trim() || `Backup — ${new Date().toLocaleTimeString()}`,
    timestamp: new Date().toISOString(),
    workspaceId,
    data,
  };
}
