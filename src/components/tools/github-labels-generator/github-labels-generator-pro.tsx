'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, AlertCircle, Tag } from 'lucide-react';
import {
  generateGitHubLabelsOutput,
  validateGitHubLabelsConfig,
  normalizeHexColor,
  GITHUB_LABELS_PRESETS,
  generateGitHubLabelId,
  type GitHubLabelsConfig,
  type LabelsOutputFormat,
} from '@/lib/github-labels-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function GitHubLabelsGeneratorPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [config, setConfig] = useState<GitHubLabelsConfig>(
    GITHUB_LABELS_PRESETS[0].config
  );

  const output = useMemo(() => {
    return generateGitHubLabelsOutput(config);
  }, [config]);

  const validation = useMemo(() => {
    return validateGitHubLabelsConfig(config);
  }, [config]);

  const handleRun = () => {
    addHistoryItem(
      'GitHub Labels Generator',
      `Generated ${config.labels.length} labels (${config.outputFormat})`
    );
  };

  const handleClear = () => {
    setConfig({
      repoOwner: 'owner',
      repoName: 'repo',
      outputFormat: 'gh-cli',
      labels: [
        {
          id: generateGitHubLabelId(),
          name: 'bug',
          color: 'd73a4a',
          description: "Something isn't working",
        },
      ],
    });
  };

  const addLabel = () => {
    setConfig((prev) => ({
      ...prev,
      labels: [
        ...prev.labels,
        {
          id: generateGitHubLabelId(),
          name: 'new-label',
          color: '0e8a16',
          description: 'Label description',
        },
      ],
    }));
  };

  const removeLabel = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      labels: prev.labels.filter((l) => l.id !== id),
    }));
  };

  return (
    <ToolPage
      title="GitHub Labels Generator"
      description="Visual builder for repository issue & PR labels with hex color previews, exporting to GitHub CLI script commands, JSON arrays, or YAML configs"
      category="Git"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const p = GITHUB_LABELS_PRESETS.find(
                  (x) => x.name === e.target.value
                );
                if (p) setConfig(p.config);
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load GitHub Labels Preset...
              </option>
              {GITHUB_LABELS_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground">
                Format:
              </span>
              {(['gh-cli', 'json', 'yaml'] as LabelsOutputFormat[]).map(
                (fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setConfig({ ...config, outputFormat: fmt })}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                      config.outputFormat === fmt
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {fmt}
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
            runLabel="Generate Labels"
            onLoadSample={() => setConfig(GITHUB_LABELS_PRESETS[0].config)}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(output)}
            canCopy={Boolean(output)}
            onDownloadOutput={() =>
              downloadFile(
                output,
                config.outputFormat === 'json'
                  ? 'labels.json'
                  : config.outputFormat === 'yaml'
                    ? 'labels.yml'
                    : 'create-labels.sh'
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
            message={`Target Repo: ${config.repoOwner}/${config.repoName}`}
            detail={`Total Labels: ${config.labels.length}`}
          />
        ) : (
          <StatusArea
            status="error"
            message="Configuration Error"
            detail={validation.errors[0] ?? 'Check label names'}
          />
        )
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          <div className="rounded-xl border border-border bg-background p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              <input
                type="text"
                value={config.repoOwner}
                onChange={(e) =>
                  setConfig({ ...config, repoOwner: e.target.value })
                }
                placeholder="Owner"
                className="w-28 rounded border border-border bg-card px-2 py-1 font-mono text-xs font-bold text-foreground"
              />
              <span className="text-muted-foreground font-bold">/</span>
              <input
                type="text"
                value={config.repoName}
                onChange={(e) =>
                  setConfig({ ...config, repoName: e.target.value })
                }
                placeholder="RepoName"
                className="w-32 rounded border border-border bg-card px-2 py-1 font-mono text-xs font-bold text-foreground"
              />
            </div>
            <button
              onClick={addLabel}
              className="flex items-center gap-1 rounded bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary hover:bg-primary/20"
            >
              <Plus className="h-3.5 w-3.5" /> Add Label
            </button>
          </div>

          <div className="space-y-2">
            {config.labels.map((label, idx) => {
              const cleanHex = normalizeHexColor(label.color);
              const isValidColor = /^[0-9a-f]{6}$/i.test(cleanHex);

              return (
                <div
                  key={label.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-xl border border-border bg-background p-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-5 w-5 rounded-full border border-border shrink-0"
                      style={{
                        backgroundColor: isValidColor
                          ? `#${cleanHex}`
                          : '#cccccc',
                      }}
                    />
                    <div className="flex items-center">
                      <span className="text-muted-foreground text-xs font-mono">
                        #
                      </span>
                      <input
                        type="text"
                        value={label.color}
                        onChange={(e) => {
                          const next = [...config.labels];
                          next[idx] = { ...label, color: e.target.value };
                          setConfig({ ...config, labels: next });
                        }}
                        maxLength={7}
                        placeholder="d73a4a"
                        className="w-16 rounded border border-border bg-card px-1.5 py-0.5 font-mono text-xs text-foreground"
                      />
                    </div>
                  </div>

                  <input
                    type="text"
                    value={label.name}
                    onChange={(e) => {
                      const next = [...config.labels];
                      next[idx] = { ...label, name: e.target.value };
                      setConfig({ ...config, labels: next });
                    }}
                    placeholder="Label name..."
                    className="w-44 rounded border border-border bg-card px-2 py-1 text-xs font-bold text-foreground"
                  />

                  <input
                    type="text"
                    value={label.description}
                    onChange={(e) => {
                      const next = [...config.labels];
                      next[idx] = { ...label, description: e.target.value };
                      setConfig({ ...config, labels: next });
                    }}
                    placeholder="Description..."
                    className="flex-1 rounded border border-border bg-card px-2 py-1 text-xs text-muted-foreground"
                  />

                  <button
                    onClick={() => removeLabel(label.id)}
                    className="text-muted-foreground hover:text-destructive p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title={`Generated Labels Output (${config.outputFormat})`}
          value={output}
          language={
            config.outputFormat === 'json'
              ? 'json'
              : config.outputFormat === 'yaml'
                ? 'yaml'
                : 'bash'
          }
        />
      }
    />
  );
}
