'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  BookOpen,
  AlertCircle,
  Layers,
  FileCode2,
  Copy,
} from 'lucide-react';
import {
  generateDockerfile,
  validateDockerfile,
  suggestDockerignoreRules,
  DOCKERFILE_PRESETS,
  generateStepId,
  type DockerfileConfig,
  type InstructionType,
} from '@/lib/dockerfile-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

const INSTRUCTION_OPTIONS: InstructionType[] = [
  'WORKDIR',
  'COPY',
  'RUN',
  'ENV',
  'EXPOSE',
  'USER',
  'CMD',
  'ENTRYPOINT',
  'HEALTHCHECK',
];

export function DockerfileBuilderPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [config, setConfig] = useState<DockerfileConfig>(
    DOCKERFILE_PRESETS[0].config
  );
  const [showDockerignoreModal, setShowDockerignoreModal] = useState(false);

  const dockerfileOutput = useMemo(() => {
    return generateDockerfile(config);
  }, [config]);

  const validation = useMemo(() => {
    return validateDockerfile(config);
  }, [config]);

  const suggestedDockerignore = useMemo(() => {
    const primaryImage = config.stages[0]?.baseImage || 'node:20-alpine';
    return suggestDockerignoreRules(primaryImage);
  }, [config]);

  const handleLoadPreset = (presetName: string) => {
    const preset =
      DOCKERFILE_PRESETS.find((p) => p.name === presetName) ??
      DOCKERFILE_PRESETS[0];
    setConfig(preset.config);
    addHistoryItem('Dockerfile Builder Pro', `Loaded Preset: ${preset.name}`);
  };

  const handleRun = () => {
    addHistoryItem(
      'Dockerfile Builder Pro',
      `Generated Dockerfile (${config.stages.length} stages)`
    );
  };

  const handleClear = () => {
    setConfig({
      stages: [
        {
          id: 'stage_init',
          baseImage: 'node:20-alpine',
          steps: [],
        },
      ],
    });
  };

  const addStage = () => {
    setConfig((prev) => ({
      stages: [
        ...prev.stages,
        {
          id: `stage_${Date.now()}`,
          name: `stage_${prev.stages.length + 1}`,
          baseImage: 'alpine:latest',
          steps: [],
        },
      ],
    }));
  };

  const removeStage = (idx: number) => {
    setConfig((prev) => ({
      stages: prev.stages.filter((_, i) => i !== idx),
    }));
  };

  const addStep = (stageIndex: number, type: InstructionType) => {
    setConfig((prev) => {
      const nextStages = [...prev.stages];
      const stage = { ...nextStages[stageIndex] };
      stage.steps = [
        ...stage.steps,
        { id: generateStepId(), type, value: '' },
      ];
      nextStages[stageIndex] = stage;
      return { stages: nextStages };
    });
  };

  const removeStep = (stageIndex: number, stepIndex: number) => {
    setConfig((prev) => {
      const nextStages = [...prev.stages];
      const stage = { ...nextStages[stageIndex] };
      stage.steps = stage.steps.filter((_, i) => i !== stepIndex);
      nextStages[stageIndex] = stage;
      return { stages: nextStages };
    });
  };

  const updateStepValue = (
    stageIndex: number,
    stepIndex: number,
    val: string
  ) => {
    setConfig((prev) => {
      const nextStages = [...prev.stages];
      const stage = { ...nextStages[stageIndex] };
      const nextSteps = [...stage.steps];
      nextSteps[stepIndex] = { ...nextSteps[stepIndex], value: val };
      stage.steps = nextSteps;
      nextStages[stageIndex] = stage;
      return { stages: nextStages };
    });
  };

  return (
    <ToolPage
      title="Dockerfile Builder Pro"
      description="Visual multi-stage Dockerfile generator with live preview, security checks, and cross-tool .dockerignore suggestions"
      category="Docker"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          {/* Top Bar: Presets & Cross-tool helper */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <div className="flex items-center gap-2">
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                onChange={(e) => {
                  if (e.target.value) handleLoadPreset(e.target.value);
                }}
                className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
                defaultValue=""
              >
                <option value="" disabled>
                  Load Production Template...
                </option>
                {DOCKERFILE_PRESETS.map((preset) => (
                  <option key={preset.name} value={preset.name}>
                    {preset.name} — {preset.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDockerignoreModal(!showDockerignoreModal)}
                className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary transition-all hover:bg-primary/20"
              >
                <FileCode2 className="h-3.5 w-3.5" />
                <span>Suggest .dockerignore</span>
              </button>
              <button
                onClick={addStage}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add FROM Stage</span>
              </button>
            </div>
          </div>

          {/* Cross-Tool Suggested .dockerignore Drawer */}
          {showDockerignoreModal && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary">
                  Suggested .dockerignore Rules (Cross-Tool Integration)
                </span>
                <button
                  onClick={() => copyOutput(suggestedDockerignore.join('\n'))}
                  className="flex items-center gap-1 rounded bg-primary/20 px-2 py-0.5 text-[11px] font-bold text-primary hover:bg-primary/30"
                >
                  <Copy className="h-3 w-3" />
                  Copy Rules
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suggestedDockerignore.map((rule, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-background px-2 py-0.5 font-mono text-xs text-foreground border border-border"
                  >
                    {rule}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Validation Warnings */}
          {validation.warnings.length > 0 && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 space-y-1">
              {validation.warnings.map((warn, i) => (
                <div
                  key={i}
                  className="flex items-start gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium"
                >
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>{warn}</span>
                </div>
              ))}
            </div>
          )}

          <ToolToolbar
            onRun={handleRun}
            runLabel="Generate Dockerfile"
            onLoadSample={() =>
              handleLoadPreset('Next.js 15 Standalone Multi-Stage')
            }
            onClear={handleClear}
            onCopyOutput={() => copyOutput(dockerfileOutput)}
            canCopy={Boolean(dockerfileOutput)}
            onDownloadOutput={() => downloadFile(dockerfileOutput, 'Dockerfile')}
            canDownload={Boolean(dockerfileOutput)}
          />
        </div>
      }
      statusArea={
        validation.isValid ? (
          <StatusArea
            status="success"
            message={`Valid Dockerfile (${config.stages.length} stages)`}
            detail="Ready for production deployment"
          />
        ) : (
          <StatusArea
            status="error"
            message="Dockerfile Validation Error"
            detail={validation.errors[0] ?? 'Check stage configurations'}
          />
        )
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card/60">
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
            <span className="text-xs font-semibold text-foreground">
              Multi-Stage Builder
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
              {config.stages.length} Stages
            </span>
          </div>

          <div className="flex-1 overflow-auto p-3 space-y-4">
            {config.stages.map((stage, sIdx) => (
              <div
                key={stage.id}
                className="rounded-xl border border-border bg-background p-3 space-y-3"
              >
                {/* Stage Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold text-foreground">
                      Stage #{sIdx + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="Stage Name (optional, e.g. builder)"
                      value={stage.name ?? ''}
                      onChange={(e) => {
                        const next = [...config.stages];
                        next[sIdx] = {
                          ...stage,
                          name: e.target.value || undefined,
                        };
                        setConfig({ stages: next });
                      }}
                      className="w-36 rounded border border-border bg-card px-2 py-0.5 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      FROM:
                    </span>
                    <input
                      type="text"
                      value={stage.baseImage}
                      onChange={(e) => {
                        const next = [...config.stages];
                        next[sIdx] = { ...stage, baseImage: e.target.value };
                        setConfig({ stages: next });
                      }}
                      className="w-40 rounded border border-border bg-card px-2 py-0.5 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                    {config.stages.length > 1 && (
                      <button
                        onClick={() => removeStage(sIdx)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Instructions List */}
                <div className="space-y-1.5">
                  {stage.steps.map((step, stepIdx) => (
                    <div
                      key={step.id}
                      className="flex items-center gap-2 rounded-lg bg-card/60 p-1.5"
                    >
                      <span className="w-24 rounded bg-primary/10 px-2 py-0.5 text-center font-mono text-xs font-bold text-primary">
                        {step.type}
                      </span>
                      <input
                        type="text"
                        value={step.value}
                        onChange={(e) =>
                          updateStepValue(sIdx, stepIdx, e.target.value)
                        }
                        placeholder={`Value for ${step.type}`}
                        className="flex-1 rounded border border-border bg-background px-2.5 py-1 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                      />
                      <button
                        onClick={() => removeStep(sIdx, stepIdx)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Instruction Button Row */}
                <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-border/50">
                  <span className="text-[11px] font-semibold text-muted-foreground mr-1">
                    + Add Step:
                  </span>
                  {INSTRUCTION_OPTIONS.map((inst) => (
                    <button
                      key={inst}
                      onClick={() => addStep(sIdx, inst)}
                      className="rounded bg-muted px-2 py-0.5 font-mono text-[11px] font-bold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                    >
                      {inst}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title="Generated Dockerfile"
          value={dockerfileOutput}
          language="dockerfile"
        />
      }
    />
  );
}
