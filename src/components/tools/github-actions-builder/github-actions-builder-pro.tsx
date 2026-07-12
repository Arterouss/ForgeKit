'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, AlertCircle, Play, GitBranch } from 'lucide-react';
import {
  generateGitHubActionsWorkflow,
  validateGitHubActionsWorkflow,
  GITHUB_ACTIONS_PRESETS,
  generateWorkflowStepId,
  type GitHubActionsConfig,
  type WorkflowTrigger,
} from '@/lib/github-actions-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function GitHubActionsBuilderPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [config, setConfig] = useState<GitHubActionsConfig>(
    GITHUB_ACTIONS_PRESETS[0].config
  );

  const output = useMemo(() => {
    return generateGitHubActionsWorkflow(config);
  }, [config]);

  const validation = useMemo(() => {
    return validateGitHubActionsWorkflow(config);
  }, [config]);

  const handleRun = () => {
    addHistoryItem(
      'GitHub Actions Workflow Builder Pro',
      `Generated Workflow (${config.workflowName})`
    );
  };

  const handleClear = () => {
    setConfig({
      workflowName: 'Custom CI/CD',
      triggers: ['push'],
      branches: ['main'],
      jobs: [
        {
          id: 'build',
          name: 'Build Job',
          runsOn: 'ubuntu-latest',
          steps: [
            {
              id: generateWorkflowStepId(),
              name: 'Checkout code',
              uses: 'actions/checkout@v4',
            },
          ],
        },
      ],
    });
  };

  const toggleTrigger = (trigger: WorkflowTrigger) => {
    setConfig((prev) => {
      const exists = prev.triggers.includes(trigger);
      return {
        ...prev,
        triggers: exists
          ? prev.triggers.filter((t) => t !== trigger)
          : [...prev.triggers, trigger],
      };
    });
  };

  const addStep = (jobIndex: number) => {
    setConfig((prev) => {
      const nextJobs = [...prev.jobs];
      nextJobs[jobIndex] = {
        ...nextJobs[jobIndex],
        steps: [
          ...nextJobs[jobIndex].steps,
          {
            id: generateWorkflowStepId(),
            name: 'Run custom command',
            run: 'echo "Hello World"',
          },
        ],
      };
      return { ...prev, jobs: nextJobs };
    });
  };

  const removeStep = (jobIndex: number, stepId: string) => {
    setConfig((prev) => {
      const nextJobs = [...prev.jobs];
      nextJobs[jobIndex] = {
        ...nextJobs[jobIndex],
        steps: nextJobs[jobIndex].steps.filter((s) => s.id !== stepId),
      };
      return { ...prev, jobs: nextJobs };
    });
  };

  return (
    <ToolPage
      title="GitHub Actions Workflow Builder Pro"
      description="Visual CI/CD workflow generator with automated Docker build/push integration, multi-branch triggers, and step matrix builder"
      category="DevOps"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const p = GITHUB_ACTIONS_PRESETS.find(
                  (x) => x.name === e.target.value
                );
                if (p) setConfig(p.config);
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load CI/CD Pipeline Preset...
              </option>
              {GITHUB_ACTIONS_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              {(['push', 'pull_request', 'workflow_dispatch'] as WorkflowTrigger[]).map(
                (trig) => (
                  <button
                    key={trig}
                    onClick={() => toggleTrigger(trig)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                      config.triggers.includes(trig)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {trig}
                  </button>
                )
              )}
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
            runLabel="Generate Workflow YAML"
            onLoadSample={() => setConfig(GITHUB_ACTIONS_PRESETS[0].config)}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(output)}
            canCopy={Boolean(output)}
            onDownloadOutput={() => downloadFile(output, 'ci.yml')}
            canDownload={Boolean(output)}
          />
        </div>
      }
      statusArea={
        validation.isValid ? (
          <StatusArea
            status="success"
            message={`Workflow: ${config.workflowName} (${config.jobs.length} jobs)`}
            detail={`Triggers: ${config.triggers.join(', ')}`}
          />
        ) : (
          <StatusArea
            status="error"
            message="Configuration Error"
            detail={validation.errors[0] ?? 'Check workflow structure'}
          />
        )
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="flex items-center gap-2 border-b border-border pb-2 text-xs font-bold text-foreground">
              <Play className="h-4 w-4 text-primary" />
              <span>Workflow Metadata</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Workflow Name
                </label>
                <input
                  type="text"
                  value={config.workflowName}
                  onChange={(e) =>
                    setConfig({ ...config, workflowName: e.target.value })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Target Branches (comma separated)
                </label>
                <input
                  type="text"
                  value={config.branches.join(', ')}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      branches: e.target.value
                        .split(',')
                        .map((b) => b.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
              </div>
            </div>
          </div>

          {config.jobs.map((job, jobIdx) => (
            <div
              key={job.id}
              className="rounded-xl border border-border bg-background p-3 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <GitBranch className="h-4 w-4 text-primary" />
                  <span>
                    Job #{jobIdx + 1}: {job.name} ({job.runsOn})
                  </span>
                </div>
                <button
                  onClick={() => addStep(jobIdx)}
                  className="flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary"
                >
                  <Plus className="h-3 w-3" /> Add Step
                </button>
              </div>

              <div className="space-y-2">
                {job.steps.map((step) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-2 rounded-lg border border-border bg-card p-2"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-muted-foreground">
                          STEP NAME:
                        </span>
                        <input
                          type="text"
                          value={step.name}
                          onChange={(e) => {
                            const nextJobs = [...config.jobs];
                            const stepIdx = nextJobs[jobIdx].steps.findIndex(
                              (s) => s.id === step.id
                            );
                            if (stepIdx !== -1) {
                              nextJobs[jobIdx].steps[stepIdx].name =
                                e.target.value;
                              setConfig({ ...config, jobs: nextJobs });
                            }
                          }}
                          className="w-48 rounded border border-border bg-background px-2 py-0.5 font-mono text-xs text-foreground"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-muted-foreground">
                          {step.uses ? 'USES:' : 'RUN:'}
                        </span>
                        <input
                          type="text"
                          value={step.uses ?? step.run ?? ''}
                          onChange={(e) => {
                            const nextJobs = [...config.jobs];
                            const stepIdx = nextJobs[jobIdx].steps.findIndex(
                              (s) => s.id === step.id
                            );
                            if (stepIdx !== -1) {
                              if (step.uses) {
                                nextJobs[jobIdx].steps[stepIdx].uses =
                                  e.target.value;
                              } else {
                                nextJobs[jobIdx].steps[stepIdx].run =
                                  e.target.value;
                              }
                              setConfig({ ...config, jobs: nextJobs });
                            }
                          }}
                          className="flex-1 rounded border border-border bg-background px-2 py-0.5 font-mono text-xs text-foreground"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeStep(jobIdx, step.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      }
      outputPanel={
        <OutputPanel
          title="Generated GitHub Actions Workflow YAML"
          value={output}
          language="yaml"
        />
      }
    />
  );
}
