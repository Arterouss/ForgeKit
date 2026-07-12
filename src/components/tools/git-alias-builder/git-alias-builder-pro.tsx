'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, AlertCircle, Terminal } from 'lucide-react';
import {
  generateGitAliasOutput,
  validateGitAliasConfig,
  GIT_ALIAS_PRESETS,
  generateGitAliasId,
  type GitAliasConfig,
} from '@/lib/git-alias-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function GitAliasBuilderPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [config, setConfig] = useState<GitAliasConfig>(
    GIT_ALIAS_PRESETS[0].config
  );

  const output = useMemo(() => {
    return generateGitAliasOutput(config);
  }, [config]);

  const validation = useMemo(() => {
    return validateGitAliasConfig(config);
  }, [config]);

  const handleRun = () => {
    addHistoryItem(
      'Git Alias Builder',
      `Generated ${config.aliases.length} aliases (${config.outputFormat})`
    );
  };

  const handleClear = () => {
    setConfig({
      groupTitle: 'Custom Git Aliases',
      outputFormat: 'gitconfig',
      aliases: [
        {
          id: generateGitAliasId(),
          alias: 'st',
          command: 'status -sb',
          description: 'Short status',
        },
      ],
    });
  };

  const addAlias = () => {
    setConfig((prev) => ({
      ...prev,
      aliases: [
        ...prev.aliases,
        {
          id: generateGitAliasId(),
          alias: 'new',
          command: 'command --flag',
          description: 'Custom alias description',
        },
      ],
    }));
  };

  const removeAlias = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      aliases: prev.aliases.filter((r) => r.id !== id),
    }));
  };

  return (
    <ToolPage
      title="Git Alias Builder"
      description="Visual generator for Git terminal shortcuts supporting .gitconfig INI sections, global CLI setup commands, and shell bash/zsh aliases"
      category="Git"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const p = GIT_ALIAS_PRESETS.find(
                  (x) => x.name === e.target.value
                );
                if (p) setConfig(p.config);
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Git Alias Preset...
              </option>
              {GIT_ALIAS_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground">
                Format:
              </span>
              {(
                [
                  'gitconfig',
                  'cli-commands',
                  'shell-aliases',
                ] as GitAliasConfig['outputFormat'][]
              ).map((fmt) => (
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
            runLabel="Generate Aliases"
            onLoadSample={() => setConfig(GIT_ALIAS_PRESETS[0].config)}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(output)}
            canCopy={Boolean(output)}
            onDownloadOutput={() => downloadFile(output, 'git-aliases.txt')}
            canDownload={Boolean(output)}
          />
        </div>
      }
      statusArea={
        validation.isValid ? (
          <StatusArea
            status="success"
            message={`Active Rules: ${config.aliases.length} shortcuts`}
            detail={`Target: ${config.outputFormat}`}
          />
        ) : (
          <StatusArea
            status="error"
            message="Configuration Error"
            detail={validation.errors[0] ?? 'Check alias list'}
          />
        )
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          <div className="rounded-xl border border-border bg-background p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              <input
                type="text"
                value={config.groupTitle}
                onChange={(e) =>
                  setConfig({ ...config, groupTitle: e.target.value })
                }
                placeholder="Alias Collection Title"
                className="rounded border border-border bg-card px-2 py-1 text-xs font-bold text-foreground"
              />
            </div>
            <button
              onClick={addAlias}
              className="flex items-center gap-1 rounded bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary hover:bg-primary/20"
            >
              <Plus className="h-3.5 w-3.5" /> Add Shortcut
            </button>
          </div>

          <div className="space-y-2">
            {config.aliases.map((rule, idx) => (
              <div
                key={rule.id}
                className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-xl border border-border bg-background p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-muted-foreground">
                    #{idx + 1} git
                  </span>
                  <input
                    type="text"
                    value={rule.alias}
                    onChange={(e) => {
                      const next = [...config.aliases];
                      next[idx] = { ...rule, alias: e.target.value };
                      setConfig({ ...config, aliases: next });
                    }}
                    placeholder="st"
                    className="w-24 rounded border border-border bg-card px-2 py-1 font-mono text-xs font-bold text-primary"
                  />
                  <span className="text-xs font-bold text-muted-foreground">
                    =
                  </span>
                </div>

                <input
                  type="text"
                  value={rule.command}
                  onChange={(e) => {
                    const next = [...config.aliases];
                    next[idx] = { ...rule, command: e.target.value };
                    setConfig({ ...config, aliases: next });
                  }}
                  placeholder="status -sb"
                  className="flex-1 rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />

                <input
                  type="text"
                  value={rule.description}
                  onChange={(e) => {
                    const next = [...config.aliases];
                    next[idx] = { ...rule, description: e.target.value };
                    setConfig({ ...config, aliases: next });
                  }}
                  placeholder="Description..."
                  className="w-48 rounded border border-border bg-card px-2 py-1 text-xs text-muted-foreground"
                />

                <button
                  onClick={() => removeAlias(rule.id)}
                  className="text-muted-foreground hover:text-destructive p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title="Generated Git Aliases Output"
          value={output}
          language={config.outputFormat === 'gitconfig' ? 'ini' : 'bash'}
        />
      }
    />
  );
}
