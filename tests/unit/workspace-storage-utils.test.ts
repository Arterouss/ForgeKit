import { describe, it, expect } from 'vitest';
import {
  validateWorkspaceExport,
  buildWorkspaceExportPayload,
  createSnapshotMetadata,
  DEFAULT_WORKSPACES,
  DEFAULT_COLLECTIONS,
} from '@/lib/workspace-storage-utils';

describe('Workspace Storage & Snapshot Utilities (workspace-storage-utils.ts)', () => {
  it('should validate correct PortableWorkspaceExport JSON object', () => {
    const payload = buildWorkspaceExportPayload(
      DEFAULT_WORKSPACES,
      'ws-default',
      DEFAULT_COLLECTIONS,
      {
        favorites: ['json-formatter'],
        recentTools: ['jwt-decoder'],
        notes: '# Test',
        collections: DEFAULT_COLLECTIONS,
        snippets: [],
        historyItems: [],
      }
    );

    const validation = validateWorkspaceExport(payload);
    expect(validation.valid).toBe(true);
    expect(validation.data?.app).toBe('DevForge Developer Studio');
  });

  it('should reject invalid export JSON payload', () => {
    const badJson = { foo: 'bar' };
    const validation = validateWorkspaceExport(badJson);
    expect(validation.valid).toBe(false);
    expect(validation.error).toBeDefined();
  });

  it('should create snapshot metadata with unique ID and timestamp', () => {
    const snap = createSnapshotMetadata('Pre-Refactor Snapshot', 'ws-default', {
      favorites: [],
      recentTools: [],
      notes: '',
      collections: [],
      snippets: [],
      historyItems: [],
    });

    expect(snap.id).toContain('snap_');
    expect(snap.label).toBe('Pre-Refactor Snapshot');
    expect(snap.workspaceId).toBe('ws-default');
  });
});
