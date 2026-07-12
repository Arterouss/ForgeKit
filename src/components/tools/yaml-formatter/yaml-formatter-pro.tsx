'use client';

import { useState, useMemo } from 'react';
import { BookOpen, SlidersHorizontal } from 'lucide-react';
import {
  formatYaml,
  validateYaml,
  yamlToJson,
  jsonToYaml,
  SAMPLE_DOCKER_COMPOSE_YAML,
  SAMPLE_KUBERNETES_YAML,
  SAMPLE_GITHUB_ACTIONS_YAML,
} from '@/lib/yaml-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  InputPanel,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export type YamlMode = 'format' | 'validate' | 'yaml2json' | 'json2yaml';

export function YamlFormatterPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [mode, setMode] = useState<YamlMode>('format');
  const [input, setInput] = useState<string>(SAMPLE_DOCKER_COMPOSE_YAML);
  const [indentSize, setIndentSize] = useState<number>(2);

  const result = useMemo(() => {
    if (!input.trim()) {
      return {
        output: '',
        isValid: true,
        errorMessage: null as string | null,
        language: mode === 'yaml2json' ? 'json' : 'yaml',
        errorLine: undefined as number | undefined,
        errorColumn: undefined as number | undefined,
      };
    }

    if (mode === 'format') {
      const formatted = formatYaml(input, indentSize);
      return {
        output: formatted.output,
        isValid: formatted.isValid,
        errorMessage: formatted.error,
        language: 'yaml',
        errorLine: formatted.errorLine,
        errorColumn: formatted.errorColumn,
      };
    } else if (mode === 'validate') {
      const validation = validateYaml(input);
      return {
        output: validation.isValid
          ? 'YAML Document is 100% valid and well-formed.'
          : validation.message,
        isValid: validation.isValid,
        errorMessage: validation.isValid ? null : validation.message,
        language: 'text',
        errorLine: validation.errorLine,
        errorColumn: validation.errorColumn,
      };
    } else if (mode === 'yaml2json') {
      const converted = yamlToJson(input, indentSize);
      return {
        output: converted.output,
        isValid: converted.isValid,
        errorMessage: converted.error,
        language: 'json',
        errorLine: undefined,
        errorColumn: undefined,
      };
    } else {
      // json2yaml
      const converted = jsonToYaml(input, indentSize);
      return {
        output: converted.output,
        isValid: converted.isValid,
        errorMessage: converted.error,
        language: 'yaml',
        errorLine: undefined,
        errorColumn: undefined,
      };
    }
  }, [input, mode, indentSize]);

  const handleRun = () => {
    const actionLabel =
      mode === 'format'
        ? 'Formatted YAML'
        : mode === 'validate'
          ? 'Validated YAML'
          : mode === 'yaml2json'
            ? 'Converted YAML to JSON'
            : 'Converted JSON to YAML';

    addHistoryItem('YAML Formatter Pro', `${actionLabel} (Indent: ${indentSize})`);
  };

  const handleLoadSample = (sampleType: 'docker' | 'k8s' | 'github') => {
    if (sampleType === 'docker') {
      setInput(SAMPLE_DOCKER_COMPOSE_YAML);
    } else if (sampleType === 'k8s') {
      setInput(SAMPLE_KUBERNETES_YAML);
    } else {
      setInput(SAMPLE_GITHUB_ACTIONS_YAML);
    }
    setMode('format');
    addHistoryItem('YAML Formatter Pro', `Loaded Sample: ${sampleType}`);
  };

  const handleClear = () => {
    setInput('');
  };

  return (
    <ToolPage
      title="YAML Formatter Pro"
      description="Beautify, validate, and convert YAML documents for Docker Compose, Kubernetes, and CI/CD workflows"
      category="Formatting"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          {/* Mode Selector & Options */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setMode('format')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  mode === 'format'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                Format & Beautify
              </button>
              <button
                onClick={() => setMode('validate')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  mode === 'validate'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                Validate Only
              </button>
              <button
                onClick={() => setMode('yaml2json')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  mode === 'yaml2json'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                YAML → JSON
              </button>
              <button
                onClick={() => setMode('json2yaml')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  mode === 'json2yaml'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                JSON → YAML
              </button>
            </div>

            {/* Indent & Sample Loader */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Indent:</span>
                <select
                  value={indentSize}
                  onChange={(e) => setIndentSize(Number(e.target.value))}
                  className="rounded-md border border-border bg-background px-2 py-1 font-mono text-xs text-foreground focus:outline-none"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  onChange={(e) => {
                    const val = e.target.value as 'docker' | 'k8s' | 'github';
                    if (val) handleLoadSample(val);
                  }}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Load Sample...
                  </option>
                  <option value="docker">Docker Compose</option>
                  <option value="k8s">Kubernetes Deployment</option>
                  <option value="github">GitHub Actions CI</option>
                </select>
              </div>
            </div>
          </div>

          <ToolToolbar
            onRun={handleRun}
            runLabel={
              mode === 'format'
                ? 'Beautify YAML'
                : mode === 'validate'
                  ? 'Validate Document'
                  : mode === 'yaml2json'
                    ? 'Convert to JSON'
                    : 'Convert to YAML'
            }
            onLoadSample={() => handleLoadSample('docker')}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(result.output)}
            canCopy={result.isValid && Boolean(result.output)}
            onDownloadOutput={() =>
              downloadFile(
                result.output,
                `devforge-${mode}.${result.language === 'json' ? 'json' : 'yaml'}`
              )
            }
            canDownload={result.isValid && Boolean(result.output)}
          />
        </div>
      }
      statusArea={
        result.isValid ? (
          <StatusArea
            status="success"
            message={
              mode === 'format'
                ? 'YAML Formatted Successfully'
                : mode === 'validate'
                  ? 'Valid YAML Document'
                  : `Conversion to ${result.language.toUpperCase()} Successful`
            }
          />
        ) : (
          <StatusArea
            status="error"
            message="YAML Parsing Error"
            detail={
              result.errorLine
                ? `Line ${result.errorLine}, Col ${result.errorColumn}: ${result.errorMessage}`
                : (result.errorMessage ?? 'Syntax error')
            }
          />
        )
      }
      inputPanel={
        <InputPanel
          title={mode === 'json2yaml' ? 'JSON Input' : 'YAML Document'}
          value={input}
          onChange={setInput}
          language={mode === 'json2yaml' ? 'json' : 'yaml'}
          onClear={handleClear}
        />
      }
      outputPanel={
        <OutputPanel
          title={
            mode === 'format'
              ? 'Beautified YAML'
              : mode === 'validate'
                ? 'Validation Report'
                : `Converted ${result.language.toUpperCase()}`
          }
          value={result.output}
          language={result.language}
          errorMessage={result.errorMessage ?? undefined}
        />
      }
    />
  );
}
