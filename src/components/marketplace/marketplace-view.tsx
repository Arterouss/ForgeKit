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
          message: '// MANIFEST_OK: Plugin package validated and mounted into WASM sandbox!',
        });
        setCustomManifestJson('');
      } else {
        setInstallStatus({
          success: false,
          message: res.error || '// ERR_MOUNT_FAILED: Manifest schema rejected.',
        });
      }
    } catch {
      setInstallStatus({
        success: false,
        message: '// ERR_SYNTAX: Invalid JSON format. Please verify syntax integrity.',
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
    <div className="space-y-8 pb-16 font-mono select-none">
      {/* Header Banner */}
      <div className="border-b-2 border-cyan-500/30 pb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-wider text-white flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Package className="h-5 w-5" />
            </div>
            <span>PLUGIN_REGISTRY // EXTENSION HUB</span>
          </h1>
          <p className="text-xs text-cyan-200/70 mt-1 font-sans">
            Discover verified bare-metal extensions, manage installed sandboxes, and inspect real-time capability audit logs.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 bg-[#0c091f] p-1.5 rounded-2xl border-2 border-cyan-500/30">
          <button
            onClick={() => setActiveTab('explore')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'explore'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-sm'
                : 'text-cyan-400/60 hover:text-white'
            }`}
          >
            EXPLORE ({marketplacePlugins.length})
          </button>
          <button
            onClick={() => setActiveTab('installed')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'installed'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-sm'
                : 'text-cyan-400/60 hover:text-white'
            }`}
          >
            INSTALLED ({installedPlugins.length})
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'custom'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-sm'
                : 'text-cyan-400/60 hover:text-white'
            }`}
          >
            LOAD_MANIFEST
          </button>
          <button
            onClick={() => {
              setActiveTab('logs');
              handleRefreshLogs();
            }}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'logs'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-sm'
                : 'text-cyan-400/60 hover:text-white'
            }`}
          >
            AUDIT_LOGS ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Explore Featured Marketplace */}
      {activeTab === 'explore' && (
        <div className="space-y-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-400" />
            <input
              type="text"
              placeholder="> search_plugins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border-2 border-cyan-500/40 bg-[#070512] pl-10 pr-4 py-2.5 text-xs text-cyan-100 placeholder:text-cyan-400/50 focus:border-cyan-300 focus:outline-none font-mono shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExplore.map((plugin) => {
              const installed = isPluginInstalled(plugin.id);
              return (
                <div
                  key={plugin.id}
                  className="flex flex-col justify-between rounded-3xl border-2 border-cyan-500/30 bg-[#0c091f]/90 p-6 transition-all hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3 border-b border-cyan-500/20 pb-3">
                      <div>
                        <h3 className="text-base font-heading font-black text-white uppercase tracking-wide">
                          {plugin.name}
                        </h3>
                        <span className="text-[10px] text-cyan-400/70 font-sans block mt-0.5">
                          // by {plugin.author} • v{plugin.version}
                        </span>
                      </div>
                      <span className="rounded bg-cyan-500/15 border border-cyan-400/40 px-2 py-0.5 text-[9px] font-bold text-cyan-300 uppercase">
                        {plugin.category}
                      </span>
                    </div>

                    <p className="text-xs text-cyan-200/80 leading-relaxed font-sans">
                      {plugin.description}
                    </p>

                    {/* Permissions list */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-bold text-fuchsia-400 uppercase">
                        // CAPABILITIES:
                      </span>
                      {plugin.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="rounded bg-[#070512] border border-cyan-500/30 px-2 py-0.5 text-[10px] font-bold text-cyan-300 uppercase"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>

                    {/* Contributed Tools */}
                    <div className="rounded-2xl border border-cyan-500/30 bg-[#070512] p-3.5 space-y-1.5">
                      <span className="text-[10px] font-bold text-lime-400 block uppercase tracking-wider">
                        // CONTRIBUTED WASM MODULES:
                      </span>
                      {plugin.tools.map((tool) => (
                        <div
                          key={tool.slug}
                          className="flex items-center justify-between text-xs text-white"
                        >
                          <span className="font-bold uppercase text-[11px]">{tool.name}</span>
                          {installed && (
                            <button
                              onClick={() => router.push(`/dashboard/tools/${tool.slug}`)}
                              className="text-[10px] text-lime-400 hover:underline font-bold"
                            >
                              LAUNCH →
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-cyan-500/20 pt-4">
                    {plugin.homepage && (
                      <a
                        href={plugin.homepage}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-white transition"
                      >
                        <span>DOCS</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}

                    <div>
                      {installed ? (
                        <button
                          onClick={() => uninstallPlugin(plugin.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-rose-400 bg-rose-500/15 px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/25 transition shadow-sm"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          UNINSTALL
                        </button>
                      ) : (
                        <button
                          onClick={() => installPlugin(plugin)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-lime-400 bg-lime-500/20 px-4 py-2 text-xs font-bold text-lime-400 hover:bg-lime-500/30 transition shadow-[0_0_12px_rgba(57,255,20,0.25)]"
                        >
                          <Download className="h-3.5 w-3.5 stroke-[3]" />
                          MOUNT_PLUGIN
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
            <div className="rounded-3xl border-2 border-dashed border-cyan-500/30 p-16 text-center space-y-3 bg-[#0c091f]/60">
              <Package className="h-10 w-10 text-fuchsia-400 mx-auto opacity-70 animate-bounce" />
              <h3 className="font-heading text-lg font-black text-white uppercase">NO PLUGINS MOUNTED IN SANDBOX</h3>
              <p className="text-xs text-cyan-200/70 max-w-md mx-auto font-sans">
                Visit the Explore Marketplace tab to discover and install bare-metal WASM extensions.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {installedPlugins.map((plugin) => {
                const enabled = isPluginEnabled(plugin.id);
                return (
                  <div
                    key={plugin.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border-2 border-cyan-500/30 bg-[#0c091f]/90 p-6 hover:border-cyan-400 transition-all shadow-sm"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-base font-heading font-black text-white uppercase">
                          {plugin.name}
                        </h3>
                        <span className={`rounded px-2.5 py-0.5 text-[10px] font-bold uppercase border ${
                          enabled ? 'bg-lime-500/20 border-lime-400 text-lime-400 shadow-[0_0_8px_rgba(57,255,20,0.3)]' : 'bg-[#070512] border-cyan-500/40 text-cyan-400/60'
                        }`}>
                          {enabled ? 'STATUS: ACTIVE' : 'STATUS: DISABLED'}
                        </span>
                        <span className="text-xs text-cyan-400/70 font-mono">
                          // v{plugin.version}
                        </span>
                      </div>

                      <p className="text-xs text-cyan-200/80 max-w-2xl font-sans">
                        {plugin.description}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-lime-400 font-bold">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="uppercase">
                          PERMISSIONS GRANTED: {plugin.permissions.join(', ') || 'NONE'}
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
                        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition ${
                          enabled
                            ? 'border-amber-400 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25'
                            : 'border-lime-400 bg-lime-500/20 text-lime-400 hover:bg-lime-500/30 shadow-[0_0_12px_rgba(57,255,20,0.25)]'
                        }`}
                      >
                        <Power className="h-3.5 w-3.5" />
                        {enabled ? 'DISABLE' : 'ENABLE'}
                      </button>

                      <button
                        onClick={() => uninstallPlugin(plugin.id)}
                        className="rounded-xl border border-cyan-500/30 bg-[#070512] p-2 text-cyan-400 hover:border-rose-400 hover:text-rose-400 transition"
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
            className="rounded-3xl border-2 border-cyan-500/30 bg-[#0c091f]/90 p-6 sm:p-8 space-y-4 shadow-[0_0_25px_rgba(0,240,255,0.15)]"
          >
            <h3 className="text-base font-heading font-black text-white uppercase tracking-wider flex items-center gap-2 border-b border-cyan-500/20 pb-3">
              <Upload className="h-5 w-5 text-lime-400" />
              <span>// MOUNT_CUSTOM_MANIFEST_.JSON</span>
            </h3>
            <p className="text-xs text-cyan-200/70 font-sans">
              Paste a valid `plugin.json` schema blueprint below to validate and mount your local development extension directly into the WASM sandbox.
            </p>

            {installStatus.message && (
              <div
                className={`rounded-2xl p-3.5 text-xs font-bold border-2 ${
                  installStatus.success
                    ? 'border-lime-400 bg-lime-500/15 text-lime-300 shadow-[0_0_15px_rgba(57,255,20,0.2)]'
                    : 'border-rose-400 bg-rose-500/15 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                }`}
              >
                {installStatus.message}
              </div>
            )}

            <textarea
              rows={16}
              value={customManifestJson}
              onChange={(e) => setCustomManifestJson(e.target.value)}
              placeholder={`{\n  "id": "my-custom-kit",\n  "name": "My Custom Cyber Extension",\n  "version": "1.0.0",\n  "author": "Cyber Deck Lab",\n  "description": "Custom utility kit",\n  "category": "utilities",\n  "permissions": ["storage"],\n  "tools": [\n    {\n      "slug": "my-custom-kit",\n      "name": "My Custom Tool",\n      "description": "Sandboxed utility description",\n      "category": "utilities"\n    }\n  ]\n}`}
              className="w-full font-mono text-xs rounded-2xl border border-cyan-500/40 bg-[#070512] p-4 text-lime-300 placeholder:text-cyan-400/50 focus:border-cyan-300 focus:outline-none leading-relaxed"
            />

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl border border-lime-400 bg-lime-500/20 px-5 py-3 text-xs font-bold text-lime-400 hover:bg-lime-500/30 transition w-full justify-center shadow-[0_0_15px_rgba(57,255,20,0.25)]"
            >
              <CheckCircle2 className="h-4 w-4 stroke-[3]" />
              VALIDATE_&_MOUNT_MANIFEST
            </button>
          </form>

          {/* Schema Instructions */}
          <div className="rounded-3xl border-2 border-cyan-500/30 bg-[#0c091f]/90 p-6 sm:p-8 space-y-4 shadow-[0_0_25px_rgba(0,240,255,0.15)]">
            <h3 className="text-base font-heading font-black text-white uppercase tracking-wider flex items-center gap-2 border-b border-cyan-500/20 pb-3">
              <Code2 className="h-5 w-5 text-fuchsia-400" />
              <span>// MANIFEST_SCHEMA_SPEC</span>
            </h3>
            <p className="text-xs text-cyan-200/70 font-sans">
              Every custom plugin package must pass strict zero-trust sandbox verification:
            </p>
            <ul className="space-y-3 text-xs text-cyan-100 font-mono">
              <li className="bg-[#070512] p-3 rounded-xl border border-cyan-500/20">
                <strong className="text-cyan-400 font-black">id:</strong> Must be strict lowercase kebab-case (`^[a-z0-9]+(?:-[a-z0-9]+)*$`).
              </li>
              <li className="bg-[#070512] p-3 rounded-xl border border-cyan-500/20">
                <strong className="text-cyan-400 font-black">version:</strong> Semantic versioning string (`X.Y.Z`).
              </li>
              <li className="bg-[#070512] p-3 rounded-xl border border-cyan-500/20">
                <strong className="text-cyan-400 font-black">permissions:</strong> Array containing any subset of: `storage`, `clipboard`, `network`, `notifications`.
              </li>
              <li className="bg-[#070512] p-3 rounded-xl border border-cyan-500/20">
                <strong className="text-cyan-400 font-black">tools:</strong> Array of tool descriptors mapped to the core DevForge Tool Engine.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 4: Sandbox Audit Logs */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-cyan-500/30 pb-4">
            <h3 className="text-base font-heading font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Terminal className="h-5 w-5 text-lime-400" />
              <span>SANDBOX_AUDIT_LOGS // SECURITY MATRIX ({auditLogs.length})</span>
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefreshLogs}
                className="rounded-xl border border-cyan-400 bg-cyan-500/20 px-3.5 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 transition shadow-sm"
              >
                REFRESH_LOGS
              </button>
              {auditLogs.length > 0 && (
                <button
                  onClick={handleClearLogs}
                  className="rounded-xl border border-rose-400 bg-rose-500/15 px-3.5 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-500/25 transition shadow-sm"
                >
                  CLEAR_AUDIT_LOGS [X]
                </button>
              )}
            </div>
          </div>

          {auditLogs.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-cyan-500/30 p-16 text-center space-y-3 bg-[#0c091f]/60">
              <Terminal className="h-10 w-10 text-lime-400 mx-auto opacity-70 animate-pulse" />
              <h4 className="font-heading text-lg font-black text-white uppercase">NO SANDBOX SECURITY LOGS RECORDED YET</h4>
              <p className="text-xs text-cyan-200/70 max-w-md mx-auto font-sans">
                Sandboxed WASM operations, IPC calls, and permission checks will be logged here in real time.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-cyan-500/30 bg-[#070512] p-4.5 hover:border-cyan-400 transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-bold text-sm text-white uppercase">
                        {log.pluginId}
                      </span>
                      <span className="rounded bg-cyan-500/20 border border-cyan-400/50 px-2 py-0.5 text-[10px] text-cyan-300 font-bold uppercase">
                        ACTION: {log.action}
                      </span>
                      <span className="text-[10px] text-cyan-400/70">
                        // {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-cyan-200/80 font-sans">{log.message}</p>
                  </div>

                  <div>
                    <span
                      className={`rounded px-3 py-1 text-xs font-black uppercase border ${
                        log.granted
                          ? 'bg-lime-500/20 border-lime-400 text-lime-400 shadow-[0_0_8px_rgba(57,255,20,0.3)]'
                          : 'bg-rose-500/20 border-rose-400 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.3)]'
                      }`}
                    >
                      {log.granted ? 'GRANTED [OK]' : 'BLOCKED [X]'}
                    </span>
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
