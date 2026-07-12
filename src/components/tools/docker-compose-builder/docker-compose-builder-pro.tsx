'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Plus,
  Trash2,
  BookOpen,
  AlertCircle,
  Container,
} from 'lucide-react';
import {
  createEmptyService,
  generateComposeYaml,
  validateComposeProject,
  DOCKER_PRESETS,
  type DockerService,
  type DockerComposeProject,
} from '@/lib/docker-compose-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

function ServiceCard({
  service,
  allServiceNames,
  onUpdate,
  onRemove,
}: {
  service: DockerService;
  allServiceNames: string[];
  onUpdate: (updated: DockerService) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  const updateField = <K extends keyof DockerService>(
    key: K,
    value: DockerService[K]
  ) => {
    onUpdate({ ...service, [key]: value });
  };

  return (
    <div className="rounded-xl border border-border bg-card/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-muted/40 px-3 py-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-xs font-bold text-foreground"
        >
          <Container className="h-4 w-4 text-primary" />
          <span>{service.name || 'unnamed-service'}</span>
          {service.image && (
            <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[11px] text-primary">
              {service.image}
            </span>
          )}
        </button>
        <button
          onClick={onRemove}
          className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
          title="Remove Service"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {expanded && (
        <div className="space-y-3 p-3 text-xs">
          {/* Name & Image */}
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1">
              <span className="font-semibold text-muted-foreground">Service Name</span>
              <input
                type="text"
                value={service.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-muted-foreground">Docker Image</span>
              <input
                type="text"
                value={service.image}
                onChange={(e) => updateField('image', e.target.value)}
                placeholder="e.g. postgres:16-alpine"
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </label>
          </div>

          {/* Build Context & Container Name */}
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1">
              <span className="font-semibold text-muted-foreground">Build Context (optional)</span>
              <input
                type="text"
                value={service.buildContext ?? ''}
                onChange={(e) => updateField('buildContext', e.target.value || undefined)}
                placeholder="e.g. . or ./backend"
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-muted-foreground">Restart Policy</span>
              <select
                value={service.restartPolicy}
                onChange={(e) =>
                  updateField(
                    'restartPolicy',
                    e.target.value as DockerService['restartPolicy']
                  )
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
              >
                <option value="no">no</option>
                <option value="always">always</option>
                <option value="on-failure">on-failure</option>
                <option value="unless-stopped">unless-stopped</option>
              </select>
            </label>
          </div>

          {/* Ports */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-muted-foreground">
                Port Mappings ({service.ports.length})
              </span>
              <button
                onClick={() =>
                  updateField('ports', [
                    ...service.ports,
                    { host: '', container: '' },
                  ])
                }
                className="rounded-md px-2 py-0.5 text-[11px] font-semibold text-primary hover:bg-primary/10"
              >
                + Add Port
              </button>
            </div>
            {service.ports.map((port, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={port.host}
                  onChange={(e) => {
                    const updated = [...service.ports];
                    updated[idx] = { ...port, host: e.target.value };
                    updateField('ports', updated);
                  }}
                  placeholder="Host"
                  className="w-20 rounded border border-border bg-background px-2 py-1 font-mono text-[11px] text-foreground focus:border-primary focus:outline-none"
                />
                <span className="text-muted-foreground">:</span>
                <input
                  type="text"
                  value={port.container}
                  onChange={(e) => {
                    const updated = [...service.ports];
                    updated[idx] = { ...port, container: e.target.value };
                    updateField('ports', updated);
                  }}
                  placeholder="Container"
                  className="w-20 rounded border border-border bg-background px-2 py-1 font-mono text-[11px] text-foreground focus:border-primary focus:outline-none"
                />
                <button
                  onClick={() => {
                    const updated = service.ports.filter((_, i) => i !== idx);
                    updateField('ports', updated);
                  }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Environment Variables */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-muted-foreground">
                Environment Variables ({service.environment.length})
              </span>
              <button
                onClick={() =>
                  updateField('environment', [
                    ...service.environment,
                    { key: '', value: '' },
                  ])
                }
                className="rounded-md px-2 py-0.5 text-[11px] font-semibold text-primary hover:bg-primary/10"
              >
                + Add Env
              </button>
            </div>
            {service.environment.map((env, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={env.key}
                  onChange={(e) => {
                    const updated = [...service.environment];
                    updated[idx] = { ...env, key: e.target.value };
                    updateField('environment', updated);
                  }}
                  placeholder="KEY"
                  className="w-32 rounded border border-border bg-background px-2 py-1 font-mono text-[11px] text-foreground focus:border-primary focus:outline-none"
                />
                <span className="text-muted-foreground">=</span>
                <input
                  type="text"
                  value={env.value}
                  onChange={(e) => {
                    const updated = [...service.environment];
                    updated[idx] = { ...env, value: e.target.value };
                    updateField('environment', updated);
                  }}
                  placeholder="value"
                  className="flex-1 rounded border border-border bg-background px-2 py-1 font-mono text-[11px] text-foreground focus:border-primary focus:outline-none"
                />
                <button
                  onClick={() => {
                    const updated = service.environment.filter((_, i) => i !== idx);
                    updateField('environment', updated);
                  }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Volumes */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-muted-foreground">
                Volume Mounts ({service.volumes.length})
              </span>
              <button
                onClick={() =>
                  updateField('volumes', [
                    ...service.volumes,
                    { source: '', target: '' },
                  ])
                }
                className="rounded-md px-2 py-0.5 text-[11px] font-semibold text-primary hover:bg-primary/10"
              >
                + Add Volume
              </button>
            </div>
            {service.volumes.map((vol, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={vol.source}
                  onChange={(e) => {
                    const updated = [...service.volumes];
                    updated[idx] = { ...vol, source: e.target.value };
                    updateField('volumes', updated);
                  }}
                  placeholder="Source"
                  className="flex-1 rounded border border-border bg-background px-2 py-1 font-mono text-[11px] text-foreground focus:border-primary focus:outline-none"
                />
                <span className="text-muted-foreground">:</span>
                <input
                  type="text"
                  value={vol.target}
                  onChange={(e) => {
                    const updated = [...service.volumes];
                    updated[idx] = { ...vol, target: e.target.value };
                    updateField('volumes', updated);
                  }}
                  placeholder="Target"
                  className="flex-1 rounded border border-border bg-background px-2 py-1 font-mono text-[11px] text-foreground focus:border-primary focus:outline-none"
                />
                <button
                  onClick={() => {
                    const updated = service.volumes.filter((_, i) => i !== idx);
                    updateField('volumes', updated);
                  }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Depends On */}
          <div className="space-y-1.5">
            <span className="font-semibold text-muted-foreground">
              Depends On
            </span>
            <div className="flex flex-wrap gap-1.5">
              {allServiceNames
                .filter((n) => n !== service.name)
                .map((name) => {
                  const isSelected = service.dependsOn.includes(name);
                  return (
                    <button
                      key={name}
                      onClick={() => {
                        if (isSelected) {
                          updateField(
                            'dependsOn',
                            service.dependsOn.filter((d) => d !== name)
                          );
                        } else {
                          updateField('dependsOn', [...service.dependsOn, name]);
                        }
                      }}
                      className={`rounded-md px-2.5 py-0.5 font-mono text-[11px] font-bold transition-all ${
                        isSelected
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              {allServiceNames.filter((n) => n !== service.name).length === 0 && (
                <span className="text-[11px] italic text-muted-foreground">
                  Add more services to enable dependency linking
                </span>
              )}
            </div>
          </div>

          {/* Command */}
          <label className="space-y-1 block">
            <span className="font-semibold text-muted-foreground">Command (optional)</span>
            <input
              type="text"
              value={service.command ?? ''}
              onChange={(e) => updateField('command', e.target.value || undefined)}
              placeholder="e.g. npm run start"
              className="w-full rounded-lg border border-border bg-background px-3 py-1.5 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </label>
        </div>
      )}
    </div>
  );
}

export function DockerComposeBuilderPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [project, setProject] = useState<DockerComposeProject>({
    version: '3.8',
    services: DOCKER_PRESETS[0].services,
    globalNetworks: [],
    globalVolumes: ['pgdata'],
  });

  const yamlOutput = useMemo(() => {
    return generateComposeYaml(project);
  }, [project]);

  const validation = useMemo(() => {
    return validateComposeProject(project);
  }, [project]);

  const serviceNames = project.services.map((s) => s.name);

  const updateService = useCallback(
    (index: number, updated: DockerService) => {
      setProject((prev) => {
        const services = [...prev.services];
        services[index] = updated;
        return { ...prev, services };
      });
    },
    []
  );

  const removeService = useCallback((index: number) => {
    setProject((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  }, []);

  const addService = () => {
    const svc = createEmptyService(`service${project.services.length + 1}`);
    setProject((prev) => ({
      ...prev,
      services: [...prev.services, svc],
    }));
  };

  const handleLoadPreset = (presetName: string) => {
    const preset =
      DOCKER_PRESETS.find((p) => p.name === presetName) ?? DOCKER_PRESETS[0];
    setProject({
      version: '3.8',
      services: preset.services,
      globalNetworks: [],
      globalVolumes: [],
    });
    addHistoryItem('Docker Compose Builder', `Loaded Preset: ${preset.name}`);
  };

  const handleRun = () => {
    addHistoryItem(
      'Docker Compose Builder',
      `Generated docker-compose.yml (${project.services.length} services)`
    );
  };

  const handleClear = () => {
    setProject({
      version: '3.8',
      services: [],
      globalNetworks: [],
      globalVolumes: [],
    });
  };

  return (
    <ToolPage
      title="Docker Compose Builder Pro"
      description="Visual Docker Compose builder with live YAML generation, validation, and production-ready templates"
      category="Docker"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          {/* Preset & Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <div className="flex items-center gap-2">
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                onChange={(e) => {
                  if (e.target.value) handleLoadPreset(e.target.value);
                }}
                className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none"
                defaultValue=""
              >
                <option value="" disabled>
                  Load Template...
                </option>
                {DOCKER_PRESETS.map((preset) => (
                  <option key={preset.name} value={preset.name}>
                    {preset.name} — {preset.description}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={addService}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Service
            </button>
          </div>

          {/* Validation Summary */}
          {(validation.errors.length > 0 || validation.warnings.length > 0) && (
            <div className="rounded-xl border border-border bg-card/60 p-2.5 space-y-1.5">
              {validation.errors.map((err, idx) => (
                <div
                  key={`err-${idx}`}
                  className="flex items-start gap-1.5 text-xs text-destructive"
                >
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>{err}</span>
                </div>
              ))}
              {validation.warnings.map((warn, idx) => (
                <div
                  key={`warn-${idx}`}
                  className="flex items-start gap-1.5 text-xs text-amber-500"
                >
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>{warn}</span>
                </div>
              ))}
            </div>
          )}

          <ToolToolbar
            onRun={handleRun}
            runLabel="Generate docker-compose.yml"
            onLoadSample={() => handleLoadPreset('Next.js + PostgreSQL')}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(yamlOutput)}
            canCopy={Boolean(yamlOutput)}
            onDownloadOutput={() =>
              downloadFile(yamlOutput, 'docker-compose.yml')
            }
            canDownload={Boolean(yamlOutput)}
          />
        </div>
      }
      statusArea={
        validation.isValid ? (
          <StatusArea
            status="success"
            message={`Valid Docker Compose (${project.services.length} services)`}
            detail="Ready to download docker-compose.yml"
          />
        ) : (
          <StatusArea
            status="error"
            message="Docker Compose Validation Error"
            detail={validation.errors[0] ?? 'Check service configurations'}
          />
        )
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card/60">
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
            <span className="text-xs font-semibold text-foreground">
              Visual Service Builder
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
              {project.services.length} Services
            </span>
          </div>

          <div className="flex-1 overflow-auto p-3 space-y-3">
            {project.services.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground text-xs italic">
                <Container className="h-8 w-8 mb-2 opacity-30" />
                No services defined. Click &quot;Add Service&quot; or load a template.
              </div>
            ) : (
              project.services.map((svc, idx) => (
                <ServiceCard
                  key={svc.id}
                  service={svc}
                  allServiceNames={serviceNames}
                  onUpdate={(updated) => updateService(idx, updated)}
                  onRemove={() => removeService(idx)}
                />
              ))
            )}
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title="Generated docker-compose.yml"
          value={yamlOutput}
          language="yaml"
        />
      }
    />
  );
}
