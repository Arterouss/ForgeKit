'use client';

import { useState, useMemo } from 'react';
import {
  FileJson,
  Code2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import {
  inferJsonSchema,
  generateTsInterfaceFromJson,
  validateJsonAgainstSchema,
  JSON_SCHEMA_PRESETS,
} from '@/lib/json-schema-builder-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function JsonSchemaBuilderPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [jsonInput, setJsonInput] = useState<string>(
    JSON_SCHEMA_PRESETS[0].sampleJson
  );
  const [rootTitle, setRootTitle] = useState<string>('UserProfilePayload');
  const [activeTab, setActiveTab] = useState<'schema' | 'typescript' | 'validation'>('schema');

  const inference = useMemo(
    () => inferJsonSchema(jsonInput, rootTitle),
    [jsonInput, rootTitle]
  );

  const tsCode = useMemo(
    () => generateTsInterfaceFromJson(jsonInput, rootTitle),
    [jsonInput, rootTitle]
  );

  const validation = useMemo(
    () => validateJsonAgainstSchema(jsonInput, inference.schemaJson),
    [jsonInput, inference.schemaJson]
  );

  const activeOutputText =
    activeTab === 'schema'
      ? inference.schemaJson || inference.error || ''
      : activeTab === 'typescript'
      ? tsCode
      : JSON.stringify(validation, null, 2);

  const activeOutputLanguage =
    activeTab === 'typescript' ? 'typescript' : 'json';

  const handleRunBuilder = () => {
    addHistoryItem('JSON Schema Builder', `Inferred schema for ${rootTitle}`);
  };

  return (
    <ToolPage
      title="JSON Schema Builder & Validator"
      description="Infer JSON Schema Draft-07 automatically from sample JSON data, generate TypeScript Interface definitions, and structurally validate JSON instances"
      category="API"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const preset = JSON_SCHEMA_PRESETS.find(
                  (p) => p.name === e.target.value
                );
                if (preset) {
                  setJsonInput(preset.sampleJson);
                }
              }}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Sample JSON Payload...
              </option>
              {JSON_SCHEMA_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('schema')}
                className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                  activeTab === 'schema'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                JSON Schema (Draft 07)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('typescript')}
                className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                  activeTab === 'typescript'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                TypeScript Interface
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('validation')}
                className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                  activeTab === 'validation'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                Validation Audit
              </button>
            </div>
          </div>

          <ToolToolbar
            onRun={handleRunBuilder}
            runLabel="Infer Schema & Types"
            onLoadSample={() => {
              setJsonInput(JSON_SCHEMA_PRESETS[0].sampleJson);
              setRootTitle('UserProfilePayload');
            }}
            onClear={() => setJsonInput('')}
            onCopyOutput={() => copyOutput(activeOutputText)}
            canCopy={Boolean(activeOutputText)}
            onDownloadOutput={() =>
              downloadFile(
                activeOutputText,
                activeTab === 'typescript'
                  ? `${rootTitle}.ts`
                  : `${rootTitle}.schema.json`
              )
            }
            canDownload={Boolean(activeOutputText)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status={
            !inference.error && validation.isValid ? 'success' : 'warning'
          }
          message={
            !inference.error
              ? 'Draft-07 Schema Ready'
              : 'JSON Syntax Error Detected'
          }
          detail={`Root Type Name: ${rootTitle}`}
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* Root Type Name Bar */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-background p-3">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <Code2 className="h-4 w-4 text-primary" />
              <span>Root Entity / Interface Name</span>
            </div>
            <input
              type="text"
              value={rootTitle}
              onChange={(e) => setRootTitle(e.target.value)}
              placeholder="RootPayload"
              className="rounded-lg border border-border bg-card px-3 py-1 font-mono text-xs text-foreground focus:outline-none"
            />
          </div>

          {/* Validation Banner */}
          <div
            className={`flex items-center justify-between rounded-xl border p-3 text-xs ${
              validation.isValid && !inference.error
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                : 'border-amber-500/40 bg-amber-500/10 text-amber-400'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold">
              {validation.isValid && !inference.error ? (
                <>
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>
                    JSON Instance is syntactically valid and compliant with inferred schema
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>
                    {inference.error ||
                      `Validation Issues: ${validation.errors.join('; ')}`}
                  </span>
                </>
              )}
            </div>
            <ShieldCheck className="h-4 w-4 opacity-75" />
          </div>

          {/* JSON Instance Textarea */}
          <div className="space-y-1.5 flex-1 flex flex-col">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <FileJson className="h-4 w-4 text-primary" />
              <span>Sample JSON Instance Data</span>
            </div>
            <textarea
              rows={16}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste raw JSON instance here..."
              className="w-full flex-1 rounded-xl border border-border bg-background p-3 font-mono text-xs text-foreground focus:outline-none"
            />
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title={
            activeTab === 'schema'
              ? 'Inferred JSON Schema (Draft 07)'
              : activeTab === 'typescript'
              ? 'Generated TypeScript Interfaces'
              : 'Schema Validation Audit Report'
          }
          value={activeOutputText}
          language={activeOutputLanguage}
        />
      }
    />
  );
}
