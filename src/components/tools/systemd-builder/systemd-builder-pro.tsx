'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, AlertCircle, Cpu } from 'lucide-react';
import {
  generateSystemdUnitFile,
  generateSystemctlCommands,
  validateSystemdConfig,
  SYSTEMD_PRESETS,
  type SystemdServiceConfig,
  type SystemdServiceType,
  type SystemdRestartPolicy,
} from '@/lib/systemd-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function SystemdBuilderPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [config, setConfig] = useState<SystemdServiceConfig>(
    SYSTEMD_PRESETS[0].config
  );
  const [outputTab, setOutputTab] = useState<'unit' | 'commands'>('unit');
  const [newEnvKey, setNewEnvKey] = useState('');
  const [newEnvValue, setNewEnvValue] = useState('');
  const [newAfterInput, setNewAfterInput] = useState('');

  const unitOutput = useMemo(
    () => generateSystemdUnitFile(config),
    [config]
  );
  const commandsOutput = useMemo(
    () => generateSystemctlCommands(config),
    [config]
  );

  const activeOutput = outputTab === 'unit' ? unitOutput : commandsOutput;

  const validation = useMemo(
    () => validateSystemdConfig(config),
    [config]
  );

  const handleRun = () => {
    addHistoryItem(
      'Systemd Service Builder',
      `Generated ${config.name}.service (${config.serviceType})`
    );
  };

  const handleClear = () => {
    setConfig({
      name: 'app',
      description: 'Custom Systemd Service',
      afterTargets: ['network.target'],
      serviceType: 'simple',
      user: '',
      group: '',
      workingDirectory: '',
      execStart: '/usr/bin/node /path/to/app.js',
      restartPolicy: 'always',
      restartSec: 5,
      environmentVars: [],
      protectSystem: false,
      privateTmp: false,
      wantedBy: 'multi-user.target',
    });
  };

  const addEnvVar = () => {
    if (!newEnvKey.trim()) return;
    setConfig((prev) => ({
      ...prev,
      environmentVars: [
        ...prev.environmentVars,
        { key: newEnvKey.trim(), value: newEnvValue.trim() },
      ],
    }));
    setNewEnvKey('');
    setNewEnvValue('');
  };

  const removeEnvVar = (idx: number) => {
    setConfig((prev) => ({
      ...prev,
      environmentVars: prev.environmentVars.filter((_, i) => i !== idx),
    }));
  };

  const addAfterTarget = () => {
    if (!newAfterInput.trim()) return;
    setConfig((prev) => ({
      ...prev,
      afterTargets: [...prev.afterTargets, newAfterInput.trim()],
    }));
    setNewAfterInput('');
  };

  const removeAfterTarget = (idx: number) => {
    setConfig((prev) => ({
      ...prev,
      afterTargets: prev.afterTargets.filter((_, i) => i !== idx),
    }));
  };

  return (
    <ToolPage
      title="Systemd Service Builder"
      description="Visual generator for Linux .service unit files with security hardening flags, environment variables, restart policies, and systemctl lifecycle commands"
      category="Linux"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const p = SYSTEMD_PRESETS.find(
                  (x) => x.name === e.target.value
                );
                if (p) setConfig(p.config);
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Systemd Service Preset...
              </option>
              {SYSTEMD_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground">
                Output View:
              </span>
              {(['unit', 'commands'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setOutputTab(tab)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    outputTab === tab
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {tab === 'unit'
                    ? `.service Unit File`
                    : `systemctl Setup Commands`}
                </button>
              ))}
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
            runLabel="Save Unit File"
            onLoadSample={() => setConfig(SYSTEMD_PRESETS[0].config)}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(activeOutput)}
            canCopy={Boolean(activeOutput)}
            onDownloadOutput={() =>
              downloadFile(
                activeOutput,
                outputTab === 'unit'
                  ? `${config.name || 'app'}.service`
                  : 'install-service.sh'
              )
            }
            canDownload={Boolean(activeOutput)}
          />
        </div>
      }
      statusArea={
        validation.isValid ? (
          <StatusArea
            status="success"
            message={`Unit: ${config.name}.service`}
            detail={`Type: ${config.serviceType} | Restart: ${config.restartPolicy}`}
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
          {/* [Unit] */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b border-border pb-2">
              <Cpu className="h-4 w-4 text-primary" />
              <span>[Unit] Section Metadata</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  Service Name (.service)
                </label>
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) =>
                    setConfig({ ...config, name: e.target.value })
                  }
                  placeholder="devforge-app"
                  className="w-full rounded border border-border bg-card px-2.5 py-1 font-mono text-xs font-bold text-primary"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  Description
                </label>
                <input
                  type="text"
                  value={config.description}
                  onChange={(e) =>
                    setConfig({ ...config, description: e.target.value })
                  }
                  placeholder="App Daemon Description"
                  className="w-full rounded border border-border bg-card px-2.5 py-1 text-xs text-foreground"
                />
              </div>
            </div>

            {/* After targets */}
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground">
                After Targets (wait for network/db)
              </label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={newAfterInput}
                  onChange={(e) => setNewAfterInput(e.target.value)}
                  placeholder="network.target or postgresql.service"
                  className="flex-1 rounded border border-border bg-card px-2.5 py-1 font-mono text-xs text-foreground"
                  onKeyDown={(e) => e.key === 'Enter' && addAfterTarget()}
                />
                <button
                  onClick={addAfterTarget}
                  className="rounded bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary"
                >
                  Add Target
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {config.afterTargets.map((t, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1 rounded bg-muted px-2 py-0.5 font-mono text-[11px] text-foreground"
                  >
                    <span>{t}</span>
                    <button
                      onClick={() => removeAfterTarget(idx)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* [Service] Exec & User */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b border-border pb-2">
              <span>[Service] Process Execution & Ownership</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  Service Type
                </label>
                <select
                  value={config.serviceType}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      serviceType: e.target.value as SystemdServiceType,
                    })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 text-xs font-bold text-foreground"
                >
                  <option value="simple">simple (Standard long-running daemon)</option>
                  <option value="oneshot">oneshot (One-time setup script)</option>
                  <option value="notify">notify (sd_notify ready signal)</option>
                  <option value="forking">forking (Forks background process)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  User
                </label>
                <input
                  type="text"
                  value={config.user}
                  onChange={(e) =>
                    setConfig({ ...config, user: e.target.value })
                  }
                  placeholder="www-data"
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  Group
                </label>
                <input
                  type="text"
                  value={config.group}
                  onChange={(e) =>
                    setConfig({ ...config, group: e.target.value })
                  }
                  placeholder="www-data"
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  Working Directory (WorkingDirectory=)
                </label>
                <input
                  type="text"
                  value={config.workingDirectory}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      workingDirectory: e.target.value,
                    })
                  }
                  placeholder="/var/www/devforge"
                  className="w-full rounded border border-border bg-card px-2.5 py-1 font-mono text-xs text-foreground"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  ExecStart Binary Command (Required)
                </label>
                <input
                  type="text"
                  value={config.execStart}
                  onChange={(e) =>
                    setConfig({ ...config, execStart: e.target.value })
                  }
                  placeholder="/usr/bin/node server.js"
                  className="w-full rounded border border-border bg-card px-2.5 py-1 font-mono text-xs font-bold text-primary"
                />
              </div>
            </div>

            {/* Restart policy & Security Hardening */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-border">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  Restart Policy
                </label>
                <select
                  value={config.restartPolicy}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      restartPolicy: e.target
                        .value as SystemdRestartPolicy,
                    })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 text-xs font-bold text-foreground"
                >
                  <option value="always">always</option>
                  <option value="on-failure">on-failure</option>
                  <option value="no">no</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.protectSystem}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        protectSystem: e.target.checked,
                      })
                    }
                    className="rounded border-border"
                  />
                  ProtectSystem=full
                </label>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.privateTmp}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        privateTmp: e.target.checked,
                      })
                    }
                    className="rounded border-border"
                  />
                  PrivateTmp=true
                </label>
              </div>
            </div>
          </div>

          {/* Environment Variables */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <span className="text-xs font-bold text-foreground">
              Environment Variables ({config.environmentVars.length})
            </span>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newEnvKey}
                onChange={(e) => setNewEnvKey(e.target.value)}
                placeholder="KEY (e.g. NODE_ENV)"
                className="w-36 rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
              />
              <input
                type="text"
                value={newEnvValue}
                onChange={(e) => setNewEnvValue(e.target.value)}
                placeholder="Value (e.g. production)"
                className="flex-1 rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                onKeyDown={(e) => e.key === 'Enter' && addEnvVar()}
              />
              <button
                onClick={addEnvVar}
                className="rounded bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary"
              >
                <Plus className="h-3.5 w-3.5 inline" /> Add
              </button>
            </div>

            <div className="space-y-1.5">
              {config.environmentVars.map((env, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded border border-border bg-card px-2.5 py-1 font-mono text-xs text-foreground"
                >
                  <span>
                    <strong className="text-primary">{env.key}</strong>=
                    {env.value}
                  </span>
                  <button
                    onClick={() => removeEnvVar(idx)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title={
            outputTab === 'unit'
              ? `${config.name || 'app'}.service`
              : 'systemctl Installation Commands'
          }
          value={activeOutput}
          language={outputTab === 'unit' ? 'ini' : 'bash'}
        />
      }
    />
  );
}
