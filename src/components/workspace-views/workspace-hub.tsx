'use client';

import { useState, useRef } from 'react';
import {
  Briefcase,
  Plus,
  Trash2,
  Download,
  Upload,
  History,
  RotateCcw,
  Sliders,
  Layers,
  Terminal,
} from 'lucide-react';
import { useWorkspace } from '@/components/workspace';

export function WorkspaceHubView() {
  const {
    workspaces,
    activeWorkspaceId,
    createWorkspace,
    switchWorkspace,
    deleteWorkspace,
    snapshots,
    createSnapshot,
    restoreSnapshot,
    deleteSnapshot,
    exportWorkspaceJson,
    importWorkspaceJson,
    dashboardWidgets,
    setDashboardWidget,
  } = useWorkspace();

  const [newWsName, setNewWsName] = useState('');
  const [newWsDesc, setNewWsDesc] = useState('');
  const [snapLabel, setSnapLabel] = useState('');
  const [importStatus, setImportStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim()) return;
    createWorkspace(newWsName, newWsDesc, 'Briefcase');
    setNewWsName('');
    setNewWsDesc('');
  };

  const handleCreateSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    createSnapshot(snapLabel || 'Manual Backup');
    setSnapLabel('');
  };

  const handleDownloadExport = () => {
    const jsonStr = exportWorkspaceJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devforge-cyberos-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = importWorkspaceJson(content);
        if (result.success) {
          setImportStatus({
            success: true,
            message: '// WORKSPACE_STATE_RESTORED: JSON vault successfully imported to IndexedDB!',
          });
        } else {
          setImportStatus({
            success: false,
            message: result.error || '// ERR_RESTORE_FAILED: Invalid JSON structure.',
          });
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 pb-12 font-mono select-none">
      {/* Header */}
      <div className="border-b-2 border-cyan-500/30 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-wider text-white flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Layers className="h-5 w-5" />
            </div>
            <span>CYBER_OS // ECOSYSTEM HUB</span>
          </h1>
          <p className="text-xs text-cyan-200/70 mt-1 font-sans">
            Manage isolated multi-workspace sessions, local rollback snapshots, JSON vault transport, and terminal widgets.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleDownloadExport}
            className="inline-flex items-center gap-2 rounded-xl border border-lime-400 bg-lime-500/20 px-4 py-2.5 text-xs font-bold text-lime-400 transition hover:bg-lime-500/30 shadow-[0_0_12px_rgba(57,255,20,0.25)]"
          >
            <Download className="h-4 w-4 stroke-[3]" />
            EXPORT_VAULT_.JSON
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-400 bg-cyan-500/20 px-4 py-2.5 text-xs font-bold text-cyan-300 transition hover:bg-cyan-500/30 shadow-sm"
          >
            <Upload className="h-4 w-4 stroke-[3]" />
            IMPORT_VAULT_.JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileImport}
            className="hidden"
          />
        </div>
      </div>

      {importStatus.message && (
        <div
          className={`rounded-2xl p-4 border-2 font-bold text-xs ${
            importStatus.success
              ? 'border-lime-400 bg-lime-500/15 text-lime-300 shadow-[0_0_15px_rgba(57,255,20,0.2)]'
              : 'border-rose-400 bg-rose-500/15 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
          }`}
        >
          {importStatus.message}
        </div>
      )}

      {/* Grid: Workspaces & Dashboard Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved Workspaces Card */}
        <div className="rounded-3xl border-2 border-cyan-500/30 bg-[#0c091f]/90 p-6 sm:p-8 space-y-6 shadow-[0_0_25px_rgba(0,240,255,0.15)]">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <h2 className="text-base font-heading font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-fuchsia-400" />
              <span>// ISOLATED_WORKSPACES</span>
            </h2>
            <span className="rounded bg-cyan-500/15 border border-cyan-400/40 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 uppercase">
              {workspaces.length} ACTIVE
            </span>
          </div>

          <div className="space-y-3">
            {workspaces.map((ws) => {
              const isActive = ws.id === activeWorkspaceId;
              return (
                <div
                  key={ws.id}
                  className={`flex items-center justify-between rounded-2xl border-2 p-4 transition-all ${
                    isActive
                      ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.2)] scale-[1.01]'
                      : 'border-cyan-500/30 bg-[#070512] hover:border-cyan-400/60'
                  }`}
                >
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-white text-sm uppercase truncate">
                        {ws.name}
                      </span>
                      {isActive && (
                        <span className="rounded bg-lime-500/20 border border-lime-400 px-2 py-0.5 text-[9px] font-extrabold text-lime-400 uppercase shadow-[0_0_8px_rgba(57,255,20,0.3)]">
                          ACTIVE_SESSION
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-cyan-200/70 mt-1 font-sans truncate">
                      {ws.description || '// Sandbox environment'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {!isActive && (
                      <button
                        onClick={() => switchWorkspace(ws.id)}
                        className="rounded-xl border border-cyan-400 bg-cyan-500/20 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 transition shadow-sm"
                      >
                        MOUNT
                      </button>
                    )}
                    {!ws.isDefault && (
                      <button
                        onClick={() => deleteWorkspace(ws.id)}
                        className="rounded-xl border border-cyan-500/30 bg-[#070512] p-2 text-cyan-400 hover:border-rose-400 hover:text-rose-400 transition"
                        title="Delete workspace"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* New Workspace Form */}
          <form
            onSubmit={handleCreateWorkspace}
            className="border-t border-cyan-500/30 pt-4 space-y-3"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-lime-400" />
              <span>// CREATE_NEW_PROFILE</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Profile Name (e.g. SecOps Lab)"
                value={newWsName}
                onChange={(e) => setNewWsName(e.target.value)}
                className="w-full rounded-xl border border-cyan-500/40 bg-[#070512] px-3.5 py-2 text-xs text-white placeholder:text-cyan-400/50 focus:border-cyan-300 focus:outline-none font-mono"
              />
              <input
                type="text"
                placeholder="Description..."
                value={newWsDesc}
                onChange={(e) => setNewWsDesc(e.target.value)}
                className="w-full rounded-xl border border-cyan-500/40 bg-[#070512] px-3.5 py-2 text-xs text-white placeholder:text-cyan-400/50 focus:border-cyan-300 focus:outline-none font-mono"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl border border-lime-400 bg-lime-500/20 px-4 py-2.5 text-xs font-bold text-lime-400 hover:bg-lime-500/30 transition w-full justify-center shadow-[0_0_12px_rgba(57,255,20,0.25)]"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              INITIALIZE_PROFILE
            </button>
          </form>
        </div>

        {/* Custom Dashboard Widgets Settings Card */}
        <div className="rounded-3xl border-2 border-cyan-500/30 bg-[#0c091f]/90 p-6 sm:p-8 space-y-6 shadow-[0_0_25px_rgba(0,240,255,0.15)]">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <h2 className="text-base font-heading font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="h-4 w-4 text-lime-400" />
              <span>// DASHBOARD_HUD_WIDGETS</span>
            </h2>
            <span className="rounded border border-lime-400/50 bg-lime-500/15 px-2.5 py-0.5 text-[10px] font-bold text-lime-400 uppercase">
              LIVE_TOGGLES
            </span>
          </div>

          <p className="text-xs text-cyan-200/70 font-sans">
            Toggle visibility of active telemetry modules across the primary Command Hub (`/dashboard`).
          </p>

          <div className="space-y-3.5">
            <label className="flex items-center justify-between rounded-2xl border border-cyan-500/30 bg-[#070512] p-4 cursor-pointer hover:border-cyan-400 transition-all">
              <div>
                <span className="font-bold text-white text-xs uppercase block">
                  SHOW PINNED FAVORITES DOCK
                </span>
                <span className="text-[11px] text-cyan-200/70 font-sans">
                  Displays high-priority utility cards directly at the top of your workstation HUD.
                </span>
              </div>
              <input
                type="checkbox"
                checked={dashboardWidgets.showFavorites}
                onChange={(e) =>
                  setDashboardWidget('showFavorites', e.target.checked)
                }
                className="h-5 w-5 rounded border-cyan-400 bg-[#0c091f] text-cyan-400 focus:ring-cyan-400"
              />
            </label>

            <label className="flex items-center justify-between rounded-2xl border border-cyan-500/30 bg-[#070512] p-4 cursor-pointer hover:border-cyan-400 transition-all">
              <div>
                <span className="font-bold text-white text-xs uppercase block">
                  SHOW RECENT TELEMETRY FEED
                </span>
                <span className="text-[11px] text-cyan-200/70 font-sans">
                  Displays live chronological tool executions and quick-relaunch buttons.
                </span>
              </div>
              <input
                type="checkbox"
                checked={dashboardWidgets.showRecent}
                onChange={(e) =>
                  setDashboardWidget('showRecent', e.target.checked)
                }
                className="h-5 w-5 rounded border-cyan-400 bg-[#0c091f] text-cyan-400 focus:ring-cyan-400"
              />
            </label>

            <label className="flex items-center justify-between rounded-2xl border border-cyan-500/30 bg-[#070512] p-4 cursor-pointer hover:border-cyan-400 transition-all">
              <div>
                <span className="font-bold text-white text-xs uppercase block">
                  SHOW DOMAIN COLLECTIONS GRID
                </span>
                <span className="text-[11px] text-cyan-200/70 font-sans">
                  Shows cards for domain categories (Core, DevOps, Git, Linux, Network, Security).
                </span>
              </div>
              <input
                type="checkbox"
                checked={dashboardWidgets.showCategories}
                onChange={(e) =>
                  setDashboardWidget('showCategories', e.target.checked)
                }
                className="h-5 w-5 rounded border-cyan-400 bg-[#0c091f] text-cyan-400 focus:ring-cyan-400"
              />
            </label>

            <label className="flex items-center justify-between rounded-2xl border border-cyan-500/30 bg-[#070512] p-4 cursor-pointer hover:border-cyan-400 transition-all">
              <div>
                <span className="font-bold text-white text-xs uppercase block">
                  SHOW ALL 60 TOOLS MATRIX
                </span>
                <span className="text-[11px] text-cyan-200/70 font-sans">
                  Renders the complete interactive catalog of sandboxed WASM developer tools.
                </span>
              </div>
              <input
                type="checkbox"
                checked={dashboardWidgets.showAllTools}
                onChange={(e) =>
                  setDashboardWidget('showAllTools', e.target.checked)
                }
                className="h-5 w-5 rounded border-cyan-400 bg-[#0c091f] text-cyan-400 focus:ring-cyan-400"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Snapshot Backup & Restore Card */}
      <div className="rounded-3xl border-2 border-cyan-500/30 bg-[#0c091f]/90 p-6 sm:p-8 space-y-6 shadow-[0_0_25px_rgba(0,240,255,0.15)]">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <h2 className="text-base font-heading font-black text-white uppercase tracking-wider flex items-center gap-2">
            <History className="h-4 w-4 text-fuchsia-400" />
            <span>// LOCAL_ROLLBACK_SNAPSHOTS</span>
          </h2>
          <span className="rounded bg-cyan-500/15 border border-cyan-400/40 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 uppercase">
            {snapshots.length} BACKUPS
          </span>
        </div>

        <form onSubmit={handleCreateSnapshot} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="> Snapshot Label (e.g. Pre-Deployment Backup)..."
            value={snapLabel}
            onChange={(e) => setSnapLabel(e.target.value)}
            className="flex-1 rounded-xl border border-cyan-500/40 bg-[#070512] px-4 py-2.5 text-xs text-white placeholder:text-cyan-400/50 focus:border-cyan-300 focus:outline-none font-mono"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-lime-400 bg-lime-500/20 px-5 py-2.5 text-xs font-bold text-lime-400 hover:bg-lime-500/30 transition shrink-0 shadow-[0_0_12px_rgba(57,255,20,0.25)]"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            COMMIT_SNAPSHOT
          </button>
        </form>

        {snapshots.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-cyan-500/30 p-12 text-center text-cyan-400/70 text-xs font-mono bg-[#070512]/60">
            No local snapshots created yet. Commit a checkpoint point above to easily rollback your workspace configuration anytime.
          </div>
        ) : (
          <div className="space-y-3">
            {snapshots.map((snap) => (
              <div
                key={snap.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-cyan-500/30 bg-[#070512] p-4 hover:border-cyan-400 transition-all"
              >
                <div>
                  <span className="font-bold text-white uppercase block text-sm">
                    {snap.label}
                  </span>
                  <span className="text-[11px] text-cyan-400/70 font-sans block mt-0.5">
                    Committed on {new Date(snap.timestamp).toLocaleString()} • Profile: {snap.workspaceId}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => restoreSnapshot(snap.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-lime-400 bg-lime-500/20 px-3.5 py-1.5 text-xs font-bold text-lime-400 hover:bg-lime-500/30 transition shadow-sm"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    ROLLBACK
                  </button>
                  <button
                    onClick={() => deleteSnapshot(snap.id)}
                    className="rounded-xl border border-cyan-500/30 bg-[#0c091f] p-2 text-cyan-400 hover:border-rose-400 hover:text-rose-400 transition"
                    title="Delete Snapshot"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
