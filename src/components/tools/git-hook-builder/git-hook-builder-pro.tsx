'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, AlertCircle, ShieldCheck, Terminal } from 'lucide-react';
import {
  generateGitHookOutput,
  generateHookInstallCommands,
  validateHuskyConfig,
  HUSKY_PRESETS,
  generateGitHookRuleId,
  type HuskyConfig,
  type GitHookRule,
  type GitHookRunner,
} from '@/lib/husky-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function GitHookBuilderPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [config, setConfig] = useState<HuskyConfig>(HUSKY_PRESETS[0].config);

  const output = useMemo(() => {
    return generateGitHookOutput(config);
  }, [config]);

  const installCmds = useMemo(() => {
    return generateHookInstallCommands(config);
  }, [config]);

  const validation = useMemo(() => {
    return validateHuskyConfig(config);
  }, [config]);

  const handleRun = () => {
    addHistoryItem(
      'Git Hook Builder',
      `Generated ${config.runner} hooks (${config.hooks.filter((h) => h.enabled).length} active)`
    );
  };

  const handleClear = () => {
    setConfig({
      runner: 'husky-v9',
      packageManager: 'pnpm',
      hooks: [
        {
          id: generateGitHookRuleId(),
          hookType: 'pre-commit',
          command: 'pnpm lint',
          enabled: true,
          comment: 'Run ESLint',
        },
      ],
    });
  };

  const addHookRule = () => {
    setConfig((prev) => ({
      ...prev,
      hooks: [
        ...prev.hooks,
        {
          id: generateGitHookRuleId(),
          hookType: 'pre-commit',
          command: 'npm test',
          enabled: true,
          comment: 'Custom hook step',
        },
      ],
    }));
  };

  const removeHookRule = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      hooks: prev.hooks.filter((h) => h.id !== id),
    }));
  };

  return (
    <ToolPage
      title="Git Hook Builder"
      description="Interactive generator for Husky v9+, Lefthook YAML workflows, and raw git hook scripts covering pre-commit linting, commit-msg checks, and pre-push validation"
      category="Git"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const p = HUSKY_PRESETS.find((x) => x.name === e.target.value);
                if (p) setConfig(p.config);
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Git Hook Preset...
              </option>
              {HUSKY_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-muted-foreground">
                  Runner:
                </span>
                {(
                  [
                    'husky-v9',
                    'lefthook',
                    'raw-shell',
                  ] as GitHookRunner[]
                ).map((r) => (
                  <button
                    key={r}
                    onClick={() => setConfig({ ...config, runner: r })}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                      config.runner === r
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 border-l border-border pl-3">
                <span className="text-xs font-bold text-muted-foreground">
                  PM:
                </span>
                {(
                  ['pnpm', 'npm', 'yarn', 'bun'] as HuskyConfig['packageManager'][]
                ).map((pm) => (
                  <button
                    key={pm}
                    onClick={() => setConfig({ ...config, packageManager: pm })}
                    className={`rounded px-2 py-0.5 text-[11px] font-bold transition-all ${
                      config.packageManager === pm
                        ? 'bg-primary/20 text-primary border border-primary/40'
                        : 'bg-card text-muted-foreground border border-border'
                    }`}
                  >
                    {pm}
                  </button>
                ))}
              </div>
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
            runLabel="Generate Hooks"
            onLoadSample={() => setConfig(HUSKY_PRESETS[0].config)}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(output)}
            canCopy={Boolean(output)}
            onDownloadOutput={() =>
              downloadFile(
                output,
                config.runner === 'lefthook' ? 'lefthook.yml' : 'pre-commit'
              )
            }
            canDownload={Boolean(output)}
          />
        </div>
      }
      statusArea={
        validation.isValid ? (
          <StatusArea
            status="success"
            message={`Engine: ${config.runner.toUpperCase()} (${config.hooks.filter((h) => h.enabled).length} active hooks)`}
            detail={`Package Manager: ${config.packageManager}`}
          />
        ) : (
          <StatusArea
            status="error"
            message="Configuration Error"
            detail={validation.errors[0] ?? 'Check hook commands'}
          />
        )
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          <div className="rounded-xl border border-border bg-background p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-foreground">
                Git Lifecycle Rules
              </span>
            </div>
            <button
              onClick={addHookRule}
              className="flex items-center gap-1 rounded bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary hover:bg-primary/20"
            >
              <Plus className="h-3.5 w-3.5" /> Add Hook Step
            </button>
          </div>

          <div className="space-y-2">
            {config.hooks.map((rule, idx) => (
              <div
                key={rule.id}
                className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-xl border border-border bg-background p-3"
              >
                <input
                  type="checkbox"
                  checked={rule.enabled}
                  onChange={(e) => {
                    const next = [...config.hooks];
                    next[idx] = { ...rule, enabled: e.target.checked };
                    setConfig({ ...config, hooks: next });
                  }}
                  className="rounded border-border cursor-pointer"
                />

                <select
                  value={rule.hookType}
                  onChange={(e) => {
                    const next = [...config.hooks];
                    next[idx] = {
                      ...rule,
                      hookType: e.target.value as GitHookRule['hookType'],
                    };
                    setConfig({ ...config, hooks: next });
                  }}
                  className="rounded border border-border bg-card px-2 py-1 text-xs font-bold text-foreground"
                >
                  <option value="pre-commit">pre-commit</option>
                  <option value="commit-msg">commit-msg</option>
                  <option value="pre-push">pre-push</option>
                </select>

                <input
                  type="text"
                  value={rule.command}
                  onChange={(e) => {
                    const next = [...config.hooks];
                    next[idx] = { ...rule, command: e.target.value };
                    setConfig({ ...config, hooks: next });
                  }}
                  placeholder="npx lint-staged"
                  className="flex-1 rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />

                <input
                  type="text"
                  value={rule.comment ?? ''}
                  onChange={(e) => {
                    const next = [...config.hooks];
                    next[idx] = { ...rule, comment: e.target.value };
                    setConfig({ ...config, hooks: next });
                  }}
                  placeholder="Comment / note..."
                  className="w-44 rounded border border-border bg-card px-2 py-1 text-xs text-muted-foreground"
                />

                <button
                  onClick={() => removeHookRule(rule.id)}
                  className="text-muted-foreground hover:text-destructive p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-background p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Terminal className="h-3.5 w-3.5 text-primary" />
              <span>One-Time Setup Command ({config.packageManager})</span>
            </div>
            <pre className="rounded bg-muted p-2.5 font-mono text-xs text-foreground overflow-x-auto">
              {installCmds}
            </pre>
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title={`Generated ${config.runner} Output`}
          value={output}
          language={config.runner === 'lefthook' ? 'yaml' : 'bash'}
        />
      }
    />
  );
}
