'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, AlertCircle, Layers, Server, Globe } from 'lucide-react';
import {
  generateK8sManifest,
  validateK8sManifest,
  K8S_PRESETS,
  type K8sManifestConfig,
} from '@/lib/k8s-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function KubernetesBuilderPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [config, setConfig] = useState<K8sManifestConfig>(
    K8S_PRESETS[0].config
  );

  const output = useMemo(() => {
    return generateK8sManifest(config);
  }, [config]);

  const validation = useMemo(() => {
    return validateK8sManifest(config);
  }, [config]);

  const handleRun = () => {
    addHistoryItem(
      'Kubernetes Manifest Builder Pro',
      `Generated K8s Manifest (${config.deployment.name})`
    );
  };

  const handleClear = () => {
    setConfig({
      deployment: {
        name: 'my-app',
        namespace: 'default',
        replicas: 1,
        image: 'nginx:alpine',
        containerPort: 80,
        env: [],
      },
      service: {
        enabled: true,
        type: 'ClusterIP',
        port: 80,
        targetPort: 80,
      },
      ingress: {
        enabled: false,
        host: 'app.example.com',
        path: '/',
      },
    });
  };

  const addEnvVar = () => {
    setConfig((prev) => ({
      ...prev,
      deployment: {
        ...prev.deployment,
        env: [...prev.deployment.env, { name: 'KEY', value: 'value' }],
      },
    }));
  };

  const removeEnvVar = (idx: number) => {
    setConfig((prev) => ({
      ...prev,
      deployment: {
        ...prev.deployment,
        env: prev.deployment.env.filter((_, i) => i !== idx),
      },
    }));
  };

  const updateEnvVar = (idx: number, name: string, value: string) => {
    setConfig((prev) => {
      const nextEnv = [...prev.deployment.env];
      nextEnv[idx] = { name, value };
      return {
        ...prev,
        deployment: { ...prev.deployment, env: nextEnv },
      };
    });
  };

  return (
    <ToolPage
      title="Kubernetes Manifest Builder Pro"
      description="Visual Kubernetes Deployment, Service, and Ingress manifest generator with resource limits, TLS, and multi-document YAML export"
      category="DevOps"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const p = K8S_PRESETS.find((x) => x.name === e.target.value);
                if (p) setConfig(p.config);
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Kubernetes Architecture...
              </option>
              {K8S_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <input
                  type="checkbox"
                  checked={config.service.enabled}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      service: { ...config.service, enabled: e.target.checked },
                    })
                  }
                  className="rounded border-border"
                />
                Service
              </label>
              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <input
                  type="checkbox"
                  checked={config.ingress.enabled}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      ingress: { ...config.ingress, enabled: e.target.checked },
                    })
                  }
                  className="rounded border-border"
                />
                Ingress
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
            runLabel="Generate K8s YAML"
            onLoadSample={() => setConfig(K8S_PRESETS[0].config)}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(output)}
            canCopy={Boolean(output)}
            onDownloadOutput={() => downloadFile(output, 'k8s-manifest.yaml')}
            canDownload={Boolean(output)}
          />
        </div>
      }
      statusArea={
        validation.isValid ? (
          <StatusArea
            status="success"
            message={`Valid Manifest (${config.deployment.replicas} replicas)`}
            detail={`${[
              'Deployment',
              config.service.enabled ? 'Service' : '',
              config.ingress.enabled ? 'Ingress' : '',
            ]
              .filter(Boolean)
              .join(', ')} included`}
          />
        ) : (
          <StatusArea
            status="error"
            message="Configuration Error"
            detail={validation.errors[0] ?? 'Check deployment metadata'}
          />
        )
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-3 space-y-4">
          {/* Deployment Card */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="flex items-center gap-2 border-b border-border pb-2 text-xs font-bold text-foreground">
              <Layers className="h-4 w-4 text-primary" />
              <span>Deployment Configuration</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  App Name
                </label>
                <input
                  type="text"
                  value={config.deployment.name}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      deployment: { ...config.deployment, name: e.target.value },
                    })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Namespace
                </label>
                <input
                  type="text"
                  value={config.deployment.namespace}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      deployment: {
                        ...config.deployment,
                        namespace: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Container Image
                </label>
                <input
                  type="text"
                  value={config.deployment.image}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      deployment: {
                        ...config.deployment,
                        image: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Replicas
                </label>
                <input
                  type="number"
                  min="1"
                  value={config.deployment.replicas}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      deployment: {
                        ...config.deployment,
                        replicas: parseInt(e.target.value) || 1,
                      },
                    })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Container Port
                </label>
                <input
                  type="number"
                  value={config.deployment.containerPort}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      deployment: {
                        ...config.deployment,
                        containerPort: parseInt(e.target.value) || 80,
                      },
                    })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  CPU Limit
                </label>
                <input
                  type="text"
                  placeholder="500m"
                  value={config.deployment.cpuLimit ?? ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      deployment: {
                        ...config.deployment,
                        cpuLimit: e.target.value || undefined,
                      },
                    })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Memory Limit
                </label>
                <input
                  type="text"
                  placeholder="512Mi"
                  value={config.deployment.memoryLimit ?? ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      deployment: {
                        ...config.deployment,
                        memoryLimit: e.target.value || undefined,
                      },
                    })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Environment Variables */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-muted-foreground">
                  Environment Variables
                </span>
                <button
                  onClick={addEnvVar}
                  className="flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary"
                >
                  <Plus className="h-3 w-3" /> Add Env
                </button>
              </div>
              {config.deployment.env.map((env, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={env.name}
                    onChange={(e) => updateEnvVar(idx, e.target.value, env.value)}
                    placeholder="ENV_NAME"
                    className="w-36 rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                  />
                  <input
                    type="text"
                    value={env.value}
                    onChange={(e) => updateEnvVar(idx, env.name, e.target.value)}
                    placeholder="value"
                    className="flex-1 rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                  />
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

          {/* Service Card */}
          {config.service.enabled && (
            <div className="rounded-xl border border-border bg-background p-3 space-y-3">
              <div className="flex items-center gap-2 border-b border-border pb-2 text-xs font-bold text-foreground">
                <Server className="h-4 w-4 text-primary" />
                <span>Service Configuration</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    Type
                  </label>
                  <select
                    value={config.service.type}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        service: {
                          ...config.service,
                          type: e.target.value as
                            | 'ClusterIP'
                            | 'NodePort'
                            | 'LoadBalancer',
                        },
                      })
                    }
                    className="w-full rounded border border-border bg-card px-2 py-1 text-xs text-foreground focus:outline-none"
                  >
                    <option value="ClusterIP">ClusterIP</option>
                    <option value="NodePort">NodePort</option>
                    <option value="LoadBalancer">LoadBalancer</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    Service Port
                  </label>
                  <input
                    type="number"
                    value={config.service.port}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        service: {
                          ...config.service,
                          port: parseInt(e.target.value) || 80,
                        },
                      })
                    }
                    className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    Target Port
                  </label>
                  <input
                    type="number"
                    value={config.service.targetPort}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        service: {
                          ...config.service,
                          targetPort: parseInt(e.target.value) || 3000,
                        },
                      })
                    }
                    className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Ingress Card */}
          {config.ingress.enabled && (
            <div className="rounded-xl border border-border bg-background p-3 space-y-3">
              <div className="flex items-center gap-2 border-b border-border pb-2 text-xs font-bold text-foreground">
                <Globe className="h-4 w-4 text-primary" />
                <span>Ingress Configuration</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    Hostname
                  </label>
                  <input
                    type="text"
                    value={config.ingress.host}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        ingress: { ...config.ingress, host: e.target.value },
                      })
                    }
                    className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    Path
                  </label>
                  <input
                    type="text"
                    value={config.ingress.path}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        ingress: { ...config.ingress, path: e.target.value },
                      })
                    }
                    className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      }
      outputPanel={
        <OutputPanel
          title="Generated Kubernetes Manifest YAML"
          value={output}
          language="yaml"
        />
      }
    />
  );
}
