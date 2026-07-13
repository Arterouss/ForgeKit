'use client';

import { useState, useMemo } from 'react';
import { ShieldCheck, Hash, Terminal } from 'lucide-react';
import {
  parseOctalToPermissions,
  permissionsToOctalString,
  permissionsToSymbolicString,
  permissionsToSymbolicClause,
  generateChmodCommand,
  CHMOD_PRESETS,
  type ChmodPermissions,
} from '@/lib/chmod-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function ChmodCalculatorPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [permissions, setPermissions] = useState<ChmodPermissions>(() =>
    parseOctalToPermissions('755')!
  );
  const [targetPath, setTargetPath] = useState('/var/www/html');
  const [recursive, setRecursive] = useState(false);
  const [mode, setMode] = useState<'octal' | 'symbolic'>('octal');

  const octalStr = useMemo(
    () => permissionsToOctalString(permissions),
    [permissions]
  );
  const symbolicStr = useMemo(
    () => permissionsToSymbolicString(permissions),
    [permissions]
  );
  const symbolicClause = useMemo(
    () => permissionsToSymbolicClause(permissions),
    [permissions]
  );

  const commandOutput = useMemo(() => {
    return generateChmodCommand({
      permissions,
      targetPath,
      recursive,
      mode,
    });
  }, [permissions, targetPath, recursive, mode]);

  const handleOctalChange = (val: string) => {
    const parsed = parseOctalToPermissions(val);
    if (parsed) {
      setPermissions(parsed);
    }
  };

  const handleRun = () => {
    addHistoryItem(
      'chmod Calculator Pro',
      `Generated command: chmod ${octalStr} (${symbolicStr})`
    );
  };

  const handleClear = () => {
    setPermissions(parseOctalToPermissions('644')!);
    setTargetPath('/path/to/file');
    setRecursive(false);
  };

  return (
    <ToolPage
      title="chmod Calculator Pro"
      description="Interactive Linux permission matrix calculator with bidirectional Octal (755) and Symbolic (-rwxr-xr-x) conversion, special bits (SUID/SGID/Sticky), and CLI chmod command builder"
      category="Linux"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const preset = CHMOD_PRESETS.find(
                  (p) => p.name === e.target.value
                );
                if (preset) {
                  const parsed = parseOctalToPermissions(preset.octal);
                  if (parsed) setPermissions(parsed);
                }
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Permission Preset...
              </option>
              {CHMOD_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} ({p.octal})
                </option>
              ))}
            </select>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-muted-foreground">
                Command Style:
              </span>
              {(['octal', 'symbolic'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    mode === m
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {m === 'octal' ? `Octal (${octalStr})` : `Symbolic (${symbolicClause})`}
                </button>
              ))}

              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={recursive}
                  onChange={(e) => setRecursive(e.target.checked)}
                  className="rounded border-border"
                />
                Recursive (-R)
              </label>
            </div>
          </div>

          <ToolToolbar
            onRun={handleRun}
            runLabel="Save to History"
            onLoadSample={() => {
              setPermissions(parseOctalToPermissions('755')!);
              setTargetPath('/var/www/app');
            }}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(commandOutput)}
            canCopy={Boolean(commandOutput)}
            onDownloadOutput={() => downloadFile(commandOutput, 'chmod.sh')}
            canDownload={Boolean(commandOutput)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status="success"
          message={`Octal: ${octalStr}`}
          detail={`Symbolic: ${symbolicStr} | Clause: ${symbolicClause}`}
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* Summary Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-background p-3 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                <Hash className="h-3.5 w-3.5 text-primary" />
                <span>Octal Mode</span>
              </div>
              <input
                type="text"
                value={octalStr}
                onChange={(e) => handleOctalChange(e.target.value)}
                maxLength={4}
                className="mt-1 font-mono text-xl font-extrabold text-primary bg-transparent border-none focus:outline-none"
              />
            </div>

            <div className="rounded-xl border border-border bg-background p-3 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Symbolic String</span>
              </div>
              <span className="mt-1 font-mono text-xl font-extrabold text-foreground">
                {symbolicStr}
              </span>
            </div>

            <div className="rounded-xl border border-border bg-background p-3 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                <Terminal className="h-3.5 w-3.5 text-blue-500" />
                <span>Target File / Directory</span>
              </div>
              <input
                type="text"
                value={targetPath}
                onChange={(e) => setTargetPath(e.target.value)}
                placeholder="/path/to/file"
                className="mt-1 font-mono text-xs font-bold text-foreground bg-transparent border-b border-border focus:outline-none"
              />
            </div>
          </div>

          {/* Permission Matrix */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <span className="text-xs font-bold text-foreground">
              Permission Matrix Checkboxes
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Owner */}
              <div className="rounded-lg border border-border bg-card p-3 space-y-2">
                <div className="text-xs font-bold text-primary border-b border-border pb-1.5">
                  User (Owner) — u
                </div>
                <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.owner.read}
                    onChange={(e) =>
                      setPermissions({
                        ...permissions,
                        owner: { ...permissions.owner, read: e.target.checked },
                      })
                    }
                    className="rounded border-border"
                  />
                  Read (4) — r
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.owner.write}
                    onChange={(e) =>
                      setPermissions({
                        ...permissions,
                        owner: {
                          ...permissions.owner,
                          write: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-border"
                  />
                  Write (2) — w
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.owner.execute}
                    onChange={(e) =>
                      setPermissions({
                        ...permissions,
                        owner: {
                          ...permissions.owner,
                          execute: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-border"
                  />
                  Execute (1) — x
                </label>
                <div className="pt-1 border-t border-border">
                  <label className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.special.setuid}
                      onChange={(e) =>
                        setPermissions({
                          ...permissions,
                          special: {
                            ...permissions.special,
                            setuid: e.target.checked,
                          },
                        })
                      }
                      className="rounded border-border"
                    />
                    SUID (Set User ID — 4000)
                  </label>
                </div>
              </div>

              {/* Group */}
              <div className="rounded-lg border border-border bg-card p-3 space-y-2">
                <div className="text-xs font-bold text-primary border-b border-border pb-1.5">
                  Group — g
                </div>
                <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.group.read}
                    onChange={(e) =>
                      setPermissions({
                        ...permissions,
                        group: { ...permissions.group, read: e.target.checked },
                      })
                    }
                    className="rounded border-border"
                  />
                  Read (4) — r
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.group.write}
                    onChange={(e) =>
                      setPermissions({
                        ...permissions,
                        group: {
                          ...permissions.group,
                          write: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-border"
                  />
                  Write (2) — w
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.group.execute}
                    onChange={(e) =>
                      setPermissions({
                        ...permissions,
                        group: {
                          ...permissions.group,
                          execute: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-border"
                  />
                  Execute (1) — x
                </label>
                <div className="pt-1 border-t border-border">
                  <label className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.special.setgid}
                      onChange={(e) =>
                        setPermissions({
                          ...permissions,
                          special: {
                            ...permissions.special,
                            setgid: e.target.checked,
                          },
                        })
                      }
                      className="rounded border-border"
                    />
                    SGID (Set Group ID — 2000)
                  </label>
                </div>
              </div>

              {/* Others */}
              <div className="rounded-lg border border-border bg-card p-3 space-y-2">
                <div className="text-xs font-bold text-primary border-b border-border pb-1.5">
                  Others (Public) — o
                </div>
                <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.others.read}
                    onChange={(e) =>
                      setPermissions({
                        ...permissions,
                        others: {
                          ...permissions.others,
                          read: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-border"
                  />
                  Read (4) — r
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.others.write}
                    onChange={(e) =>
                      setPermissions({
                        ...permissions,
                        others: {
                          ...permissions.others,
                          write: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-border"
                  />
                  Write (2) — w
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.others.execute}
                    onChange={(e) =>
                      setPermissions({
                        ...permissions,
                        others: {
                          ...permissions.others,
                          execute: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-border"
                  />
                  Execute (1) — x
                </label>
                <div className="pt-1 border-t border-border">
                  <label className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.special.sticky}
                      onChange={(e) =>
                        setPermissions({
                          ...permissions,
                          special: {
                            ...permissions.special,
                            sticky: e.target.checked,
                          },
                        })
                      }
                      className="rounded border-border"
                    />
                    Sticky Bit (1000 — /tmp style)
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title="Generated Linux chmod CLI Command"
          value={commandOutput}
          language="bash"
        />
      }
    />
  );
}
