'use client';

import { useState, useMemo } from 'react';
import {
  FileCode,
  Search,
  Globe,
  Tag,
  Server,
  Play,
  Terminal,
} from 'lucide-react';
import {
  parseOpenApiSpec,
  generateEndpointCurl,
  OPENAPI_SAMPLE_SPECS,
  type OpenApiEndpoint,
} from '@/lib/openapi-viewer-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function OpenApiViewerPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [specInput, setSpecInput] = useState<string>(
    OPENAPI_SAMPLE_SPECS[0].jsonText
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [selectedEndpoint, setSelectedEndpoint] = useState<OpenApiEndpoint | null>(
    null
  );

  const parsedSpec = useMemo(() => parseOpenApiSpec(specInput), [specInput]);

  const filteredEndpoints = useMemo(() => {
    return parsedSpec.endpoints.filter((ep) => {
      const matchMethod =
        methodFilter === 'ALL' || ep.method === methodFilter;
      const matchSearch =
        searchQuery.trim() === '' ||
        ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ep.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ep.tags.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchMethod && matchSearch;
    });
  }, [parsedSpec.endpoints, methodFilter, searchQuery]);

  const activeServerUrl = parsedSpec.servers[0] || 'https://api.devforge.io/v1';

  const selectedEndpointCurl = useMemo(() => {
    if (!selectedEndpoint) return '';
    return generateEndpointCurl(activeServerUrl, selectedEndpoint);
  }, [selectedEndpoint, activeServerUrl]);

  const handleRunExplore = () => {
    addHistoryItem(
      'OpenAPI Viewer',
      `Explored API spec: ${parsedSpec.title} (${parsedSpec.endpoints.length} routes)`
    );
  };

  return (
    <ToolPage
      title="OpenAPI / Swagger Endpoint Viewer"
      description="Inspect OpenAPI 3.0 and Swagger API specifications, browse endpoint routes, view parameter schemas, and generate cURL test commands"
      category="API"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const preset = OPENAPI_SAMPLE_SPECS.find(
                  (p) => p.name === e.target.value
                );
                if (preset) {
                  setSpecInput(preset.jsonText);
                  setSelectedEndpoint(null);
                }
              }}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Sample OpenAPI Spec...
              </option>
              {OPENAPI_SAMPLE_SPECS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1.5">
              {['ALL', 'GET', 'POST', 'PUT', 'DELETE'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethodFilter(m)}
                  className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                    methodFilter === m
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <ToolToolbar
            onRun={handleRunExplore}
            runLabel="Parse Specification"
            onLoadSample={() => {
              setSpecInput(OPENAPI_SAMPLE_SPECS[0].jsonText);
              setSelectedEndpoint(null);
            }}
            onClear={() => setSpecInput('')}
            onCopyOutput={() => copyOutput(selectedEndpointCurl || specInput)}
            canCopy={Boolean(selectedEndpointCurl || specInput)}
            onDownloadOutput={() =>
              downloadFile(specInput, 'openapi-specification.json')
            }
            canDownload={Boolean(specInput)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status={parsedSpec.isValid ? 'success' : 'error'}
          message={
            parsedSpec.isValid
              ? `${parsedSpec.endpoints.length} Endpoints Parsed`
              : 'Specification Error'
          }
          detail={
            parsedSpec.isValid
              ? `${parsedSpec.title} (v${parsedSpec.version})`
              : parsedSpec.errorMessage
          }
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* API Metadata Header */}
          {parsedSpec.isValid && (
            <div className="rounded-xl border border-border bg-background p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <span className="font-bold text-sm text-foreground">
                    {parsedSpec.title}
                  </span>
                  <span className="rounded bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                    v{parsedSpec.version}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                  <Server className="h-3.5 w-3.5" />
                  <span>{activeServerUrl}</span>
                </div>
              </div>
              {parsedSpec.description && (
                <div className="text-xs text-muted-foreground">
                  {parsedSpec.description}
                </div>
              )}
            </div>
          )}

          {/* Route Filter Search */}
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background p-2.5">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter endpoints by path, summary, or tag..."
              className="w-full bg-transparent text-xs text-foreground focus:outline-none"
            />
          </div>

          {/* Endpoints Route List */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-foreground">
              API Endpoints & Operations ({filteredEndpoints.length})
            </div>

            <div className="space-y-2">
              {filteredEndpoints.map((ep) => {
                const isSelected = selectedEndpoint?.id === ep.id;
                return (
                  <div
                    key={ep.id}
                    onClick={() => setSelectedEndpoint(ep)}
                    className={`cursor-pointer rounded-xl border p-3 transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-background hover:bg-card/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded px-2 py-0.5 font-mono text-xs font-bold ${
                            ep.method === 'GET'
                              ? 'bg-blue-500/20 text-blue-400'
                              : ep.method === 'POST'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : ep.method === 'PUT'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {ep.method}
                        </span>
                        <span className="font-mono text-xs font-bold text-foreground">
                          {ep.path}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {ep.tags.map((t) => (
                          <span
                            key={t}
                            className="flex items-center gap-1 rounded bg-secondary/10 px-2 py-0.5 text-[10px] text-muted-foreground"
                          >
                            <Tag className="h-2.5 w-2.5" />
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {ep.summary}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Endpoint Detailed Inspector */}
          {selectedEndpoint && (
            <div className="rounded-xl border border-primary/40 bg-background p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold text-foreground">
                    Endpoint Operation details: {selectedEndpoint.method}{' '}
                    {selectedEndpoint.path}
                  </span>
                </div>
              </div>

              {selectedEndpoint.parameters.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-muted-foreground uppercase">
                    Parameters
                  </div>
                  <div className="overflow-x-auto rounded border border-border">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-card text-muted-foreground">
                        <tr>
                          <th className="p-2">Name</th>
                          <th className="p-2">In</th>
                          <th className="p-2">Required</th>
                          <th className="p-2">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {selectedEndpoint.parameters.map((p, idx) => (
                          <tr key={idx}>
                            <td className="p-2 font-bold text-primary">
                              {p.name}
                            </td>
                            <td className="p-2 text-muted-foreground">{p.in}</td>
                            <td className="p-2">
                              {p.required ? 'Yes' : 'No'}
                            </td>
                            <td className="p-2 text-muted-foreground">
                              {p.description || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Generated cURL snippet */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Interactive Endpoint cURL Command</span>
                </div>
                <pre className="overflow-x-auto rounded bg-card p-2.5 font-mono text-xs text-foreground">
                  {selectedEndpointCurl}
                </pre>
              </div>
            </div>
          )}

          {/* Raw Spec JSON Textarea collapsible/bottom */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
              <FileCode className="h-4 w-4 text-primary" />
              <span>Raw OpenAPI / Swagger JSON Specification</span>
            </div>
            <textarea
              rows={8}
              value={specInput}
              onChange={(e) => setSpecInput(e.target.value)}
              className="w-full rounded-xl border border-border bg-background p-3 font-mono text-xs text-foreground focus:outline-none"
            />
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title={
            selectedEndpoint
              ? `cURL Command — ${selectedEndpoint.method} ${selectedEndpoint.path}`
              : 'OpenAPI JSON Specification'
          }
          value={selectedEndpointCurl || specInput}
          language={selectedEndpointCurl ? 'bash' : 'json'}
        />
      }
    />
  );
}
