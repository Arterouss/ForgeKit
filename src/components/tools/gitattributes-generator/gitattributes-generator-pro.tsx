'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, AlertCircle, FileCode, HardDrive } from 'lucide-react';
import {
  generateGitAttributesContent,
  validateGitAttributesConfig,
  GITATTRIBUTES_PRESETS,
  generateGitAttributeRuleId,
  type GitAttributesConfig,
} from '@/lib/gitattributes-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function GitAttributesGeneratorPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [config, setConfig] = useState<GitAttributesConfig>(
    GITATTRIBUTES_PRESETS[0].config
  );
  const [newLfsExt, setNewLfsExt] = useState('');

  const output = useMemo(() => {
    return generateGitAttributesContent(config);
  }, [config]);

  const validation = useMemo(() => {
    return validateGitAttributesConfig(config);
  }, [config]);

  const handleRun = () => {
    addHistoryItem(
      '.gitattributes Generator',
      `Generated .gitattributes (${config.defaultLineEnding} EOL, ${config.lfsExtensions.length} LFS rules)`
    );
  };

  const handleClear = () => {
    setConfig({
      defaultLineEnding: 'lf',
      enableLfsRules: false,
      lfsExtensions: [],
      customRules: [],
    });
  };

  const addLfsExt = () => {
    if (!newLfsExt.trim()) return;
    const clean = newLfsExt.trim().replace(/^\./, '');
    if (!config.lfsExtensions.includes(clean)) {
      setConfig((prev) => ({
        ...prev,
        lfsExtensions: [...prev.lfsExtensions, clean],
      }));
    }
    setNewLfsExt('');
  };

  const removeLfsExt = (ext: string) => {
    setConfig((prev) => ({
      ...prev,
      lfsExtensions: prev.lfsExtensions.filter((x) => x !== ext),
    }));
  };

  const addCustomRule = () => {
    setConfig((prev) => ({
      ...prev,
      customRules: [
        ...prev.customRules,
        {
          id: generateGitAttributeRuleId(),
          pattern: '*.ext',
          attributes: 'text eol=lf',
          comment: 'Custom rule note',
        },
      ],
    }));
  };

  const removeCustomRule = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      customRules: prev.customRules.filter((r) => r.id !== id),
    }));
  };

  return (
    <ToolPage
      title=".gitattributes Generator"
      description="Visual builder for Git repository normalization covering line ending conversions (LF/CRLF), Git LFS large asset tracking, and GitHub Linguist stats override rules"
      category="Git"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const p = GITATTRIBUTES_PRESETS.find(
                  (x) => x.name === e.target.value
                );
                if (p) setConfig(p.config);
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load .gitattributes Preset...
              </option>
              {GITATTRIBUTES_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground">
                Default EOL:
              </span>
              {(
                [
                  'lf',
                  'crlf',
                  'auto',
                  'none',
                ] as GitAttributesConfig['defaultLineEnding'][]
              ).map((eol) => (
                <button
                  key={eol}
                  onClick={() =>
                    setConfig({ ...config, defaultLineEnding: eol })
                  }
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase transition-all ${
                    config.defaultLineEnding === eol
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {eol}
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
            runLabel="Generate .gitattributes"
            onLoadSample={() => setConfig(GITATTRIBUTES_PRESETS[0].config)}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(output)}
            canCopy={Boolean(output)}
            onDownloadOutput={() => downloadFile(output, '.gitattributes')}
            canDownload={Boolean(output)}
          />
        </div>
      }
      statusArea={
        validation.isValid ? (
          <StatusArea
            status="success"
            message={`EOL Normalization: ${config.defaultLineEnding.toUpperCase()}`}
            detail={`Git LFS: ${config.enableLfsRules ? 'Enabled' : 'Disabled'} (${config.lfsExtensions.length} patterns)`}
          />
        ) : (
          <StatusArea
            status="error"
            message="Configuration Error"
            detail={validation.errors[0] ?? 'Check rule patterns'}
          />
        )
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* Git LFS section */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <HardDrive className="h-4 w-4 text-primary" />
                <span>Git LFS (Large File Storage) Extensions</span>
              </div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableLfsRules}
                  onChange={(e) =>
                    setConfig({ ...config, enableLfsRules: e.target.checked })
                  }
                  className="rounded border-border"
                />
                Enable LFS Tracking
              </label>
            </div>

            {config.enableLfsRules && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newLfsExt}
                    onChange={(e) => setNewLfsExt(e.target.value)}
                    placeholder="Extension (e.g. psd, mp4, zip)"
                    className="w-48 rounded border border-border bg-card px-2.5 py-1 font-mono text-xs text-foreground"
                    onKeyDown={(e) => e.key === 'Enter' && addLfsExt()}
                  />
                  <button
                    onClick={addLfsExt}
                    className="rounded bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary"
                  >
                    Add Extension
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {config.lfsExtensions.map((ext) => (
                    <span
                      key={ext}
                      className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 font-mono text-xs font-bold text-foreground"
                    >
                      <span>*.{ext}</span>
                      <button
                        onClick={() => removeLfsExt(ext)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Custom & Linguist Rules */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-2">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <FileCode className="h-4 w-4 text-primary" />
                <span>Custom & GitHub Linguist Attribute Rules</span>
              </div>
              <button
                onClick={addCustomRule}
                className="flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary"
              >
                <Plus className="h-3 w-3" /> Add Custom Rule
              </button>
            </div>

            {config.customRules.map((rule, idx) => (
              <div
                key={rule.id}
                className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-lg border border-border bg-card p-2.5"
              >
                <input
                  type="text"
                  value={rule.pattern}
                  onChange={(e) => {
                    const next = [...config.customRules];
                    next[idx] = { ...rule, pattern: e.target.value };
                    setConfig({ ...config, customRules: next });
                  }}
                  placeholder="Pattern (e.g. *.bat)"
                  className="w-36 rounded border border-border bg-background px-2 py-1 font-mono text-xs font-bold text-primary"
                />

                <input
                  type="text"
                  value={rule.attributes}
                  onChange={(e) => {
                    const next = [...config.customRules];
                    next[idx] = { ...rule, attributes: e.target.value };
                    setConfig({ ...config, customRules: next });
                  }}
                  placeholder="Attributes (e.g. text eol=crlf)"
                  className="flex-1 rounded border border-border bg-background px-2 py-1 font-mono text-xs text-foreground"
                />

                <input
                  type="text"
                  value={rule.comment ?? ''}
                  onChange={(e) => {
                    const next = [...config.customRules];
                    next[idx] = { ...rule, comment: e.target.value };
                    setConfig({ ...config, customRules: next });
                  }}
                  placeholder="Comment..."
                  className="w-44 rounded border border-border bg-background px-2 py-1 text-xs text-muted-foreground"
                />

                <button
                  onClick={() => removeCustomRule(rule.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title="Generated .gitattributes Output"
          value={output}
          language="ini"
        />
      }
    />
  );
}
