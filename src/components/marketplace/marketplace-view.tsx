'use client';

import { useState } from 'react';
import {
  Package,
  Search,
  Download,
  Trash2,
  CheckCircle2,
  Code2,
  ExternalLink,
  ShieldCheck,
  Power,
  Upload,
  Terminal,
} from 'lucide-react';
import { usePlugins } from '@/components/plugins';
import { Badge } from '@/components/ui/badge';
import { getSandboxAuditLogs, clearSandboxAuditLogs } from '@/sdk/plugin-sdk/plugin-sandbox';
import { useRouter } from 'next/navigation';

export function MarketplaceView() {
  const router = useRouter();
  const {
    installedPlugins,
    marketplacePlugins,
    installPlugin,
    uninstallPlugin,
    enablePlugin,
    disablePlugin,
    isPluginInstalled,
    isPluginEnabled,
  } = usePlugins();

  const [activeTab, setActiveTab] = useState<'explore' | 'installed' | 'custom' | 'logs'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [customManifestJson, setCustomManifestJson] = useState('');
  const [installStatus, setInstallStatus] = useState<{ success?: boolean; message?: string }>({});
  const [auditLogs, setAuditLogs] = useState(getSandboxAuditLogs());

  const filteredExplore = marketplacePlugins.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCustomInstall = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(customManifestJson);
      const res = installPlugin(parsed);
      if (res.success) {
        setInstallStatus({
          success: true,
          message: 'Plugin manifest validated and installed successfully!',
        });
        setCustomManifestJson('');
      } else {
        setInstallStatus({
          success: false,
          message: res.error || 'Failed to install plugin manifest.',
        });
      }
    } catch {
      setInstallStatus({
        success: false,
        message: 'Invalid JSON format. Please paste a valid JSON object.',
      });
    }
  };

  const handleRefreshLogs = () => {
    setAuditLogs(getSandboxAuditLogs());
  };

  const handleClearLogs = () => {
    clearSandboxAuditLogs();
    setAuditLogs([]);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Package className="h-7 w-7 text-primary" />
            DevForge Plugin Marketplace & Extension Hub
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Discover community extensions, manage installed plugins, and inspect sandboxed capability permissions.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('explore')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeTab === 'explore'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border'
            }`}
          >
            Explore Marketplace ({marketplacePlugins.length})
          </button>
          <button
            onClick={() => setActiveTab('installed')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeTab === 'installed'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border'
            }`}
          >
            Installed Plugins ({installedPlugins.length})
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeTab === 'custom'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border'
            }`}
          >
            Install Custom Manifest
          </button>
          <button
            onClick={() => {
              setActiveTab('logs');
              handleRefreshLogs();
            }}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeTab === 'logs'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border'
            }`}
          >
            Sandbox Audit Logs
          </button>
        </div>
      </div>

      {/* Tab 1: Explore Featured Marketplace */}
      {activeTab === 'explore' && (
        <div className="space-y-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search plugins by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExplore.map((plugin) => {
              const installed = isPluginInstalled(plugin.id);
              return (
                <div
                  key={plugin.id}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-card/40 p-6 transition hover:border-primary/50"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-foreground">
                          {plugin.name}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          by {plugin.author} • v{plugin.version}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-[10px] uppercase">
                        {plugin.category}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {plugin.description}
                    </p>

                    {/* Permissions list */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        Permissions:
                      </span>
                      {plugin.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>

                    {/* Contributed Tools */}
                    <div className="rounded-xl border border-border/50 bg-background/50 p-3 space-y-1">
                      <span className="text-[10px] font-semibold text-primary block uppercase tracking-wider">
                        Contributes Tool:
                      </span>
                      {plugin.tools.map((tool) => (
                        <div
                          key={tool.slug}
                          className="flex items-center justify-between text-xs text-foreground"
                        >
                          <span className="font-medium">{tool.name}</span>
                          {installed && (
                            <button
                              onClick={() => router.push(`/dashboard/tools/${tool.slug}`)}
                              className="text-[10px] text-primary hover:underline"
                            >
                              Open Tool →
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    {plugin.homepage && (
                      <a
                        href={plugin.homepage}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition"
                      >
                        <span>Docs</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}

                    <div>
                      {installed ? (
                        <button
                          onClick={() => uninstallPlugin(plugin.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Uninstall
                        </button>
                      ) : (
                        <button
                          onClick={() => installPlugin(plugin)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Install Plugin
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Installed Plugins Manager */}
      {activeTab === 'installed' && (
        <div className="space-y-6">
          {installedPlugins.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-16 text-center space-y-3">
              <Package className="h-8 w-8 text-muted-foreground mx-auto" />
              <h3 className="font-semibold text-foreground">No Plugins Installed</h3>
              <p className="text-sm text-muted-foreground">
                Visit the Explore Marketplace tab to install community plugins.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {installedPlugins.map((plugin) => {
                const enabled = isPluginEnabled(plugin.id);
                return (
                  <div
                    key={plugin.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-border bg-card/40 p-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-bold text-foreground">
                          {plugin.name}
                        </h3>
                        <Badge variant={enabled ? 'default' : 'outline'} className="text-xs">
                          {enabled ? 'Active / Enabled' : 'Disabled'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          v{plugin.version}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground max-w-2xl">
                        {plugin.description}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                        <span>
                          Permissions granted: {plugin.permissions.join(', ') || 'None'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() =>
                          enabled
                            ? disablePlugin(plugin.id)
                            : enablePlugin(plugin.id)
                        }
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                          enabled
                            ? 'border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        }`}
                      >
                        <Power className="h-3.5 w-3.5" />
                        {enabled ? 'Disable Plugin' : 'Enable Plugin'}
                      </button>

                      <button
                        onClick={() => uninstallPlugin(plugin.id)}
                        className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2 text-rose-400 hover:bg-rose-500/20 transition"
                        title="Uninstall plugin"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Local Manifest Installer */}
      {activeTab === 'custom' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form
            onSubmit={handleCustomInstall}
            className="rounded-2xl border border-border bg-card/40 p-6 space-y-4"
          >
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Install Custom DevForge Plugin JSON
            </h3>
            <p className="text-xs text-muted-foreground">
              Paste a valid `plugin.json` manifest below to validate and install your local plugin development package.
            </p>

            {installStatus.message && (
              <div
                className={`rounded-xl p-3 text-xs font-medium border ${
                  installStatus.success
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                }`}
              >
                {installStatus.message}
              </div>
            )}

            <textarea
              rows={16}
              value={customManifestJson}
              onChange={(e) => setCustomManifestJson(e.target.value)}
              placeholder={`{\n  "id": "my-custom-kit",\n  "name": "My Custom DevForge Extension",\n  "version": "1.0.0",\n  "author": "My Org",\n  "description": "Custom utility kit",\n  "category": "utilities",\n  "permissions": ["storage"],\n  "tools": [\n    {\n      "slug": "my-custom-kit",\n      "name": "My Custom Tool",\n      "description": "Utility tool description",\n      "category": "utilities"\n    }\n  ]\n}`}
              className="w-full font-mono text-xs rounded-xl border border-border bg-background p-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition w-full justify-center"
            >
              <CheckCircle2 className="h-4 w-4" />
              Validate & Install Manifest
            </button>
          </form>

          {/* Schema Instructions */}
          <div className="rounded-2xl border border-border bg-card/40 p-6 space-y-4">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              Manifest Schema Specification
            </h3>
            <p className="text-xs text-muted-foreground">
              Every DevForge plugin must pass strict validation before sandboxed registration:
            </p>
            <ul className="space-y-2.5 text-xs text-foreground">
              <li>
                <strong className="text-primary">id:</strong> Must be lowercase kebab-case (`^[a-z0-9]+(?:-[a-z0-9]+)*$`).
              </li>
              <li>
                <strong className="text-primary">version:</strong> Standard semantic versioning (`X.Y.Z`).
              </li>
              <li>
                <strong className="text-primary">permissions:</strong> Array containing any of: `storage`, `clipboard`, `network`, `notifications`.
              </li>
              <li>
                <strong className="text-primary">tools:</strong> Non-empty array of tools registered in the DevForge Tool Registry.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 4: Sandbox Audit Logs */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              Sandboxed Execution Audit Logs ({auditLogs.length})
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefreshLogs}
                className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition"
              >
                Refresh Logs
              </button>
              {auditLogs.length > 0 && (
                <button
                  onClick={handleClearLogs}
                  className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition"
                >
                  Clear Logs
                </button>
              )}
            </div>
          </div>

          {auditLogs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-16 text-center space-y-3">
              <Terminal className="h-8 w-8 text-muted-foreground mx-auto" />
              <h4 className="font-semibold text-foreground">No Security Logs Recorded Yet</h4>
              <p className="text-sm text-muted-foreground">
                Sandboxed plugin operations and permission verifications will be recorded here in real time.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-card/40 p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">
                        {log.pluginId}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        Action: {log.action}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{log.message}</p>
                  </div>

                  <div>
                    <Badge
                      variant={log.granted ? 'default' : 'destructive'}
                      className="text-xs shrink-0"
                    >
                      {log.granted ? 'GRANTED' : 'BLOCKED'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
