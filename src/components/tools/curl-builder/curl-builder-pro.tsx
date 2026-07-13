'use client';

import { useState, useMemo } from 'react';
import {
  Terminal,
  Plus,
  Trash2,
  Shield,
  Sliders,
  Code2,
} from 'lucide-react';
import {
  generateCurlCommand,
  CURL_BUILDER_PRESETS,
  type CurlMethod,
  type CurlHeader,
} from '@/lib/curl-builder-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

const METHODS: CurlMethod[] = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS',
];

export function CurlBuilderPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [method, setMethod] = useState<CurlMethod>('POST');
  const [url, setUrl] = useState<string>('https://api.devforge.io/v1/deployments/create');
  const [headers, setHeaders] = useState<CurlHeader[]>([
    { id: 'h1', key: 'Content-Type', value: 'application/json', enabled: true },
    { id: 'h2', key: 'Accept', value: 'application/json', enabled: true },
  ]);
  const [dataPayload, setDataPayload] = useState<string>(
    JSON.stringify(
      {
        service: 'api-gateway',
        replicas: 3,
        region: 'us-east-1',
      },
      null,
      2
    )
  );
  const [authType, setAuthType] = useState<'none' | 'bearer' | 'basic'>('bearer');
  const [authToken, setAuthToken] = useState<string>('df_live_sec_token_98210');
  const [basicUser, setBasicUser] = useState<string>('');
  const [basicPass, setBasicPass] = useState<string>('');

  const [followRedirects, setFollowRedirects] = useState<boolean>(true);
  const [insecureSsl, setInsecureSsl] = useState<boolean>(false);
  const [includeResponseHeaders, setIncludeResponseHeaders] = useState<boolean>(true);
  const [verbose, setVerbose] = useState<boolean>(false);

  const [outputMode, setOutputMode] = useState<'multiline' | 'singleline' | 'fetch'>('multiline');

  const outputs = useMemo(
    () =>
      generateCurlCommand({
        method,
        url,
        headers,
        dataPayload,
        authType,
        authToken,
        basicUser,
        basicPass,
        followRedirects,
        insecureSsl,
        includeResponseHeaders,
        verbose,
      }),
    [
      method,
      url,
      headers,
      dataPayload,
      authType,
      authToken,
      basicUser,
      basicPass,
      followRedirects,
      insecureSsl,
      includeResponseHeaders,
      verbose,
    ]
  );

  const activeOutputText =
    outputMode === 'multiline'
      ? outputs.multiline
      : outputMode === 'singleline'
      ? outputs.singleline
      : outputs.fetchSnippet;

  const activeOutputLang = outputMode === 'fetch' ? 'javascript' : 'bash';

  const handleRunBuild = () => {
    addHistoryItem('cURL Builder', `Generated ${method} cURL for ${url}`);
  };

  const handleAddHeader = () => {
    setHeaders((prev) => [
      ...prev,
      {
        id: `h_${Date.now()}`,
        key: '',
        value: '',
        enabled: true,
      },
    ]);
  };

  const handleRemoveHeader = (id: string) => {
    setHeaders((prev) => prev.filter((h) => h.id !== id));
  };

  const handleUpdateHeader = (
    id: string,
    field: keyof CurlHeader,
    val: string | boolean
  ) => {
    setHeaders((prev) =>
      prev.map((h) => (h.id === id ? { ...h, [field]: val } : h))
    );
  };

  return (
    <ToolPage
      title="cURL Command Builder"
      description="Construct multi-line or single-line cURL CLI commands and JS fetch() snippets with headers, authentication, payload body, SSL bypass (-k), and redirect flags (-L)"
      category="API"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const preset = CURL_BUILDER_PRESETS.find(
                  (p) => p.name === e.target.value
                );
                if (preset) {
                  const c = preset.config;
                  setMethod(c.method);
                  setUrl(c.url);
                  setHeaders(c.headers);
                  setDataPayload(c.dataPayload);
                  setAuthType(c.authType);
                  setAuthToken(c.authToken);
                  setBasicUser(c.basicUser);
                  setBasicPass(c.basicPass);
                  setFollowRedirects(c.followRedirects);
                  setInsecureSsl(c.insecureSsl);
                  setIncludeResponseHeaders(c.includeResponseHeaders);
                  setVerbose(c.verbose);
                }
              }}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load cURL Preset...
              </option>
              {CURL_BUILDER_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setOutputMode('multiline')}
                className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                  outputMode === 'multiline'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                Multi-line (\)
              </button>
              <button
                type="button"
                onClick={() => setOutputMode('singleline')}
                className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                  outputMode === 'singleline'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                Single-line
              </button>
              <button
                type="button"
                onClick={() => setOutputMode('fetch')}
                className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                  outputMode === 'fetch'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                JS fetch()
              </button>
            </div>
          </div>

          <ToolToolbar
            onRun={handleRunBuild}
            runLabel="Build cURL Snippet"
            onLoadSample={() => {
              const c = CURL_BUILDER_PRESETS[0].config;
              setMethod(c.method);
              setUrl(c.url);
              setHeaders(c.headers);
              setDataPayload(c.dataPayload);
              setAuthType(c.authType);
              setAuthToken(c.authToken);
            }}
            onClear={() => {
              setUrl('');
              setDataPayload('');
            }}
            onCopyOutput={() => copyOutput(activeOutputText)}
            canCopy={Boolean(activeOutputText)}
            onDownloadOutput={() =>
              downloadFile(
                activeOutputText,
                outputMode === 'fetch' ? 'request.js' : 'request.sh'
              )
            }
            canDownload={Boolean(activeOutputText)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status="success"
          message={`cURL Built (${method})`}
          detail={`${headers.filter((h) => h.enabled).length} headers configured`}
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* Method & Target URL Bar */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Terminal className="h-4 w-4 text-primary" />
              <span>Request Method & Target URL Endpoint</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as CurlMethod)}
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
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.devforge.io/v1/resource"
                className="flex-1 rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>

          {/* cURL Flags & Options */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Sliders className="h-4 w-4 text-primary" />
              <span>Execution Flags & Options</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={followRedirects}
                  onChange={(e) => setFollowRedirects(e.target.checked)}
                  className="rounded border-border"
                />
                <span className="font-mono font-semibold text-foreground">
                  -L Follow Redirects
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={insecureSsl}
                  onChange={(e) => setInsecureSsl(e.target.checked)}
                  className="rounded border-border"
                />
                <span className="font-mono font-semibold text-foreground">
                  -k Insecure SSL
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeResponseHeaders}
                  onChange={(e) => setIncludeResponseHeaders(e.target.checked)}
                  className="rounded border-border"
                />
                <span className="font-mono font-semibold text-foreground">
                  -i Include Headers
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={verbose}
                  onChange={(e) => setVerbose(e.target.checked)}
                  className="rounded border-border"
                />
                <span className="font-mono font-semibold text-foreground">
                  -v Verbose
                </span>
              </label>
            </div>
          </div>

          {/* Authentication Section */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>Authentication Configuration</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setAuthType('none')}
                  className={`rounded px-2 py-0.5 text-xs font-bold ${
                    authType === 'none'
                      ? 'bg-primary/20 text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  None
                </button>
                <button
                  type="button"
                  onClick={() => setAuthType('bearer')}
                  className={`rounded px-2 py-0.5 text-xs font-bold ${
                    authType === 'bearer'
                      ? 'bg-primary/20 text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Bearer Token
                </button>
                <button
                  type="button"
                  onClick={() => setAuthType('basic')}
                  className={`rounded px-2 py-0.5 text-xs font-bold ${
                    authType === 'basic'
                      ? 'bg-primary/20 text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Basic Auth (-u)
                </button>
              </div>
            </div>

            {authType === 'bearer' && (
              <input
                type="text"
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                placeholder="Bearer token string..."
                className="w-full rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none"
              />
            )}

            {authType === 'basic' && (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={basicUser}
                  onChange={(e) => setBasicUser(e.target.value)}
                  placeholder="Username"
                  className="rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none"
                />
                <input
                  type="password"
                  value={basicPass}
                  onChange={(e) => setBasicPass(e.target.value)}
                  placeholder="Password"
                  className="rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Request Headers Editor */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">
                HTTP Request Headers (-H)
              </span>
              <button
                type="button"
                onClick={handleAddHeader}
                className="flex items-center gap-1 rounded bg-primary/10 px-2 py-1 text-xs font-bold text-primary hover:bg-primary/20"
              >
                <Plus className="h-3 w-3" />
                <span>Add Header</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {headers.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card p-1.5"
                >
                  <input
                    type="checkbox"
                    checked={h.enabled}
                    onChange={(e) =>
                      handleUpdateHeader(h.id, 'enabled', e.target.checked)
                    }
                    className="rounded border-border"
                  />
                  <input
                    type="text"
                    value={h.key}
                    onChange={(e) =>
                      handleUpdateHeader(h.id, 'key', e.target.value)
                    }
                    placeholder="Header-Name"
                    className="w-1/3 rounded border border-border bg-background px-2 py-1 font-mono text-xs text-foreground focus:outline-none"
                  />
                  <input
                    type="text"
                    value={h.value}
                    onChange={(e) =>
                      handleUpdateHeader(h.id, 'value', e.target.value)
                    }
                    placeholder="Header value..."
                    className="flex-1 rounded border border-border bg-background px-2 py-1 font-mono text-xs text-foreground focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveHeader(h.id)}
                    className="rounded p-1 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Payload Data Editor */}
          {['POST', 'PUT', 'PATCH'].includes(method) && (
            <div className="space-y-1.5 flex-1 flex flex-col">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Code2 className="h-4 w-4 text-primary" />
                <span>Request Data Payload (-d)</span>
              </div>
              <textarea
                rows={5}
                value={dataPayload}
                onChange={(e) => setDataPayload(e.target.value)}
                placeholder='{"key": "value"}'
                className="w-full flex-1 rounded-xl border border-border bg-background p-3 font-mono text-xs text-foreground focus:outline-none"
              />
            </div>
          )}
        </div>
      }
      outputPanel={
        <OutputPanel
          title={`Generated Snippet (${outputMode.toUpperCase()})`}
          value={activeOutputText}
          language={activeOutputLang}
        />
      }
    />
  );
}
