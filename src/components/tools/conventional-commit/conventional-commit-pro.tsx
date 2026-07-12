'use client';

import { useState, useMemo } from 'react';
import { AlertCircle, GitCommit, AlertTriangle } from 'lucide-react';
import {
  generateConventionalCommit,
  validateConventionalCommit,
  COMMIT_TYPES,
  COMMIT_PRESETS,
  type ConventionalCommitConfig,
} from '@/lib/commit-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function ConventionalCommitPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [config, setConfig] = useState<ConventionalCommitConfig>(
    COMMIT_PRESETS[0].config
  );

  const output = useMemo(() => {
    return generateConventionalCommit(config);
  }, [config]);

  const gitCommandOutput = useMemo(() => {
    const escaped = output.replace(/"/g, '\\"');
    return `git commit -m "${escaped}"`;
  }, [output]);

  const validation = useMemo(() => {
    return validateConventionalCommit(config);
  }, [config]);

  const handleRun = () => {
    addHistoryItem(
      'Conventional Commit Assistant',
      `Generated Commit (${config.type}: ${config.subject})`
    );
  };

  const handleClear = () => {
    setConfig({
      type: 'feat',
      scope: '',
      subject: '',
      body: '',
      isBreakingChange: false,
      breakingChangeDescription: '',
      issueReference: '',
      includeEmoji: false,
    });
  };

  return (
    <ToolPage
      title="Conventional Commit Assistant"
      description="Interactive specification builder for standardized git commit messages with semantic versioning triggers, breaking change flags, and issue reference footers"
      category="Git"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const p = COMMIT_PRESETS.find((x) => x.name === e.target.value);
                if (p) setConfig(p.config);
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Commit Example...
              </option>
              {COMMIT_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeEmoji}
                  onChange={(e) =>
                    setConfig({ ...config, includeEmoji: e.target.checked })
                  }
                  className="rounded border-border"
                />
                Gitmoji Prefix
              </label>
              <label className="flex items-center gap-1.5 text-xs font-bold text-destructive cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.isBreakingChange}
                  onChange={(e) =>
                    setConfig({ ...config, isBreakingChange: e.target.checked })
                  }
                  className="rounded border-destructive"
                />
                Breaking Change (!)
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
            runLabel="Generate Commit Message"
            onLoadSample={() => setConfig(COMMIT_PRESETS[0].config)}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(output)}
            canCopy={Boolean(output)}
            onDownloadOutput={() => downloadFile(output, 'commit-msg.txt')}
            canDownload={Boolean(output)}
          />
        </div>
      }
      statusArea={
        validation.isValid ? (
          <StatusArea
            status="success"
            message={`Type: ${config.type.toUpperCase()} (${config.subject.length}/72 chars)`}
            detail={config.isBreakingChange ? 'MAJOR release trigger' : 'Standard commit'}
          />
        ) : (
          <StatusArea
            status="error"
            message="Configuration Error"
            detail={validation.errors[0] ?? 'Check commit subject'}
          />
        )
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* Type Selection Grid */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-2">
            <div className="flex items-center gap-2 border-b border-border pb-2 text-xs font-bold text-foreground">
              <GitCommit className="h-4 w-4 text-primary" />
              <span>Semantic Commit Type</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
              {COMMIT_TYPES.map((t) => (
                <button
                  key={t.type}
                  onClick={() => setConfig({ ...config, type: t.type })}
                  className={`flex flex-col items-start rounded-lg border p-2 text-left transition-all ${
                    config.type === t.type
                      ? 'border-primary bg-primary/10 text-foreground shadow-sm'
                      : 'border-border bg-card text-muted-foreground hover:bg-muted/60'
                  }`}
                >
                  <div className="flex items-center gap-1 text-xs font-bold">
                    <span>{t.emoji}</span>
                    <span>{t.type}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground line-clamp-1">
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Scope & Subject */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Scope (Optional, e.g. auth, api)
                </label>
                <input
                  type="text"
                  value={config.scope ?? ''}
                  onChange={(e) =>
                    setConfig({ ...config, scope: e.target.value })
                  }
                  placeholder="auth"
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
              </div>
              <div className="col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    Subject Description (Imperative mood)
                  </label>
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      config.subject.length > 72
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {config.subject.length} / 72
                  </span>
                </div>
                <input
                  type="text"
                  value={config.subject}
                  onChange={(e) =>
                    setConfig({ ...config, subject: e.target.value })
                  }
                  placeholder="add JWT Token Decoder Pro visual inspection tool"
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">
                Commit Body (Detailed explanation of motivation / changes)
              </label>
              <textarea
                value={config.body ?? ''}
                onChange={(e) =>
                  setConfig({ ...config, body: e.target.value })
                }
                rows={3}
                placeholder="Explain what and why vs. how..."
                className="w-full rounded border border-border bg-card p-2 text-xs text-foreground"
              />
            </div>

            {config.isBreakingChange && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span>BREAKING CHANGE Explanation</span>
                </div>
                <textarea
                  value={config.breakingChangeDescription ?? ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      breakingChangeDescription: e.target.value,
                    })
                  }
                  rows={2}
                  placeholder="Describe migration steps or API contract changes..."
                  className="w-full rounded border border-border bg-background p-2 text-xs text-foreground"
                />
              </div>
            )}

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">
                Issue Reference / Footers (e.g., Closes #104, Ref #200)
              </label>
              <input
                type="text"
                value={config.issueReference ?? ''}
                onChange={(e) =>
                  setConfig({ ...config, issueReference: e.target.value })
                }
                placeholder="Closes #104"
                className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
              />
            </div>
          </div>
        </div>
      }
      outputPanel={
        <div className="flex h-full flex-col gap-4">
          <OutputPanel
            title="Conventional Commit Message"
            value={output}
            language="markdown"
          />
          <div className="rounded-xl border border-border bg-card/60 p-3">
            <span className="text-xs font-bold text-muted-foreground block mb-1">
              Terminal Command Ready
            </span>
            <code className="block rounded bg-muted px-3 py-2 font-mono text-xs text-foreground overflow-x-auto">
              {gitCommandOutput}
            </code>
          </div>
        </div>
      }
    />
  );
}
