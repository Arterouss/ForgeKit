'use client';

import { useState, useMemo } from 'react';
import {
  Globe,
  Plus,
  Trash2,
  Code2,
  Terminal,
  Send,
  Sliders,
} from 'lucide-react';
import {
  generateRestSnippets,
  buildFullUrl,
  REST_REQUEST_PRESETS,
  type RestRequestConfig,
  type KeyValuePair,
  type HttpMethod,
} from '@/lib/rest-request-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

const METHODS: HttpMethod[] = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS',
  'HEAD',
];

export function RestRequestBuilderPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [config, setConfig] = useState<RestRequestConfig>(
    REST_REQUEST_PRESETS[0].config
  );
  const [activeTab, setActiveTab] = useState<'curl' | 'fetch' | 'axios' | 'python'>('curl');
  const [mockResponse, setMockResponse] = useState<string | null>(null);

  const snippets = useMemo(() => generateRestSnippets(config), [config]);
  const fullTargetUrl = useMemo(
    () => buildFullUrl(config.url, config.queryParams),
    [config.url, config.queryParams]
  );

  const currentSnippetOutput = snippets[activeTab];

  const handleAddQueryParam = () => {
    const newParam: KeyValuePair = {
      id: `q_${Date.now()}`,
      key: '',
      value: '',
      enabled: true,
    };
    setConfig({
      ...config,
      queryParams: [...config.queryParams, newParam],
    });
  };

  const handleRemoveQueryParam = (id: string) => {
    setConfig({
      ...config,
      queryParams: config.queryParams.filter((p) => p.id !== id),
    });
  };

  const handleAddHeader = () => {
    const newHeader: KeyValuePair = {
      id: `h_${Date.now()}`,
      key: '',
      value: '',
      enabled: true,
    };
    setConfig({
      ...config,
      headers: [...config.headers, newHeader],
    });
  };

  const handleRemoveHeader = (id: string) => {
    setConfig({
      ...config,
      headers: config.headers.filter((h) => h.id !== id),
    });
  };

  const handleSimulateSend = () => {
    addHistoryItem(
      'REST Request Builder',
      `${config.method} request to ${config.url}`
    );

    setMockResponse(
      JSON.stringify(
        {
          status: 200,
          statusText: 'OK (Simulated DevForge Inspector Response)',
          requestMethod: config.method,
          requestUrl: fullTargetUrl,
          timestamp: new Date().toISOString(),
          headersReceived: config.headers
            .filter((h) => h.enabled && h.key)
            .reduce((acc, h) => {
              acc[h.key] = h.value;
              return acc;
            }, {} as Record<string, string>),
          data: {
            success: true,
            message: 'Endpoint payload verified successfully.',
            resourceId: 'res_sample_84109',
          },
        },
        null,
        2
      )
    );
  };

  const handleClear = () => {
    setConfig({
      method: 'GET',
      url: 'https://api.devforge.io/v1/endpoint',
      queryParams: [],
      headers: [
        { id: 'h1', key: 'Accept', value: 'application/json', enabled: true },
      ],
      bodyType: 'none',
      jsonBody: '',
    });
    setMockResponse(null);
  };

  return (
    <ToolPage
      title="REST Request Builder"
      description="Interactive REST API client configuration tool generating multi-language code snippets (cURL, fetch, Axios, Python) with query parameter builder and live response simulator"
      category="API"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const preset = REST_REQUEST_PRESETS.find(
                  (p) => p.name === e.target.value
                );
                if (preset) {
                  setConfig(preset.config);
                  setMockResponse(null);
                }
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load REST Request Preset...
              </option>
              {REST_REQUEST_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Target Snippet Tabs */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('curl')}
                className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                  activeTab === 'curl'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                cURL CLI
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('fetch')}
                className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                  activeTab === 'fetch'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                fetch (JS)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('axios')}
                className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                  activeTab === 'axios'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                Axios (TS)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('python')}
                className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                  activeTab === 'python'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                Python
              </button>
            </div>
          </div>

          <ToolToolbar
            onRun={handleSimulateSend}
            runLabel="Simulate Send Request"
            onLoadSample={() => {
              setConfig(REST_REQUEST_PRESETS[0].config);
              setMockResponse(null);
            }}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(currentSnippetOutput)}
            canCopy={Boolean(currentSnippetOutput)}
            onDownloadOutput={() =>
              downloadFile(
                currentSnippetOutput,
                `request.${
                  activeTab === 'curl'
                    ? 'sh'
                    : activeTab === 'python'
                    ? 'py'
                    : 'ts'
                }`
              )
            }
            canDownload={Boolean(currentSnippetOutput)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status="success"
          message={`${config.method} Request`}
          detail={fullTargetUrl}
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* Method and Endpoint Bar */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b border-border pb-2">
              <Globe className="h-4 w-4 text-primary" />
              <span>HTTP Method & Target Endpoint URL</span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <select
                value={config.method}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    method: e.target.value as HttpMethod,
                  })
                }
                className="rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs font-bold text-primary focus:outline-none"
              >
                {METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={config.url}
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
                placeholder="https://api.devforge.io/v1/endpoint"
                className="flex-1 rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none"
              />

              <button
                type="button"
                onClick={handleSimulateSend}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Test Send</span>
              </button>
            </div>
          </div>

          {/* Query Parameters Editor */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Sliders className="h-4 w-4 text-primary" />
                <span>URL Query Parameters</span>
              </div>
              <button
                type="button"
                onClick={handleAddQueryParam}
                className="flex items-center gap-1 rounded bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary hover:bg-primary/20"
              >
                <Plus className="h-3 w-3" />
                <span>Add Query Param</span>
              </button>
            </div>

            <div className="space-y-2">
              {config.queryParams.map((param) => (
                <div
                  key={param.id}
                  className="flex items-center gap-2 text-xs"
                >
                  <input
                    type="checkbox"
                    checked={param.enabled}
                    onChange={(e) => {
                      const updated = config.queryParams.map((p) =>
                        p.id === param.id
                          ? { ...p, enabled: e.target.checked }
                          : p
                      );
                      setConfig({ ...config, queryParams: updated });
                    }}
                    className="rounded border-border"
                  />
                  <input
                    type="text"
                    value={param.key}
                    onChange={(e) => {
                      const updated = config.queryParams.map((p) =>
                        p.id === param.id ? { ...p, key: e.target.value } : p
                      );
                      setConfig({ ...config, queryParams: updated });
                    }}
                    placeholder="key (e.g. limit)"
                    className="w-1/3 rounded border border-border bg-card px-2 py-1 font-mono text-xs text-primary"
                  />
                  <input
                    type="text"
                    value={param.value}
                    onChange={(e) => {
                      const updated = config.queryParams.map((p) =>
                        p.id === param.id ? { ...p, value: e.target.value } : p
                      );
                      setConfig({ ...config, queryParams: updated });
                    }}
                    placeholder="value (e.g. 50)"
                    className="flex-1 rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveQueryParam(param.id)}
                    className="rounded p-1 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {config.queryParams.length === 0 && (
                <div className="text-[11px] text-muted-foreground">
                  No query parameters added. Click &quot;Add Query Param&quot; above.
                </div>
              )}
            </div>
          </div>

          {/* Headers Editor */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Terminal className="h-4 w-4 text-primary" />
                <span>HTTP Headers</span>
              </div>
              <button
                type="button"
                onClick={handleAddHeader}
                className="flex items-center gap-1 rounded bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary hover:bg-primary/20"
              >
                <Plus className="h-3 w-3" />
                <span>Add Header</span>
              </button>
            </div>

            <div className="space-y-2">
              {config.headers.map((header) => (
                <div
                  key={header.id}
                  className="flex items-center gap-2 text-xs"
                >
                  <input
                    type="checkbox"
                    checked={header.enabled}
                    onChange={(e) => {
                      const updated = config.headers.map((h) =>
                        h.id === header.id
                          ? { ...h, enabled: e.target.checked }
                          : h
                      );
                      setConfig({ ...config, headers: updated });
                    }}
                    className="rounded border-border"
                  />
                  <input
                    type="text"
                    value={header.key}
                    onChange={(e) => {
                      const updated = config.headers.map((h) =>
                        h.id === header.id ? { ...h, key: e.target.value } : h
                      );
                      setConfig({ ...config, headers: updated });
                    }}
                    placeholder="Header Key (e.g. Authorization)"
                    className="w-1/3 rounded border border-border bg-card px-2 py-1 font-mono text-xs text-primary"
                  />
                  <input
                    type="text"
                    value={header.value}
                    onChange={(e) => {
                      const updated = config.headers.map((h) =>
                        h.id === header.id ? { ...h, value: e.target.value } : h
                      );
                      setConfig({ ...config, headers: updated });
                    }}
                    placeholder="Header Value (e.g. Bearer token)"
                    className="flex-1 rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveHeader(header.id)}
                    className="rounded p-1 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Request Body Editor */}
          {['POST', 'PUT', 'PATCH'].includes(config.method) && (
            <div className="rounded-xl border border-border bg-background p-3 space-y-2 flex-1 flex flex-col">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <Code2 className="h-4 w-4 text-primary" />
                  <span>Request JSON Payload</span>
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                  Content-Type: application/json
                </span>
              </div>
              <textarea
                rows={6}
                value={config.jsonBody}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    bodyType: 'json',
                    jsonBody: e.target.value,
                  })
                }
                placeholder="{\n  &quot;key&quot;: &quot;value&quot;\n}"
                className="w-full flex-1 rounded border border-border bg-card p-3 font-mono text-xs text-foreground focus:outline-none"
              />
            </div>
          )}

          {/* Simulated Response Inspector */}
          {mockResponse && (
            <div className="rounded-xl border border-primary/40 bg-primary/5 p-3 space-y-2">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs font-bold text-primary">
                  Simulated Response Inspection Output (HTTP 200 OK)
                </span>
              </div>
              <pre className="overflow-x-auto rounded bg-background p-3 font-mono text-xs text-foreground max-h-48">
                {mockResponse}
              </pre>
            </div>
          )}
        </div>
      }
      outputPanel={
        <OutputPanel
          title={`Client Code Snippet (${activeTab.toUpperCase()})`}
          value={currentSnippetOutput}
          language={activeTab === 'python' ? 'python' : activeTab === 'curl' ? 'bash' : 'typescript'}
        />
      }
    />
  );
}
