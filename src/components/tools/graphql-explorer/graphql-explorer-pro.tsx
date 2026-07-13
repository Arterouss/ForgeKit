'use client';

import { useState, useMemo } from 'react';
import {
  Database,
  KeyRound,
  FileCode2,
  FileJson,
  Sparkles,
} from 'lucide-react';
import {
  analyzeGraphQlQuery,
  formatGraphQlQuery,
  generateGraphQlCurl,
  GRAPHQL_SAMPLE_QUERIES,
} from '@/lib/graphql-explorer-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function GraphQlExplorerPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [endpointUrl, setEndpointUrl] = useState<string>(
    GRAPHQL_SAMPLE_QUERIES[0].endpointUrl
  );
  const [authToken, setAuthToken] = useState<string>('ghp_sample_token_123');
  const [queryText, setQueryText] = useState<string>(
    GRAPHQL_SAMPLE_QUERIES[0].queryText
  );
  const [variablesJson, setVariablesJson] = useState<string>(
    GRAPHQL_SAMPLE_QUERIES[0].variablesJson
  );

  const analysis = useMemo(() => analyzeGraphQlQuery(queryText), [queryText]);

  const curlCommand = useMemo(
    () =>
      generateGraphQlCurl(
        endpointUrl,
        queryText,
        variablesJson,
        authToken
      ),
    [endpointUrl, queryText, variablesJson, authToken]
  );

  const handleFormatQuery = () => {
    setQueryText(formatGraphQlQuery(queryText));
    addHistoryItem('GraphQL Explorer', `Formatted GraphQL query`);
  };

  return (
    <ToolPage
      title="GraphQL Explorer & Query Builder"
      description="Construct GraphQL queries and mutations, format operation syntax, define query variables, and generate HTTP execution cURL scripts"
      category="API"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const preset = GRAPHQL_SAMPLE_QUERIES.find(
                  (p) => p.name === e.target.value
                );
                if (preset) {
                  setEndpointUrl(preset.endpointUrl);
                  setQueryText(preset.queryText);
                  setVariablesJson(preset.variablesJson);
                }
              }}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Sample GraphQL Operation...
              </option>
              {GRAPHQL_SAMPLE_QUERIES.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleFormatQuery}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-bold text-foreground hover:bg-secondary/20 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Format GraphQL</span>
            </button>
          </div>

          <ToolToolbar
            onRun={handleFormatQuery}
            runLabel="Format & Analyze"
            onLoadSample={() => {
              const p = GRAPHQL_SAMPLE_QUERIES[0];
              setEndpointUrl(p.endpointUrl);
              setQueryText(p.queryText);
              setVariablesJson(p.variablesJson);
            }}
            onClear={() => {
              setQueryText('');
              setVariablesJson('{\n}');
            }}
            onCopyOutput={() => copyOutput(curlCommand)}
            canCopy={Boolean(curlCommand)}
            onDownloadOutput={() =>
              downloadFile(curlCommand, `${analysis.operationName || 'graphql'}-request.sh`)
            }
            canDownload={Boolean(curlCommand)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status={analysis.isValid ? 'success' : 'error'}
          message={
            analysis.isValid
              ? `${analysis.operationType.toUpperCase()}: ${analysis.operationName}`
              : 'Empty Query'
          }
          detail={`Field blocks detected: ${analysis.fieldCount}`}
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* Target Endpoint & Auth Bearer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-border bg-background p-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Database className="h-4 w-4 text-primary" />
                <span>GraphQL Endpoint URL</span>
              </div>
              <input
                type="text"
                value={endpointUrl}
                onChange={(e) => setEndpointUrl(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-1 font-mono text-xs text-foreground focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <KeyRound className="h-4 w-4 text-primary" />
                <span>Bearer Authorization Token</span>
              </div>
              <input
                type="text"
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                placeholder="Optional Bearer token..."
                className="w-full rounded-lg border border-border bg-card px-3 py-1 font-mono text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>

          {/* GraphQL Query Editor */}
          <div className="space-y-1.5 flex-1 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <FileCode2 className="h-4 w-4 text-primary" />
                <span>GraphQL Query / Mutation</span>
              </div>
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                  analysis.operationType === 'mutation'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-primary/20 text-primary'
                }`}
              >
                {analysis.operationType}
              </span>
            </div>
            <textarea
              rows={10}
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="query GetUser { user(id: 1) { name } }"
              className="w-full rounded-xl border border-border bg-background p-3 font-mono text-xs text-foreground focus:outline-none"
            />
          </div>

          {/* Variables JSON Editor */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <FileJson className="h-4 w-4 text-primary" />
              <span>Query Variables (JSON)</span>
            </div>
            <textarea
              rows={6}
              value={variablesJson}
              onChange={(e) => setVariablesJson(e.target.value)}
              placeholder='{ "id": 1 }'
              className="w-full rounded-xl border border-border bg-background p-3 font-mono text-xs text-foreground focus:outline-none"
            />
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title={`HTTP Request Execution Command (cURL POST)`}
          value={curlCommand}
          language="bash"
        />
      }
    />
  );
}
