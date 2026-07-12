'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import {
  generateEnvContent,
  generateEnvExampleContent,
  validateEnvVariables,
  ENV_PRESETS,
  generateEnvId,
  type EnvVariable,
} from '@/lib/env-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function EnvBuilderPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [variables, setVariables] = useState<EnvVariable[]>(
    ENV_PRESETS[0].variables
  );
  const [outputMode, setOutputMode] = useState<'env' | 'example'>('env');

  const output = useMemo(() => {
    if (outputMode === 'example') {
      return generateEnvExampleContent(variables);
    }
    return generateEnvContent(variables);
  }, [variables, outputMode]);

  const validation = useMemo(() => {
    return validateEnvVariables(variables);
  }, [variables]);

  const addRow = () => {
    setVariables((prev) => [
      ...prev,
      { id: generateEnvId(), key: 'NEW_VAR', value: '', isSecret: false },
    ]);
  };

  const removeRow = (id: string) => {
    setVariables((prev) => prev.filter((v) => v.id !== id));
  };

  const updateRow = (id: string, partial: Partial<EnvVariable>) => {
    setVariables((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...partial } : v))
    );
  };

  const handleRun = () => {
    addHistoryItem(
      'Environment (.env) Builder Pro',
      `Generated .env (${variables.length} keys)`
    );
  };

  const handleClear = () => {
    setVariables([]);
  };

  return (
    <ToolPage
      title="Environment (.env) Builder Pro"
      description="Visual .env file editor with secret masking, .env.example generator, validation, and Docker Compose integration"
      category="DevOps"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <div className="flex items-center gap-2">
              <select
                onChange={(e) => {
                  const p = ENV_PRESETS.find((x) => x.name === e.target.value);
                  if (p) setVariables(p.variables);
                }}
                className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
                defaultValue=""
              >
                <option value="" disabled>
                  Load Preset...
                </option>
                {ENV_PRESETS.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setOutputMode(outputMode === 'env' ? 'example' : 'env')
                }
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                  outputMode === 'example'
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                    : 'bg-primary/10 text-primary border border-primary/20'
                }`}
              >
                {outputMode === 'example' ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" />
                    <span>Mode: .env.example (Safe Masked)</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    <span>Mode: Production .env</span>
                  </>
                )}
              </button>
              <button
                onClick={addRow}
                className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Key</span>
              </button>
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
            runLabel="Generate .env"
            onLoadSample={() => setVariables(ENV_PRESETS[0].variables)}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(output)}
            canCopy={Boolean(output)}
            onDownloadOutput={() =>
              downloadFile(output, outputMode === 'example' ? '.env.example' : '.env')
            }
            canDownload={Boolean(output)}
          />
        </div>
      }
      statusArea={
        validation.isValid ? (
          <StatusArea
            status="success"
            message={`Valid Environment Variables (${variables.length} keys)`}
            detail={`${variables.filter((v) => v.isSecret).length} secret keys marked`}
          />
        ) : (
          <StatusArea
            status="error"
            message="Validation Error"
            detail={validation.errors[0] ?? 'Check environment keys'}
          />
        )
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card/60">
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
            <span className="text-xs font-semibold text-foreground">
              Variable Editor
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
              {variables.length} Keys
            </span>
          </div>

          <div className="flex-1 overflow-auto p-3 space-y-2">
            {variables.map((v) => (
              <div
                key={v.id}
                className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-background p-2.5"
              >
                <input
                  type="text"
                  placeholder="KEY_NAME"
                  value={v.key}
                  onChange={(e) => updateRow(v.id, { key: e.target.value })}
                  className="w-40 rounded border border-border bg-card px-2.5 py-1 font-mono text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="value"
                  value={v.value}
                  onChange={(e) => updateRow(v.id, { value: e.target.value })}
                  className="flex-1 min-w-[140px] rounded border border-border bg-card px-2.5 py-1 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="# comment"
                  value={v.comment ?? ''}
                  onChange={(e) => updateRow(v.id, { comment: e.target.value })}
                  className="w-36 rounded border border-border bg-card px-2 py-1 text-xs text-muted-foreground focus:border-primary focus:outline-none"
                />
                <button
                  onClick={() => updateRow(v.id, { isSecret: !v.isSecret })}
                  title={v.isSecret ? 'Marked as Secret' : 'Public Value'}
                  className={`rounded px-2 py-1 text-[10px] font-bold transition-all ${
                    v.isSecret
                      ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {v.isSecret ? 'SECRET' : 'PUBLIC'}
                </button>
                <button
                  onClick={() => removeRow(v.id)}
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
          title={
            outputMode === 'example'
              ? 'Generated .env.example (Masked)'
              : 'Generated .env (Production)'
          }
          value={output}
          language="text"
        />
      }
    />
  );
}
