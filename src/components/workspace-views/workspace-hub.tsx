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
} from 'lucide-react';
import { useWorkspace } from '@/components/workspace';
import { Badge } from '@/components/ui/badge';

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
    a.download = `devforge-workspace-${new Date().toISOString().slice(0, 10)}.json`;
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
            message: 'Workspace successfully restored from backup JSON file!',
          });
        } else {
          setImportStatus({
            success: false,
            message: result.error || 'Failed to import backup JSON file.',
          });
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary" />
            Developer Workspace Ecosystem Hub
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage multi-workspace isolation, local backup snapshots, portable JSON export/import, and dashboard widgets.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadExport}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <Download className="h-4 w-4" />
            Export Portable JSON
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            <Upload className="h-4 w-4" />
            Import JSON Backup
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
          className={`rounded-xl p-4 border text-sm ${
            importStatus.success
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
          }`}
        >
          {importStatus.message}
        </div>
      )}

      {/* Grid: Workspaces & Dashboard Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved Workspaces Card */}
        <div className="rounded-2xl border border-border bg-card/40 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Saved Workspaces
            </h2>
            <Badge variant="outline">{workspaces.length} Active</Badge>
          </div>

          <div className="space-y-3">
            {workspaces.map((ws) => {
              const isActive = ws.id === activeWorkspaceId;
              return (
                <div
                  key={ws.id}
                  className={`flex items-center justify-between rounded-xl border p-4 transition ${
                    isActive
                      ? 'border-primary/50 bg-primary/10'
                      : 'border-border bg-background/50 hover:border-border/80'
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {ws.name}
                      </span>
                      {isActive && (
                        <Badge className="bg-primary text-primary-foreground text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      {ws.description}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isActive && (
                      <button
                        onClick={() => switchWorkspace(ws.id)}
                        className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/80 transition"
                      >
                        Switch
                      </button>
                    )}
                    {!ws.isDefault && (
                      <button
                        onClick={() => deleteWorkspace(ws.id)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
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
            className="border-t border-border pt-4 space-y-3"
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Create Custom Workspace
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Workspace Name (e.g. API Security Kit)"
                value={newWsName}
                onChange={(e) => setNewWsName(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                placeholder="Description"
                value={newWsDesc}
                onChange={(e) => setNewWsDesc(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary/20 text-primary px-4 py-2 text-xs font-semibold hover:bg-primary/30 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Workspace Profile
            </button>
          </form>
        </div>

        {/* Custom Dashboard Widgets Settings Card */}
        <div className="rounded-2xl border border-border bg-card/40 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Sliders className="h-5 w-5 text-primary" />
              Dashboard Layout & Widgets Config
            </h2>
            <Badge variant="outline">Customizable</Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            Toggle visibility of sections on the main dashboard portal (`/dashboard`).
          </p>

          <div className="space-y-4">
            <label className="flex items-center justify-between rounded-xl border border-border bg-background/40 p-4 cursor-pointer hover:bg-background/60 transition">
              <div>
                <span className="font-medium text-foreground block">
                  Show Favorites Widget
                </span>
                <span className="text-xs text-muted-foreground">
                  Displays your pinned favorite tools at the top of the dashboard.
                </span>
              </div>
              <input
                type="checkbox"
                checked={dashboardWidgets.showFavorites}
                onChange={(e) =>
                  setDashboardWidget('showFavorites', e.target.checked)
                }
                className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl border border-border bg-background/40 p-4 cursor-pointer hover:bg-background/60 transition">
              <div>
                <span className="font-medium text-foreground block">
                  Show Recent Activity Widget
                </span>
                <span className="text-xs text-muted-foreground">
                  Displays recently executed tools and execution history.
                </span>
              </div>
              <input
                type="checkbox"
                checked={dashboardWidgets.showRecent}
                onChange={(e) =>
                  setDashboardWidget('showRecent', e.target.checked)
                }
                className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl border border-border bg-background/40 p-4 cursor-pointer hover:bg-background/60 transition">
              <div>
                <span className="font-medium text-foreground block">
                  Show Category Collections Grid
                </span>
                <span className="text-xs text-muted-foreground">
                  Shows cards for Core Tools, DevOps, Git, Linux, Network, and Security.
                </span>
              </div>
              <input
                type="checkbox"
                checked={dashboardWidgets.showCategories}
                onChange={(e) =>
                  setDashboardWidget('showCategories', e.target.checked)
                }
                className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl border border-border bg-background/40 p-4 cursor-pointer hover:bg-background/60 transition">
              <div>
                <span className="font-medium text-foreground block">
                  Show All 60 Tools Grid
                </span>
                <span className="text-xs text-muted-foreground">
                  Renders the complete interactive catalog of DevForge developer tools.
                </span>
              </div>
              <input
                type="checkbox"
                checked={dashboardWidgets.showAllTools}
                onChange={(e) =>
                  setDashboardWidget('showAllTools', e.target.checked)
                }
                className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Snapshot Backup & Restore Card */}
      <div className="rounded-2xl border border-border bg-card/40 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Local Snapshot Backup & Restore Points
          </h2>
          <Badge variant="outline">{snapshots.length} Snapshots</Badge>
        </div>

        <form onSubmit={handleCreateSnapshot} className="flex gap-3">
          <input
            type="text"
            placeholder="Snapshot Label (e.g. Pre-Deployment Backup)"
            value={snapLabel}
            onChange={(e) => setSnapLabel(e.target.value)}
            className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
          >
            <Plus className="h-4 w-4" />
            Create Snapshot Point
          </button>
        </form>

        {snapshots.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
            No local snapshots created yet. Create a snapshot point above to easily rollback your workspace anytime.
          </div>
        ) : (
          <div className="space-y-3">
            {snapshots.map((snap) => (
              <div
                key={snap.id}
                className="flex items-center justify-between rounded-xl border border-border bg-background/60 p-4"
              >
                <div>
                  <span className="font-semibold text-foreground block">
                    {snap.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Created on {new Date(snap.timestamp).toLocaleString()} • Workspace: {snap.workspaceId}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => restoreSnapshot(snap.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Restore Rollback
                  </button>
                  <button
                    onClick={() => deleteSnapshot(snap.id)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
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
