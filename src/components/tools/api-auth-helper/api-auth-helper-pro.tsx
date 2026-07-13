'use client';

import { useState, useMemo } from 'react';
import {
  KeyRound,
  Shield,
  Copy,
  Code2,
  Check,
} from 'lucide-react';
import {
  generateAuthSnippets,
  AUTH_SAMPLE_PRESETS,
  type AuthScheme,
  type AuthConfig,
} from '@/lib/api-auth-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function ApiAuthHelperPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [scheme, setScheme] = useState<AuthScheme>('bearer');
  const [token, setToken] = useState<string>(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMTAwIiwiZXhwIjoxODkwMDAwMDAwfQ.sign123'
  );
  const [username, setUsername] = useState<string>('devops_lead');
  const [password, setPassword] = useState<string>('StrongSecretPassword!2026');
  const [headerName, setHeaderName] = useState<string>('X-Forge-Key');
  const [apiKey, setApiKey] = useState<string>('fk_live_89102919ab381c049182');
  const [oauthTokenUrl, setOauthTokenUrl] = useState<string>(
    'https://auth.devforge.io/oauth/token'
  );
  const [clientId, setClientId] = useState<string>('fk_client_app_099');
  const [clientSecret, setClientSecret] = useState<string>(
    'sec_client_secret_9988aabbcc'
  );
  const [scope, setScope] = useState<string>('api:read api:write');
  const [targetUrl, setTargetUrl] = useState<string>(
    'https://api.devforge.io/v1/resource'
  );

  const [copiedHeader, setCopiedHeader] = useState(false);

  const config: AuthConfig = useMemo(() => {
    return {
      scheme,
      token,
      username,
      password,
      headerName,
      apiKey,
      oauthTokenUrl,
      clientId,
      clientSecret,
      scope,
    };
  }, [
    scheme,
    token,
    username,
    password,
    headerName,
    apiKey,
    oauthTokenUrl,
    clientId,
    clientSecret,
    scope,
  ]);

  const generated = useMemo(
    () => generateAuthSnippets(config, targetUrl),
    [config, targetUrl]
  );

  const handleCopyHeader = () => {
    if (generated.headerKey && generated.headerValue) {
      copyOutput(`${generated.headerKey}: ${generated.headerValue}`);
      setCopiedHeader(true);
      setTimeout(() => setCopiedHeader(false), 2000);
    }
  };

  const handleRunGenerate = () => {
    addHistoryItem(
      'API Auth Helper',
      `Generated ${scheme.toUpperCase()} auth snippet`
    );
  };

  return (
    <ToolPage
      title="API Authentication Helper & Header Generator"
      description="Generate HTTP authentication headers (Bearer JWT, Basic Base64, Custom API Keys, OAuth 2.0 Client Credentials), cURL test scripts, and JS fetch snippets"
      category="API"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'bearer', label: 'Bearer Token' },
                { id: 'basic', label: 'Basic Auth' },
                { id: 'apikey_header', label: 'API Key Header' },
                { id: 'oauth2_client', label: 'OAuth 2.0 Client' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setScheme(s.id as AuthScheme)}
                  className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                    scheme === s.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <select
              onChange={(e) => {
                const preset = AUTH_SAMPLE_PRESETS.find(
                  (p) => p.name === e.target.value
                );
                if (preset) {
                  setScheme(preset.config.scheme);
                  if (preset.config.token) setToken(preset.config.token);
                  if (preset.config.username) setUsername(preset.config.username);
                  if (preset.config.password) setPassword(preset.config.password);
                  if (preset.config.headerName)
                    setHeaderName(preset.config.headerName);
                  if (preset.config.apiKey) setApiKey(preset.config.apiKey);
                }
              }}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Auth Preset...
              </option>
              {AUTH_SAMPLE_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <ToolToolbar
            onRun={handleRunGenerate}
            runLabel="Generate Auth Snippets"
            onLoadSample={() => {
              setScheme('bearer');
              setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sample');
            }}
            onClear={() => {
              setToken('');
              setUsername('');
              setPassword('');
              setApiKey('');
            }}
            onCopyOutput={() => copyOutput(generated.curlSnippet)}
            canCopy={Boolean(generated.curlSnippet)}
            onDownloadOutput={() =>
              downloadFile(
                `${generated.curlSnippet}\n\n${generated.jsHeadersSnippet}`,
                `${scheme}-auth-snippet.sh`
              )
            }
            canDownload={Boolean(generated.curlSnippet)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status="success"
          message={`Scheme: ${scheme.toUpperCase()}`}
          detail={
            generated.headerKey
              ? `Header: ${generated.headerKey}`
              : 'URL Query Auth'
          }
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* Target API Endpoint */}
          <div className="space-y-1 rounded-xl border border-border bg-background p-3">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">
              Target API Request URL
            </label>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none"
            />
          </div>

          {/* Scheme Specific Inputs */}
          <div className="rounded-xl border border-border bg-background p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground border-b border-border pb-2">
              <KeyRound className="h-4 w-4 text-primary" />
              <span className="uppercase">
                Configure {scheme.replace('_', ' ')} Credentials
              </span>
            </div>

            {scheme === 'bearer' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Bearer Token (JWT / OAuth Access Token / Personal Access Token)
                </label>
                <textarea
                  rows={4}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="eyJhbGciOi..."
                  className="w-full rounded-lg border border-border bg-card p-2.5 font-mono text-xs text-foreground focus:outline-none break-all"
                />
              </div>
            )}

            {scheme === 'basic' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Password
                  </label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>
            )}

            {scheme === 'apikey_header' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Header Name
                  </label>
                  <input
                    type="text"
                    value={headerName}
                    onChange={(e) => setHeaderName(e.target.value)}
                    placeholder="X-API-Key"
                    className="w-full rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">
                    API Key Value
                  </label>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="fk_live_..."
                    className="w-full rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>
            )}

            {scheme === 'oauth2_client' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Token Exchange URL
                  </label>
                  <input
                    type="text"
                    value={oauthTokenUrl}
                    onChange={(e) => setOauthTokenUrl(e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Client ID
                    </label>
                    <input
                      type="text"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Client Secret
                    </label>
                    <input
                      type="text"
                      value={clientSecret}
                      onChange={(e) => setClientSecret(e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">
                    OAuth Scope (space separated)
                  </label>
                  <input
                    type="text"
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Exact Header Preview Box */}
          {generated.headerKey && (
            <div className="rounded-xl border border-primary/40 bg-card p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Generated Exact HTTP Header String</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyHeader}
                  className="flex items-center gap-1 rounded bg-primary/20 px-2 py-0.5 text-[11px] font-bold text-primary hover:bg-primary/30 transition-colors"
                >
                  {copiedHeader ? (
                    <>
                      <Check className="h-3 w-3" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copy Header
                    </>
                  )}
                </button>
              </div>

              <div className="rounded border border-border bg-background p-2.5 font-mono text-xs text-foreground break-all">
                <span className="font-bold text-primary">
                  {generated.headerKey}:{' '}
                </span>
                <span>{generated.headerValue}</span>
              </div>
            </div>
          )}

          {/* JS Fetch Snippet Preview */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Code2 className="h-4 w-4 text-primary" />
              <span>JavaScript fetch() Headers Snippet</span>
            </div>
            <pre className="overflow-x-auto rounded bg-card p-2.5 font-mono text-xs text-foreground">
              {generated.jsHeadersSnippet}
            </pre>
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title="Generated cURL Authentication Command"
          value={generated.curlSnippet}
          language="bash"
        />
      }
    />
  );
}
