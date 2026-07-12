'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, AlertCircle, Cpu } from 'lucide-react';
import {
  generateDockerRunCommand,
  validateDockerRunConfig,
  DOCKER_RUN_PRESETS,
  type DockerRunConfig,
} from '@/lib/docker-run-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function DockerRunBuilderPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [config, setConfig] = useState<DockerRunConfig>(
    DOCKER_RUN_PRESETS[0].config
  );

  const output = useMemo(() => {
    return generateDockerRunCommand(config);
  }, [config]);

  const validation = useMemo(() => {
    return validateDockerRunConfig(config);
  }, [config]);

  const handleRun = () => {
    addHistoryItem(
      'Docker Run Command Builder Pro',
      `Generated Command (${config.image}:${config.tag})`
    );
  };

  const handleClear = () => {
    setConfig({
      containerName: 'my-container',
      image: 'nginx',
      tag: 'alpine',
      detach: true,
      interactiveTty: false,
      removeOnExit: false,
      restartPolicy: 'unless-stopped',
      ports: [{ hostPort: 8080, containerPort: 80 }],
      volumes: [],
      env: [],
    });
  };

  const addPort = () => {
    setConfig((prev) => ({
      ...prev,
      ports: [...prev.ports, { hostPort: 3000, containerPort: 3000 }],
    }));
  };

  const removePort = (idx: number) => {
    setConfig((prev) => ({
      ...prev,
      ports: prev.ports.filter((_, i) => i !== idx),
    }));
  };

  const addEnv = () => {
    setConfig((prev) => ({
      ...prev,
      env: [...prev.env, { key: 'KEY', value: 'value' }],
    }));
  };

  const removeEnv = (idx: number) => {
    setConfig((prev) => ({
      ...prev,
      env: prev.env.filter((_, i) => i !== idx),
    }));
  };

  return (
    <ToolPage
      title="Docker Run Command Builder Pro"
      description="Visual docker run CLI command generator with volume mounts, environment flags, interactive mode, and Docker Compose import support"
      category="Docker"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const p = DOCKER_RUN_PRESETS.find(
                  (x) => x.name === e.target.value
                );
                if (p) setConfig(p.config);
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Docker Run Preset...
              </option>
              {DOCKER_RUN_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.detach}
                  onChange={(e) =>
                    setConfig({ ...config, detach: e.target.checked })
                  }
                  className="rounded border-border"
                />
                Detach (-d)
              </label>
              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.interactiveTty}
                  onChange={(e) =>
                    setConfig({ ...config, interactiveTty: e.target.checked })
                  }
                  className="rounded border-border"
                />
                Interactive (-it)
              </label>
              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.removeOnExit}
                  onChange={(e) =>
                    setConfig({ ...config, removeOnExit: e.target.checked })
                  }
                  className="rounded border-border"
                />
                Auto-Remove (--rm)
              </label>
            </div>
          </div>

          {validation.warnings.length > 0 && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 space-y-1">
              {validation.warnings.map((warn, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{warn}</span>
                </div>
              ))}
            </div>
          )}

          <ToolToolbar
            onRun={handleRun}
            runLabel="Generate CLI Command"
            onLoadSample={() => setConfig(DOCKER_RUN_PRESETS[0].config)}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(output)}
            canCopy={Boolean(output)}
            onDownloadOutput={() => downloadFile(output, 'run-docker.sh')}
            canDownload={Boolean(output)}
          />
        </div>
      }
      statusArea={
        validation.isValid ? (
          <StatusArea
            status="success"
            message={`Container: ${config.containerName || 'anonymous'}`}
            detail={`Image: ${config.image}:${config.tag}`}
          />
        ) : (
          <StatusArea
            status="error"
            message="Configuration Error"
            detail={validation.errors[0] ?? 'Check repository image'}
          />
        )
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="flex items-center gap-2 border-b border-border pb-2 text-xs font-bold text-foreground">
              <Cpu className="h-4 w-4 text-primary" />
              <span>Container Image & Identity</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Container Name (--name)
                </label>
                <input
                  type="text"
                  value={config.containerName}
                  onChange={(e) =>
                    setConfig({ ...config, containerName: e.target.value })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Image Repository
                </label>
                <input
                  type="text"
                  value={config.image}
                  onChange={(e) =>
                    setConfig({ ...config, image: e.target.value })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Tag / Version
                </label>
                <input
                  type="text"
                  value={config.tag}
                  onChange={(e) => setConfig({ ...config, tag: e.target.value })}
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Restart Policy (--restart)
                </label>
                <select
                  value={config.restartPolicy}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      restartPolicy: e.target.value as
                        | 'no'
                        | 'always'
                        | 'unless-stopped'
                        | 'on-failure',
                    })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 text-xs text-foreground focus:outline-none"
                >
                  <option value="no">no</option>
                  <option value="always">always</option>
                  <option value="unless-stopped">unless-stopped</option>
                  <option value="on-failure">on-failure</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Network (--network)
                </label>
                <input
                  type="text"
                  placeholder="bridge / host / custom-net"
                  value={config.network ?? ''}
                  onChange={(e) =>
                    setConfig({ ...config, network: e.target.value })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Port Mappings */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-2">
            <div className="flex items-center justify-between border-b border-border pb-1.5">
              <span className="text-xs font-bold text-foreground">
                Port Mappings (-p host:container)
              </span>
              <button
                onClick={addPort}
                className="flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary"
              >
                <Plus className="h-3 w-3" /> Add Port
              </button>
            </div>
            {config.ports.map((port, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Host Port"
                  value={port.hostPort}
                  onChange={(e) => {
                    const next = [...config.ports];
                    next[idx] = {
                      ...port,
                      hostPort: parseInt(e.target.value) || 80,
                    };
                    setConfig({ ...config, ports: next });
                  }}
                  className="w-32 rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
                <span className="text-xs font-bold text-muted-foreground">
                  :
                </span>
                <input
                  type="number"
                  placeholder="Container Port"
                  value={port.containerPort}
                  onChange={(e) => {
                    const next = [...config.ports];
                    next[idx] = {
                      ...port,
                      containerPort: parseInt(e.target.value) || 80,
                    };
                    setConfig({ ...config, ports: next });
                  }}
                  className="w-32 rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
                <button
                  onClick={() => removePort(idx)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Environment Variables */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-2">
            <div className="flex items-center justify-between border-b border-border pb-1.5">
              <span className="text-xs font-bold text-foreground">
                Environment Flags (-e KEY=val)
              </span>
              <button
                onClick={addEnv}
                className="flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary"
              >
                <Plus className="h-3 w-3" /> Add Env
              </button>
            </div>
            {config.env.map((env, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="KEY"
                  value={env.key}
                  onChange={(e) => {
                    const next = [...config.env];
                    next[idx] = { ...env, key: e.target.value };
                    setConfig({ ...config, env: next });
                  }}
                  className="w-36 rounded border border-border bg-card px-2 py-1 font-mono text-xs font-bold text-foreground"
                />
                <input
                  type="text"
                  placeholder="value"
                  value={env.value}
                  onChange={(e) => {
                    const next = [...config.env];
                    next[idx] = { ...env, value: e.target.value };
                    setConfig({ ...config, env: next });
                  }}
                  className="flex-1 rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
                <button
                  onClick={() => removeEnv(idx)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title="Generated Docker Run Command"
          value={output}
          language="bash"
        />
      }
    />
  );
}
