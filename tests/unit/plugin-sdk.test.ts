import { describe, it, expect, beforeEach } from 'vitest';
import {
  validatePluginManifest,
  executeSandboxed,
  getSandboxAuditLogs,
  clearSandboxAuditLogs,
  pluginManager,
  FEATURED_MARKETPLACE_PLUGINS,
} from '@/sdk/plugin-sdk';
import { isToolRegistered } from '@/sdk/tool-registry';

describe('Phase 8: Plugin SDK & Marketplace Engine', () => {
  beforeEach(() => {
    clearSandboxAuditLogs();
    pluginManager.reset();
  });

  describe('Plugin Manifest Validator (`validatePluginManifest`)', () => {
    it('should validate and parse a well-formed plugin manifest', () => {
      const sample = {
        id: 'test-plugin-kit',
        name: 'Test Plugin Kit',
        version: '1.0.0',
        author: 'DevForge Team',
        description: 'Unit test plugin package',
        category: 'utilities',
        permissions: ['storage', 'clipboard'],
        tools: [
          {
            slug: 'test-tool-slug',
            name: 'Test Tool',
            description: 'A simple test tool',
            category: 'utilities',
          },
        ],
      };

      const res = validatePluginManifest(sample);
      expect(res.valid).toBe(true);
      expect(res.errors).toHaveLength(0);
      expect(res.manifest?.id).toBe('test-plugin-kit');
    });

    it('should reject manifest with invalid kebab-case id or non-semver version', () => {
      const invalid = {
        id: 'Invalid_ID_With_Uppercase',
        name: 'Bad ID Plugin',
        version: 'not.semver',
        author: 'Author',
        description: 'Desc',
        category: 'utilities',
        permissions: ['invalid_permission'],
        tools: [],
      };

      const res = validatePluginManifest(invalid);
      expect(res.valid).toBe(false);
      expect(res.errors.length).toBeGreaterThan(0);
      expect(res.errors.some((e) => e.includes('Invalid "id" format'))).toBe(true);
      expect(res.errors.some((e) => e.includes('Invalid "version" format'))).toBe(
        true
      );
    });
  });

  describe('Sandboxed Execution Guard (`executeSandboxed`)', () => {
    it('should allow execution when required permission is granted', () => {
      const result = executeSandboxed(
        'test-plugin',
        ['storage', 'clipboard'],
        'storage',
        'Save Profile',
        () => 'saved_ok'
      );
      expect(result).toBe('saved_ok');
      const logs = getSandboxAuditLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].granted).toBe(true);
    });

    it('should throw error and log violation when required permission is missing', () => {
      expect(() => {
        executeSandboxed(
          'test-plugin',
          ['clipboard'], // missing 'network'
          'network',
          'Fetch External API',
          () => 'fetched'
        );
      }).toThrowError(/Sandbox Security Violation/);

      const logs = getSandboxAuditLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].granted).toBe(false);
      expect(logs[0].permissionChecked).toBe('network');
    });
  });

  describe('Plugin Manager Lifecycle (`pluginManager`)', () => {
    it('should install plugin and register its tools dynamically', () => {
      const manifest = FEATURED_MARKETPLACE_PLUGINS[0];
      const installRes = pluginManager.installPlugin(manifest);

      expect(installRes.success).toBe(true);
      expect(pluginManager.getInstalledPlugins()).toHaveLength(1);
      expect(isToolRegistered('ai-prompt-studio')).toBe(true);
    });

    it('should disable plugin and unregister its tools dynamically', () => {
      const manifest = FEATURED_MARKETPLACE_PLUGINS[0];
      pluginManager.installPlugin(manifest);
      expect(isToolRegistered('ai-prompt-studio')).toBe(true);

      const disabled = pluginManager.disablePlugin(manifest.id);
      expect(disabled).toBe(true);
      expect(pluginManager.isPluginEnabled(manifest.id)).toBe(false);
      expect(isToolRegistered('ai-prompt-studio')).toBe(false);
    });
  });
});
