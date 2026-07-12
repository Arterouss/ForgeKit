'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, AlertCircle, FileText, Sparkles } from 'lucide-react';
import {
  generateReadmeContent,
  validateReadmeConfig,
  README_PRESETS,
  type ReadmeConfig,
} from '@/lib/readme-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function ReadmeGeneratorPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [config, setConfig] = useState<ReadmeConfig>(README_PRESETS[0].config);

  const output = useMemo(() => {
    return generateReadmeContent(config);
  }, [config]);

  const validation = useMemo(() => {
    return validateReadmeConfig(config);
  }, [config]);

  const handleRun = () => {
    addHistoryItem(
      'README Generator Pro',
      `Generated README (${config.projectName})`
    );
  };

  const handleClear = () => {
    setConfig({
      projectName: 'My Project',
      tagline: 'A modern web application',
      githubRepo: 'username/repo',
      includeBadges: true,
      includeToc: true,
      features: [],
      techStack: ['TypeScript'],
      installCommand: 'npm install',
      devCommand: 'npm run dev',
      contributingEnabled: true,
      license: 'MIT',
    });
  };

  const addFeature = () => {
    setConfig((prev) => ({
      ...prev,
      features: [
        ...prev.features,
        { title: 'New Feature', description: 'Feature description...' },
      ],
    }));
  };

  const removeFeature = (idx: number) => {
    setConfig((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx),
    }));
  };

  return (
    <ToolPage
      title="README Generator Pro"
      description="Visual README.md document builder with dynamic Shields.io badges, features list, tech stack badges, and table of contents"
      category="Git"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const p = README_PRESETS.find((x) => x.name === e.target.value);
                if (p) setConfig(p.config);
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load README Template...
              </option>
              {README_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeBadges}
                  onChange={(e) =>
                    setConfig({ ...config, includeBadges: e.target.checked })
                  }
                  className="rounded border-border"
                />
                Shields.io Badges
              </label>
              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeToc}
                  onChange={(e) =>
                    setConfig({ ...config, includeToc: e.target.checked })
                  }
                  className="rounded border-border"
                />
                Table of Contents
              </label>
              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.contributingEnabled}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      contributingEnabled: e.target.checked,
                    })
                  }
                  className="rounded border-border"
                />
                Contributing Section
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
            runLabel="Generate README.md"
            onLoadSample={() => setConfig(README_PRESETS[0].config)}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(output)}
            canCopy={Boolean(output)}
            onDownloadOutput={() => downloadFile(output, 'README.md')}
            canDownload={Boolean(output)}
          />
        </div>
      }
      statusArea={
        validation.isValid ? (
          <StatusArea
            status="success"
            message={`README formatted (${config.features.length} features)`}
            detail={`License: ${config.license}`}
          />
        ) : (
          <StatusArea
            status="error"
            message="Configuration Error"
            detail={validation.errors[0] ?? 'Check project name'}
          />
        )
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="flex items-center gap-2 border-b border-border pb-2 text-xs font-bold text-foreground">
              <FileText className="h-4 w-4 text-primary" />
              <span>Project Identity & Badges</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Project Name
                </label>
                <input
                  type="text"
                  value={config.projectName}
                  onChange={(e) =>
                    setConfig({ ...config, projectName: e.target.value })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  GitHub Repository (owner/repo)
                </label>
                <input
                  type="text"
                  value={config.githubRepo}
                  onChange={(e) =>
                    setConfig({ ...config, githubRepo: e.target.value })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">
                Tagline / Subtitle
              </label>
              <input
                type="text"
                value={config.tagline}
                onChange={(e) =>
                  setConfig({ ...config, tagline: e.target.value })
                }
                className="w-full rounded border border-border bg-card px-2 py-1 text-xs text-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  value={config.techStack.join(', ')}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      techStack: e.target.value
                        .split(',')
                        .map((x) => x.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  License
                </label>
                <input
                  type="text"
                  value={config.license}
                  onChange={(e) =>
                    setConfig({ ...config, license: e.target.value })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-2">
            <div className="flex items-center justify-between border-b border-border pb-1.5">
              <span className="text-xs font-bold text-foreground">
                Key Features List
              </span>
              <button
                onClick={addFeature}
                className="flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary"
              >
                <Plus className="h-3 w-3" /> Add Feature
              </button>
            </div>
            {config.features.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-lg border border-border bg-card p-2"
              >
                <input
                  type="text"
                  value={feat.title}
                  onChange={(e) => {
                    const next = [...config.features];
                    next[idx] = { ...feat, title: e.target.value };
                    setConfig({ ...config, features: next });
                  }}
                  placeholder="Feature Title"
                  className="w-44 rounded border border-border bg-background px-2 py-1 text-xs font-bold text-foreground"
                />
                <input
                  type="text"
                  value={feat.description}
                  onChange={(e) => {
                    const next = [...config.features];
                    next[idx] = { ...feat, description: e.target.value };
                    setConfig({ ...config, features: next });
                  }}
                  placeholder="Feature description..."
                  className="flex-1 rounded border border-border bg-background px-2 py-1 text-xs text-foreground"
                />
                <button
                  onClick={() => removeFeature(idx)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Setup & Commands */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="flex items-center gap-2 border-b border-border pb-2 text-xs font-bold text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Getting Started & Usage Code block</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Install Command
                </label>
                <input
                  type="text"
                  value={config.installCommand}
                  onChange={(e) =>
                    setConfig({ ...config, installCommand: e.target.value })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Dev Server Command
                </label>
                <input
                  type="text"
                  value={config.devCommand}
                  onChange={(e) =>
                    setConfig({ ...config, devCommand: e.target.value })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground">
                Usage Code Block (Optional)
              </label>
              <textarea
                value={config.usageExample ?? ''}
                onChange={(e) =>
                  setConfig({ ...config, usageExample: e.target.value })
                }
                rows={3}
                placeholder="import { fn } from 'pkg'; ..."
                className="w-full rounded border border-border bg-card p-2 font-mono text-xs text-foreground"
              />
            </div>
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title="Generated README.md"
          value={output}
          language="markdown"
        />
      }
    />
  );
}
