'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import type { PluginManifest } from '@/sdk/plugin-sdk/plugin-types';
import { pluginManager } from '@/sdk/plugin-sdk/plugin-manager';
import { FEATURED_MARKETPLACE_PLUGINS } from '@/sdk/plugin-sdk/mock-marketplace-plugins';

interface PluginContextValue {
  installedPlugins: PluginManifest[];
  enabledPluginIds: string[];
  marketplacePlugins: PluginManifest[];
  installPlugin: (manifest: unknown) => { success: boolean; error?: string };
  uninstallPlugin: (pluginId: string) => boolean;
  enablePlugin: (pluginId: string) => boolean;
  disablePlugin: (pluginId: string) => boolean;
  isPluginInstalled: (pluginId: string) => boolean;
  isPluginEnabled: (pluginId: string) => boolean;
}

const STORAGE_KEY_INSTALLED = 'devforge_installed_plugins';
const STORAGE_KEY_ENABLED = 'devforge_enabled_plugins';

const PluginContext = createContext<PluginContextValue | undefined>(undefined);

export function PluginProvider({ children }: { children: React.ReactNode }) {
  const [installedPlugins, setInstalledPlugins] = useState<PluginManifest[]>([]);
  const [enabledPluginIds, setEnabledPluginIds] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedInstalled = localStorage.getItem(STORAGE_KEY_INSTALLED);
        const storedEnabled = localStorage.getItem(STORAGE_KEY_ENABLED);

        if (storedInstalled) {
          const parsed: PluginManifest[] = JSON.parse(storedInstalled);
          const enabledList: string[] = storedEnabled
            ? JSON.parse(storedEnabled)
            : parsed.map((p) => p.id);

          for (const manifest of parsed) {
            pluginManager.installPlugin(manifest);
            if (!enabledList.includes(manifest.id)) {
              pluginManager.disablePlugin(manifest.id);
            }
          }
          setInstalledPlugins(pluginManager.getInstalledPlugins());
          setEnabledPluginIds(enabledList);
        } else {
          // Default: install 2 sample featured plugins so users see plugins immediately
          const defaults = FEATURED_MARKETPLACE_PLUGINS.slice(0, 2);
          for (const manifest of defaults) {
            pluginManager.installPlugin(manifest);
          }
          const initialInstalled = pluginManager.getInstalledPlugins();
          const initialEnabled = initialInstalled.map((p) => p.id);

          setInstalledPlugins(initialInstalled);
          setEnabledPluginIds(initialEnabled);
          localStorage.setItem(
            STORAGE_KEY_INSTALLED,
            JSON.stringify(initialInstalled)
          );
          localStorage.setItem(
            STORAGE_KEY_ENABLED,
            JSON.stringify(initialEnabled)
          );
        }
      } catch (err) {
        console.error('[PluginProvider] Failed to load plugins from storage:', err);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const syncStorage = useCallback(
    (installed: PluginManifest[], enabled: string[]) => {
      try {
        localStorage.setItem(STORAGE_KEY_INSTALLED, JSON.stringify(installed));
        localStorage.setItem(STORAGE_KEY_ENABLED, JSON.stringify(enabled));
      } catch (err) {
        console.error('[PluginProvider] Storage sync error:', err);
      }
    },
    []
  );

  const installPlugin = useCallback(
    (manifestRaw: unknown) => {
      const result = pluginManager.installPlugin(manifestRaw);
      if (result.success && result.manifest) {
        setInstalledPlugins((prev) => {
          const filtered = prev.filter((p) => p.id !== result.manifest!.id);
          const nextInstalled = [...filtered, result.manifest!];
          setEnabledPluginIds((prevEnabled) => {
            const nextEnabled = Array.from(
              new Set([...prevEnabled, result.manifest!.id])
            );
            syncStorage(nextInstalled, nextEnabled);
            return nextEnabled;
          });
          return nextInstalled;
        });
        return { success: true };
      }
      return { success: false, error: result.error };
    },
    [syncStorage]
  );

  const uninstallPlugin = useCallback(
    (pluginId: string) => {
      const success = pluginManager.uninstallPlugin(pluginId);
      if (success) {
        setInstalledPlugins((prev) => {
          const nextInstalled = prev.filter((p) => p.id !== pluginId);
          setEnabledPluginIds((prevEnabled) => {
            const nextEnabled = prevEnabled.filter((id) => id !== pluginId);
            syncStorage(nextInstalled, nextEnabled);
            return nextEnabled;
          });
          return nextInstalled;
        });
      }
      return success;
    },
    [syncStorage]
  );

  const enablePlugin = useCallback(
    (pluginId: string) => {
      const success = pluginManager.enablePlugin(pluginId);
      if (success) {
        setEnabledPluginIds((prev) => {
          const next = Array.from(new Set([...prev, pluginId]));
          syncStorage(installedPlugins, next);
          return next;
        });
      }
      return success;
    },
    [installedPlugins, syncStorage]
  );

  const disablePlugin = useCallback(
    (pluginId: string) => {
      const success = pluginManager.disablePlugin(pluginId);
      if (success) {
        setEnabledPluginIds((prev) => {
          const next = prev.filter((id) => id !== pluginId);
          syncStorage(installedPlugins, next);
          return next;
        });
      }
      return success;
    },
    [installedPlugins, syncStorage]
  );

  const isPluginInstalled = useCallback(
    (pluginId: string) => {
      return installedPlugins.some((p) => p.id === pluginId);
    },
    [installedPlugins]
  );

  const isPluginEnabled = useCallback(
    (pluginId: string) => {
      return enabledPluginIds.includes(pluginId);
    },
    [enabledPluginIds]
  );

  return (
    <PluginContext.Provider
      value={{
        installedPlugins,
        enabledPluginIds,
        marketplacePlugins: FEATURED_MARKETPLACE_PLUGINS,
        installPlugin,
        uninstallPlugin,
        enablePlugin,
        disablePlugin,
        isPluginInstalled,
        isPluginEnabled,
      }}
    >
      {children}
    </PluginContext.Provider>
  );
}

export function usePlugins(): PluginContextValue {
  const ctx = useContext(PluginContext);
  if (!ctx) {
    throw new Error('usePlugins must be used inside a <PluginProvider>');
  }
  return ctx;
}
