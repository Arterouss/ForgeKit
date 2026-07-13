'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, AlertCircle, UserCheck } from 'lucide-react';
import {
  generateChownCommand,
  validateChownConfig,
  CHOWN_PRESETS,
  type ChownConfig,
} from '@/lib/chown-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function ChownBuilderPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [config, setConfig] = useState<ChownConfig>(CHOWN_PRESETS[0].config);
  const [newTargetInput, setNewTargetInput] = useState('');

  const output = useMemo(() => {
    return generateChownCommand(config);
  }, [config]);

  const validation = useMemo(() => {
    return validateChownConfig(config);
  }, [config]);

  const handleRun = () => {
    addHistoryItem('chown Command Builder', `Generated command: ${output}`);
  };

  const handleClear = () => {
    setConfig({
      owner: 'www-data',
      group: 'www-data',
      separator: ':',
      targetPaths: ['/var/www/html'],
      recursive: false,
      preserveRoot: true,
      noDereference: false,
      verboseMode: 'none',
      useReference: false,
    });
  };

  const addTargetPath = () => {
    if (!newTargetInput.trim()) return;
    setConfig((prev) => ({
      ...prev,
      targetPaths: [...prev.targetPaths, newTargetInput.trim()],
    }));
    setNewTargetInput('');
  };

  const removeTargetPath = (idx: number) => {
    setConfig((prev) => ({
      ...prev,
      targetPaths: prev.targetPaths.filter((_, i) => i !== idx),
    }));
  };

  return (
    <ToolPage
      title="chown Command Builder"
      description="Interactive Linux chown & chgrp command generator with recursive ownership rules, UID/GID syntax, symlink dereference options, and preserve-root safeguards"
      category="Linux"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const preset = CHOWN_PRESETS.find(
                  (p) => p.name === e.target.value
                );
                if (preset) setConfig(preset.config);
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load chown Preset...
              </option>
              {CHOWN_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.recursive}
                  onChange={(e) =>
                    setConfig({ ...config, recursive: e.target.checked })
                  }
                  className="rounded border-border"
                />
                Recursive (-R)
              </label>

              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.preserveRoot}
                  onChange={(e) =>
                    setConfig({ ...config, preserveRoot: e.target.checked })
                  }
                  className="rounded border-border"
                />
                Preserve Root (--preserve-root)
              </label>

              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.useReference}
                  onChange={(e) =>
                    setConfig({ ...config, useReference: e.target.checked })
                  }
                  className="rounded border-border"
                />
                Use --reference
              </label>
            </div>
          </div>

          {(validation.errors.length > 0 || validation.warnings.length > 0) && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-2.5 space-y-1">
              {validation.errors.map((err, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 text-xs text-destructive font-medium"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{err}</span>
                </div>
              ))}
              {validation.warnings.map((warn, i) => (
                <div
                  key={`w-${i}`}
                  className="flex items-center gap-1.5 text-xs text-amber-500 font-medium"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{warn}</span>
                </div>
              ))}
            </div>
          )}

          <ToolToolbar
            onRun={handleRun}
            runLabel="Save to History"
            onLoadSample={() => setConfig(CHOWN_PRESETS[0].config)}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(output)}
            canCopy={Boolean(output)}
            onDownloadOutput={() => downloadFile(output, 'chown.sh')}
            canDownload={Boolean(output)}
          />
        </div>
      }
      statusArea={
        validation.isValid ? (
          <StatusArea
            status="success"
            message="Valid Command"
            detail={`Targets: ${config.targetPaths.length} | Mode: ${
              config.useReference ? 'Reference File' : 'Owner/Group'
            }`}
          />
        ) : (
          <StatusArea
            status="error"
            message="Configuration Error"
            detail={validation.errors[0] ?? 'Check settings'}
          />
        )
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* Ownership Editor */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b border-border pb-2">
              <UserCheck className="h-4 w-4 text-primary" />
              <span>Ownership Configuration</span>
            </div>

            {config.useReference ? (
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  Reference File (--reference=RFILE)
                </label>
                <input
                  type="text"
                  value={config.referenceFile ?? ''}
                  onChange={(e) =>
                    setConfig({ ...config, referenceFile: e.target.value })
                  }
                  placeholder="/etc/nginx/nginx.conf"
                  className="w-full rounded border border-border bg-card px-2.5 py-1.5 font-mono text-xs text-foreground"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground">
                    Owner (User or UID)
                  </label>
                  <input
                    type="text"
                    value={config.owner}
                    onChange={(e) =>
                      setConfig({ ...config, owner: e.target.value })
                    }
                    placeholder="www-data or 1000"
                    className="w-full rounded border border-border bg-card px-2.5 py-1 font-mono text-xs font-bold text-primary"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground">
                    Separator Syntax
                  </label>
                  <select
                    value={config.separator}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        separator: e.target.value as ':' | '.',
                      })
                    }
                    className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                  >
                    <option value=":">Colon (:) — POSIX standard</option>
                    <option value=".">Dot (.) — Legacy compatibility</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground">
                    Group (Group or GID)
                  </label>
                  <input
                    type="text"
                    value={config.group}
                    onChange={(e) =>
                      setConfig({ ...config, group: e.target.value })
                    }
                    placeholder="www-data or 1000"
                    className="w-full rounded border border-border bg-card px-2.5 py-1 font-mono text-xs font-bold text-foreground"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Target Paths */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <span className="text-xs font-bold text-foreground">
              Target Files & Directories ({config.targetPaths.length})
            </span>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTargetInput}
                onChange={(e) => setNewTargetInput(e.target.value)}
                placeholder="/var/www/html or /home/deploy/.ssh"
                className="flex-1 rounded border border-border bg-card px-2.5 py-1.5 font-mono text-xs text-foreground"
                onKeyDown={(e) => e.key === 'Enter' && addTargetPath()}
              />
              <button
                onClick={addTargetPath}
                className="flex items-center gap-1 rounded bg-primary/10 px-2.5 py-1.5 text-xs font-bold text-primary hover:bg-primary/20"
              >
                <Plus className="h-3.5 w-3.5" /> Add Path
              </button>
            </div>

            <div className="space-y-1.5">
              {config.targetPaths.map((tp, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground"
                >
                  <span>{tp}</span>
                  <button
                    onClick={() => removeTargetPath(idx)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Flags */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-2">
            <span className="text-xs font-bold text-foreground">
              Advanced Command Flags
            </span>
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.noDereference}
                  onChange={(e) =>
                    setConfig({ ...config, noDereference: e.target.checked })
                  }
                  className="rounded border-border"
                />
                No Dereference Symlinks (-h)
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-semibold">
                  Verbosity:
                </span>
                <select
                  value={config.verboseMode}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      verboseMode: e.target.value as
                        | 'none'
                        | 'verbose'
                        | 'changes',
                    })
                  }
                  className="rounded border border-border bg-card px-2 py-0.5 text-xs text-foreground"
                >
                  <option value="none">Standard output (silent)</option>
                  <option value="changes">Report changes (-c)</option>
                  <option value="verbose">Verbose output (-v)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title="Generated Linux chown Command"
          value={output}
          language="bash"
        />
      }
    />
  );
}
