'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, Terminal, Shield, Sliders } from 'lucide-react';
import {
  generateBashScript,
  BASH_PRESETS,
  type BashScriptConfig,
} from '@/lib/bash-script-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function BashScriptGeneratorPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [config, setConfig] = useState<BashScriptConfig>(
    BASH_PRESETS[0].config
  );
  const [newArgName, setNewArgName] = useState('');
  const [newArgFlag, setNewArgFlag] = useState('');
  const [newArgDesc, setNewArgDesc] = useState('');
  const [newArgDefault, setNewArgDefault] = useState('');

  const output = useMemo(() => {
    return generateBashScript(config);
  }, [config]);

  const handleRun = () => {
    addHistoryItem(
      'Bash Script Generator',
      `Generated script: ${config.scriptName || 'script.sh'}`
    );
  };

  const handleClear = () => {
    setConfig({
      scriptName: 'script.sh',
      description: 'Custom Bash Script',
      shebang: '#!/usr/bin/env bash',
      strictMode: true,
      includeColors: true,
      includeLoggers: true,
      includeTrap: true,
      trapCleanupCommand: 'rm -rf /tmp/staging.*',
      includeArgParser: true,
      arguments: [],
      customBody: 'log_info "Script execution started..."',
    });
  };

  const addArgument = () => {
    if (!newArgName.trim() || !newArgFlag.trim()) return;
    setConfig((prev) => ({
      ...prev,
      arguments: [
        ...prev.arguments,
        {
          name: newArgName.trim(),
          flag: newArgFlag.trim(),
          description: newArgDesc.trim() || 'CLI argument option',
          defaultValue: newArgDefault.trim(),
        },
      ],
    }));
    setNewArgName('');
    setNewArgFlag('');
    setNewArgDesc('');
    setNewArgDefault('');
  };

  const removeArgument = (idx: number) => {
    setConfig((prev) => ({
      ...prev,
      arguments: prev.arguments.filter((_, i) => i !== idx),
    }));
  };

  return (
    <ToolPage
      title="Bash Script Generator"
      description="Interactive generator for production-grade Linux Bash scripts with strict mode (set -euo pipefail), ANSI logging helpers, trap cleanup handlers, and CLI flag parsers"
      category="Linux"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const preset = BASH_PRESETS.find(
                  (p) => p.name === e.target.value
                );
                if (preset) setConfig(preset.config);
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Bash Script Preset...
              </option>
              {BASH_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.strictMode}
                  onChange={(e) =>
                    setConfig({ ...config, strictMode: e.target.checked })
                  }
                  className="rounded border-border"
                />
                Strict Mode (set -euo pipefail)
              </label>

              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeLoggers}
                  onChange={(e) =>
                    setConfig({ ...config, includeLoggers: e.target.checked })
                  }
                  className="rounded border-border"
                />
                Logger Functions
              </label>

              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeTrap}
                  onChange={(e) =>
                    setConfig({ ...config, includeTrap: e.target.checked })
                  }
                  className="rounded border-border"
                />
                Exit Cleanup Trap
              </label>
            </div>
          </div>

          <ToolToolbar
            onRun={handleRun}
            runLabel="Save Script"
            onLoadSample={() => setConfig(BASH_PRESETS[0].config)}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(output)}
            canCopy={Boolean(output)}
            onDownloadOutput={() =>
              downloadFile(output, config.scriptName || 'script.sh')
            }
            canDownload={Boolean(output)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status="success"
          message={`Script: ${config.scriptName}`}
          detail={`Shebang: ${config.shebang} | CLI Args: ${config.arguments.length}`}
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* Metadata */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b border-border pb-2">
              <Terminal className="h-4 w-4 text-primary" />
              <span>Script Header & Interpreter</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  Script File Name (.sh)
                </label>
                <input
                  type="text"
                  value={config.scriptName}
                  onChange={(e) =>
                    setConfig({ ...config, scriptName: e.target.value })
                  }
                  placeholder="deploy.sh"
                  className="w-full rounded border border-border bg-card px-2.5 py-1 font-mono text-xs font-bold text-primary"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  Shebang Interpreter
                </label>
                <select
                  value={config.shebang}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      shebang: e.target.value as
                        | '#!/usr/bin/env bash'
                        | '#!/bin/bash',
                    })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                >
                  <option value="#!/usr/bin/env bash">
                    #!/usr/bin/env bash (Portable)
                  </option>
                  <option value="#!/bin/bash">
                    #!/bin/bash (Absolute Path)
                  </option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  Description
                </label>
                <input
                  type="text"
                  value={config.description}
                  onChange={(e) =>
                    setConfig({ ...config, description: e.target.value })
                  }
                  placeholder="Automated Deployment Script"
                  className="w-full rounded border border-border bg-card px-2.5 py-1 text-xs text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Boilerplate & Trap Configuration */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b border-border pb-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>Safety & Cleanup Configuration</span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeColors}
                  onChange={(e) =>
                    setConfig({ ...config, includeColors: e.target.checked })
                  }
                  className="rounded border-border"
                />
                Include ANSI Color Constants
              </label>

              <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeArgParser}
                  onChange={(e) =>
                    setConfig({ ...config, includeArgParser: e.target.checked })
                  }
                  className="rounded border-border"
                />
                Include CLI Argument Parser
              </label>
            </div>

            {config.includeTrap && (
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  Cleanup Command on Exit (trap cleanup EXIT INT TERM)
                </label>
                <input
                  type="text"
                  value={config.trapCleanupCommand}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      trapCleanupCommand: e.target.value,
                    })
                  }
                  placeholder="rm -rf /tmp/deploy-staging.*"
                  className="w-full rounded border border-border bg-card px-2.5 py-1.5 font-mono text-xs text-foreground"
                />
              </div>
            )}
          </div>

          {/* CLI Arguments */}
          {config.includeArgParser && (
            <div className="rounded-xl border border-border bg-background p-3 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b border-border pb-2">
                <Sliders className="h-4 w-4 text-primary" />
                <span>CLI Arguments ({config.arguments.length})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                <input
                  type="text"
                  value={newArgName}
                  onChange={(e) => setNewArgName(e.target.value)}
                  placeholder="Var (e.g. environment)"
                  className="rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
                <input
                  type="text"
                  value={newArgFlag}
                  onChange={(e) => setNewArgFlag(e.target.value)}
                  placeholder="Flag (e.g. --env)"
                  className="rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
                <input
                  type="text"
                  value={newArgDesc}
                  onChange={(e) => setNewArgDesc(e.target.value)}
                  placeholder="Description"
                  className="rounded border border-border bg-card px-2 py-1 text-xs text-foreground"
                />
                <input
                  type="text"
                  value={newArgDefault}
                  onChange={(e) => setNewArgDefault(e.target.value)}
                  placeholder="Default value"
                  className="rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
                <button
                  onClick={addArgument}
                  className="rounded bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary"
                >
                  <Plus className="h-3.5 w-3.5 inline" /> Add Flag
                </button>
              </div>

              <div className="space-y-1.5">
                {config.arguments.map((arg, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded border border-border bg-card px-2.5 py-1.5 font-mono text-xs text-foreground"
                  >
                    <div>
                      <strong className="text-primary">{arg.flag}</strong> →{' '}
                      <span className="font-bold">{arg.name.toUpperCase()}</span>{' '}
                      (Default: {arg.defaultValue || 'none'}) —{' '}
                      <span className="text-muted-foreground font-sans">
                        {arg.description}
                      </span>
                    </div>
                    <button
                      onClick={() => removeArgument(idx)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Script Body */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-2 flex-1 flex flex-col">
            <span className="text-xs font-bold text-foreground">
              Main Execution Body (main() function)
            </span>
            <textarea
              rows={8}
              value={config.customBody}
              onChange={(e) =>
                setConfig({ ...config, customBody: e.target.value })
              }
              placeholder="log_info &quot;Running script tasks...&quot;"
              className="w-full flex-1 rounded border border-border bg-card p-3 font-mono text-xs text-foreground focus:outline-none"
            />
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title={`Generated Script: ${config.scriptName}`}
          value={output}
          language="bash"
        />
      }
    />
  );
}
