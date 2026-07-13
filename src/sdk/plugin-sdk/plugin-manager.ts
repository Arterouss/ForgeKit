// ==============================================
// DevForge — Runtime Plugin Manager Singleton
// ==============================================

import type { PluginManifest } from './plugin-types';
import { validatePluginManifest } from './plugin-validator';
import {
  registerTool,
  unregisterTool,
  isToolRegistered,
} from '@/sdk/tool-registry';

const PluginDummyComponent = () => null;

class PluginManager {
  private installedPlugins = new Map<string, PluginManifest>();
  private enabledPluginIds = new Set<string>();

  /**
   * Install and register a plugin manifest.
   */
  public installPlugin(manifestRaw: unknown): {
    success: boolean;
    error?: string;
    manifest?: PluginManifest;
  } {
    const validation = validatePluginManifest(manifestRaw);
    if (!validation.valid || !validation.manifest) {
      return {
        success: false,
        error: validation.errors.join(' '),
      };
    }

    const manifest = validation.manifest;

    // Check if ID conflicts with an already installed plugin
    this.installedPlugins.set(manifest.id, manifest);
    this.enabledPluginIds.add(manifest.id);

    // Register plugin tools into the global ToolRegistry
    for (const toolMeta of manifest.tools) {
      if (!isToolRegistered(toolMeta.slug)) {
        registerTool({
          slug: toolMeta.slug,
          name: toolMeta.name,
          description: toolMeta.description,
          category: toolMeta.category,
          status: 'stable',
          version: manifest.version,
          icon: manifest.iconName || 'Package',
          tags: ['plugin', manifest.id, toolMeta.category],
          keywords: toolMeta.keywords || [manifest.id, 'plugin'],
          component: PluginDummyComponent,
        });
      }
    }

    return {
      success: true,
      manifest,
    };
  }

  /**
   * Enable a previously installed plugin.
   */
  public enablePlugin(pluginId: string): boolean {
    const manifest = this.installedPlugins.get(pluginId);
    if (!manifest) return false;

    this.enabledPluginIds.add(pluginId);

    for (const toolMeta of manifest.tools) {
      if (!isToolRegistered(toolMeta.slug)) {
        registerTool({
          slug: toolMeta.slug,
          name: toolMeta.name,
          description: toolMeta.description,
          category: toolMeta.category,
          status: 'stable',
          version: manifest.version,
          icon: manifest.iconName || 'Package',
          tags: ['plugin', manifest.id, toolMeta.category],
          keywords: toolMeta.keywords || [manifest.id, 'plugin'],
          component: PluginDummyComponent,
        });
      }
    }

    return true;
  }

  /**
   * Disable an installed plugin (unregisters its tools from the active registry).
   */
  public disablePlugin(pluginId: string): boolean {
    const manifest = this.installedPlugins.get(pluginId);
    if (!manifest) return false;

    this.enabledPluginIds.delete(pluginId);

    for (const toolMeta of manifest.tools) {
      unregisterTool(toolMeta.slug);
    }

    return true;
  }

  /**
   * Completely uninstall a plugin.
   */
  public uninstallPlugin(pluginId: string): boolean {
    const manifest = this.installedPlugins.get(pluginId);
    if (!manifest) return false;

    this.disablePlugin(pluginId);
    this.installedPlugins.delete(pluginId);
    return true;
  }

  /**
   * Get all currently installed plugin manifests.
   */
  public getInstalledPlugins(): PluginManifest[] {
    return Array.from(this.installedPlugins.values());
  }

  /**
   * Check if a specific plugin ID is enabled.
   */
  public isPluginEnabled(pluginId: string): boolean {
    return this.enabledPluginIds.has(pluginId);
  }

  /**
   * Clear all installed plugins (used during testing).
   */
  public reset(): void {
    for (const id of Array.from(this.installedPlugins.keys())) {
      this.uninstallPlugin(id);
    }
    this.installedPlugins.clear();
    this.enabledPluginIds.clear();
  }
}

export const pluginManager = new PluginManager();
