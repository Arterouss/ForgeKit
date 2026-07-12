'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  formatJson,
  minifyJson,
  validateJson,
  SAMPLE_JSON,
} from '@/lib/json-utils';
import {
  ToolPage,
  ToolToolbar,
  InputPanel,
  OutputPanel,
  StatusArea,
  StatusAreaType,
} from '@/components/tools';
import { JsonTreeView } from './json-tree-view';
import { useWorkspace } from '@/components/workspace';

export type JsonMode = 'beautify' | 'minify' | 'tree';
export type IndentOption = 2 | 4 | 'tab';

export function JsonFormatterPro() {
  const { addHistoryItem } = useWorkspace();

  const [input, setInput] = useState<string>(SAMPLE_JSON);
  const [mode, setMode] = useState<JsonMode>('beautify');
  const [indent, setIndent] = useState<IndentOption>(2);

  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [executionTimeMs, setExecutionTimeMs] = useState<number | null>(null);

  // Validate live on input change
  const validationResult = useMemo(() => {
    if (!input.trim()) return { isValid: true, error: null };
    return validateJson(input);
  }, [input]);

  const runFormat = useCallback(() => {
    const startTime = performance.now();
    let result: { output: string; error: string | null };

    if (mode === 'minify') {
      result = minifyJson(input);
    } else {
      result = formatJson(input, indent);
    }

    const duration = Math.round((performance.now() - startTime) * 10) / 10;
    setExecutionTimeMs(duration);

    if (result.error) {
      setError(result.error);
      setOutput('');
    } else {
      setError(null);
      setOutput(result.output);

      // Log action to workspace history
      addHistoryItem(
        'JSON Formatter Pro',
        `${mode === 'minify' ? 'Minified' : 'Formatted'} JSON (${indent} spaces)`
      );
    }
  }, [input, mode, indent, addHistoryItem]);

  const handleLoadSample = () => {
    setInput(SAMPLE_JSON);
    setError(null);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
    setExecutionTimeMs(null);
  };

  const handleUploadInput = (fileContent: string) => {
    setInput(fileContent);
  };

  // Determine status notification
  const statusInfo = useMemo<{
    status: StatusAreaType;
    message: string;
    detail: string | null;
  }>(() => {
    if (!input.trim()) {
      return {
        status: 'info',
        message: 'Ready for input',
        detail: 'Paste or upload a JSON document to format, minify, or inspect in tree view.',
      };
    }
    if (!validationResult.isValid) {
      return {
        status: 'error',
        message: 'Invalid JSON syntax detected',
        detail: validationResult.error,
      };
    }
    if (output) {
      return {
        status: 'success',
        message: `${mode === 'minify' ? 'Minified' : 'Formatted'} successfully`,
        detail: `Completed in ${executionTimeMs} ms without errors.`,
      };
    }
    return {
      status: 'idle',
      message: '',
      detail: null,
    };
  }, [input, validationResult, output, mode, executionTimeMs]);

  const downloadOutput = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPage
      title="JSON Formatter Pro"
      description="Format, validate, minify, and inspect complex JSON structures with interactive tree navigation"
      category="Formatters"
      splitView={mode !== 'tree'}
      toolbar={
        <div className="space-y-2.5">
          <ToolToolbar
            onRun={runFormat}
            runLabel={mode === 'minify' ? 'Minify JSON' : 'Format JSON'}
            onLoadSample={handleLoadSample}
            onClear={handleClear}
            onUploadInput={handleUploadInput}
            onCopyOutput={() => navigator.clipboard?.writeText(output)}
            onDownloadOutput={downloadOutput}
            canCopy={Boolean(output)}
            canDownload={Boolean(output)}
          />

          {/* Secondary Control Bar: Mode & Indentation */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/40 px-3 py-2">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-muted-foreground mr-1">Mode:</span>
              <button
                onClick={() => setMode('beautify')}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                  mode === 'beautify'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                Beautify
              </button>
              <button
                onClick={() => setMode('minify')}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                  mode === 'minify'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                Minify
              </button>
              <button
                onClick={() => {
                  setMode('tree');
                  runFormat();
                }}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                  mode === 'tree'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                Tree View
              </button>
            </div>

            {/* Indentation Selector */}
            {mode === 'beautify' && (
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-muted-foreground">Indent:</span>
                <select
                  value={String(indent)}
                  onChange={(e) => {
                    const val = e.target.value;
                    setIndent(val === 'tab' ? 'tab' : (Number(val) as IndentOption));
                  }}
                  className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="2">2 Spaces</option>
                  <option value="4">4 Spaces</option>
                  <option value="tab">Tabs</option>
                </select>
              </div>
            )}
          </div>
        </div>
      }
      statusArea={
        statusInfo.status !== 'idle' ? (
          <StatusArea
            status={statusInfo.status}
            message={statusInfo.message}
            detail={statusInfo.detail}
          />
        ) : undefined
      }
      inputPanel={
        <InputPanel
          title="Raw JSON Input"
          value={input}
          onChange={(val) => {
            setInput(val);
            setError(null);
          }}
          language="JSON"
          onClear={handleClear}
        />
      }
      outputPanel={
        mode === 'tree' ? (
          <div className="h-full min-h-[420px] rounded-xl border border-border bg-card/60">
            <JsonTreeView jsonString={input} />
          </div>
        ) : (
          <OutputPanel
            title="Processed JSON Output"
            value={output}
            errorMessage={error || (!validationResult.isValid ? validationResult.error : null)}
            executionTimeMs={executionTimeMs}
            language="JSON"
          />
        )
      }
    />
  );
}
