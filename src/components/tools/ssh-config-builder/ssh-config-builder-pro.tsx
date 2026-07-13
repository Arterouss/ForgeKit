'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, AlertCircle, Key, Server } from 'lucide-react';
import {
  generateSshConfig,
  validateSshConfig,
  SSH_PRESETS,
  type SshConfigDocument,
  type SshHostEntry,
} from '@/lib/ssh-config-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function SshConfigBuilderPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [doc, setDoc] = useState<SshConfigDocument>(
    SSH_PRESETS[0].document
  );

  const output = useMemo(() => generateSshConfig(doc), [doc]);
  const validation = useMemo(() => validateSshConfig(doc), [doc]);

  const handleRun = () => {
    addHistoryItem(
      'SSH Config Builder',
      `Generated ~/.ssh/config with ${doc.hosts.length} Host entries`
    );
  };

  const handleClear = () => {
    setDoc({
      includeGlobalDefaults: true,
      globalServerAliveInterval: 60,
      hosts: [
        {
          id: '1',
          hostAlias: 'myserver',
          hostname: '203.0.113.10',
          user: 'ubuntu',
          port: 22,
          identityFile: '~/.ssh/id_ed25519',
          forwardAgent: false,
        },
      ],
    });
  };

  const addHost = () => {
    const newId = `host-${Date.now()}`;
    setDoc((prev) => ({
      ...prev,
      hosts: [
        ...prev.hosts,
        {
          id: newId,
          hostAlias: `server-${prev.hosts.length + 1}`,
          hostname: 'localhost',
          user: 'ubuntu',
          port: 22,
          forwardAgent: false,
        },
      ],
    }));
  };

  const updateHost = (id: string, updates: Partial<SshHostEntry>) => {
    setDoc((prev) => ({
      ...prev,
      hosts: prev.hosts.map((h) => (h.id === id ? { ...h, ...updates } : h)),
    }));
  };

  const removeHost = (id: string) => {
    setDoc((prev) => ({
      ...prev,
      hosts: prev.hosts.filter((h) => h.id !== id),
    }));
  };

  return (
    <ToolPage
      title="SSH Config Builder"
      description="Visual multi-host generator for ~/.ssh/config supporting ProxyJump bastion routing, IdentityFile selection, LocalForward SSH tunnels, and keep-alive intervals"
      category="Linux"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const preset = SSH_PRESETS.find(
                  (p) => p.name === e.target.value
                );
                if (preset) setDoc(preset.document);
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load SSH Config Preset...
              </option>
              {SSH_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={doc.includeGlobalDefaults}
                  onChange={(e) =>
                    setDoc({
                      ...doc,
                      includeGlobalDefaults: e.target.checked,
                    })
                  }
                  className="rounded border-border"
                />
                Include Global Defaults (Host *)
              </label>

              <button
                onClick={addHost}
                className="flex items-center gap-1 rounded bg-primary px-3 py-1 text-xs font-bold text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-3.5 w-3.5" /> Add Host Entry
              </button>
            </div>
          </div>

          {validation.errors.length > 0 && (
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
            </div>
          )}

          <ToolToolbar
            onRun={handleRun}
            runLabel="Save Config"
            onLoadSample={() => setDoc(SSH_PRESETS[0].document)}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(output)}
            canCopy={Boolean(output)}
            onDownloadOutput={() => downloadFile(output, 'config')}
            canDownload={Boolean(output)}
          />
        </div>
      }
      statusArea={
        validation.isValid ? (
          <StatusArea
            status="success"
            message="Valid SSH Config"
            detail={`Hosts: ${doc.hosts.length} configured | ProxyJump & Forwarding Enabled`}
          />
        ) : (
          <StatusArea
            status="error"
            message="Validation Error"
            detail={validation.errors[0] ?? 'Check host alias'}
          />
        )
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* Global Defaults */}
          {doc.includeGlobalDefaults && (
            <div className="rounded-xl border border-border bg-background p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-xs font-bold text-foreground">
                    Host * (Global Defaults)
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    ServerAliveInterval keep-alive heartbeats
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  Interval (sec):
                </span>
                <input
                  type="number"
                  value={doc.globalServerAliveInterval}
                  onChange={(e) =>
                    setDoc({
                      ...doc,
                      globalServerAliveInterval:
                        parseInt(e.target.value, 10) || 60,
                    })
                  }
                  className="w-20 rounded border border-border bg-card px-2 py-1 text-center font-mono text-xs font-bold text-foreground"
                />
              </div>
            </div>
          )}

          {/* Host Entries */}
          <div className="space-y-3">
            {doc.hosts.map((host, idx) => (
              <div
                key={host.id}
                className="rounded-xl border border-border bg-background p-3.5 space-y-3 relative"
              >
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold text-foreground">
                      Host Entry #{idx + 1}:{' '}
                      <span className="text-primary font-mono">
                        {host.hostAlias || 'unnamed'}
                      </span>
                    </span>
                  </div>
                  <button
                    onClick={() => removeHost(host.id)}
                    className="text-muted-foreground hover:text-destructive text-xs flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">
                      Host Alias (Host)
                    </label>
                    <input
                      type="text"
                      value={host.hostAlias}
                      onChange={(e) =>
                        updateHost(host.id, { hostAlias: e.target.value })
                      }
                      placeholder="prod-server"
                      className="w-full rounded border border-border bg-card px-2.5 py-1 font-mono text-xs font-bold text-primary"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-semibold text-muted-foreground">
                      HostName (IP or FQDN)
                    </label>
                    <input
                      type="text"
                      value={host.hostname}
                      onChange={(e) =>
                        updateHost(host.id, { hostname: e.target.value })
                      }
                      placeholder="10.0.10.45 or ec2-xxx.amazonaws.com"
                      className="w-full rounded border border-border bg-card px-2.5 py-1 font-mono text-xs text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">
                      Port
                    </label>
                    <input
                      type="number"
                      value={host.port ?? 22}
                      onChange={(e) =>
                        updateHost(host.id, {
                          port: parseInt(e.target.value, 10) || 22,
                        })
                      }
                      className="w-full rounded border border-border bg-card px-2.5 py-1 font-mono text-xs text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">
                      User
                    </label>
                    <input
                      type="text"
                      value={host.user}
                      onChange={(e) =>
                        updateHost(host.id, { user: e.target.value })
                      }
                      placeholder="ubuntu or deploy"
                      className="w-full rounded border border-border bg-card px-2.5 py-1 font-mono text-xs text-foreground"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-semibold text-muted-foreground">
                      IdentityFile (Private SSH Key Path)
                    </label>
                    <input
                      type="text"
                      value={host.identityFile ?? ''}
                      onChange={(e) =>
                        updateHost(host.id, { identityFile: e.target.value })
                      }
                      placeholder="~/.ssh/id_ed25519_prod"
                      className="w-full rounded border border-border bg-card px-2.5 py-1 font-mono text-xs text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-border/60">
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">
                      ProxyJump (Jump Host Alias)
                    </label>
                    <input
                      type="text"
                      value={host.proxyJump ?? ''}
                      onChange={(e) =>
                        updateHost(host.id, { proxyJump: e.target.value })
                      }
                      placeholder="bastion"
                      className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground">
                      LocalForward (SSH Tunnel)
                    </label>
                    <input
                      type="text"
                      value={host.localForward ?? ''}
                      onChange={(e) =>
                        updateHost(host.id, { localForward: e.target.value })
                      }
                      placeholder="5432 localhost:5432"
                      className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={host.forwardAgent}
                        onChange={(e) =>
                          updateHost(host.id, {
                            forwardAgent: e.target.checked,
                          })
                        }
                        className="rounded border-border"
                      />
                      ForwardAgent yes
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title="Generated ~/.ssh/config File"
          value={output}
          language="bash"
        />
      }
    />
  );
}
