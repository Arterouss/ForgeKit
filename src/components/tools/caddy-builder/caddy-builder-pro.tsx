'use client';

import { useState, useMemo } from 'react';
import { Server, Shield, Zap, Sliders } from 'lucide-react';
import {
  generateCaddyfile,
  CADDY_PRESETS,
  type CaddySiteConfig,
} from '@/lib/caddy-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function CaddyBuilderPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [config, setConfig] = useState<CaddySiteConfig>(
    CADDY_PRESETS[0].config
  );

  const output = useMemo(() => generateCaddyfile(config), [config]);

  const handleRun = () => {
    addHistoryItem('Caddy Config Builder', `Generated Caddyfile for ${config.domain}`);
  };

  const handleClear = () => {
    setConfig({
      domain: 'localhost',
      adminEmail: 'admin@localhost',
      mode: 'reverse_proxy',
      proxyTarget: 'localhost:3000',
      staticRoot: '/var/www/html',
      enableCompression: true,
      enableSecurityHeaders: true,
      customDirectives: '',
    });
  };

  return (
    <ToolPage
      title="Caddy Config Builder"
      description="Visual Caddyfile generator for Caddy v2 with automatic Let's Encrypt HTTPS, reverse proxy routing, static file SPA servers, gzip/zstd compression, and security headers"
      category="Linux"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const preset = CADDY_PRESETS.find(
                  (p) => p.name === e.target.value
                );
                if (preset) setConfig(preset.config);
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Caddyfile Preset...
              </option>
              {CADDY_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableCompression}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      enableCompression: e.target.checked,
                    })
                  }
                  className="rounded border-border"
                />
                Compression (gzip zstd)
              </label>

              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableSecurityHeaders}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      enableSecurityHeaders: e.target.checked,
                    })
                  }
                  className="rounded border-border"
                />
                Security Headers
              </label>
            </div>
          </div>

          <ToolToolbar
            onRun={handleRun}
            runLabel="Save Caddyfile"
            onLoadSample={() => setConfig(CADDY_PRESETS[0].config)}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(output)}
            canCopy={Boolean(output)}
            onDownloadOutput={() => downloadFile(output, 'Caddyfile')}
            canDownload={Boolean(output)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status="success"
          message={`Domain: ${config.domain}`}
          detail={`Mode: ${config.mode.toUpperCase()} | Automatic Let's Encrypt TLS`}
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* Domain & Let's Encrypt Email */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b border-border pb-2">
              <Server className="h-4 w-4 text-primary" />
              <span>Domain & Let&apos;s Encrypt Automatic TLS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  Site Address / Domain Name
                </label>
                <input
                  type="text"
                  value={config.domain}
                  onChange={(e) =>
                    setConfig({ ...config, domain: e.target.value })
                  }
                  placeholder="app.devforge.io"
                  className="w-full rounded border border-border bg-card px-2.5 py-1 font-mono text-xs font-bold text-primary"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  Let&apos;s Encrypt ACME Email (Optional)
                </label>
                <input
                  type="text"
                  value={config.adminEmail}
                  onChange={(e) =>
                    setConfig({ ...config, adminEmail: e.target.value })
                  }
                  placeholder="admin@devforge.io"
                  className="w-full rounded border border-border bg-card px-2.5 py-1 text-xs text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Mode switch */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Zap className="h-4 w-4 text-primary" />
                <span>Caddy Routing Architecture Mode</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setConfig({ ...config, mode: 'reverse_proxy' })
                  }
                  className={`rounded px-2 py-1 text-[11px] font-bold transition-colors ${
                    config.mode === 'reverse_proxy'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Reverse Proxy
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setConfig({ ...config, mode: 'file_server' })
                  }
                  className={`rounded px-2 py-1 text-[11px] font-bold transition-colors ${
                    config.mode === 'file_server'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Static SPA Server
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setConfig({ ...config, mode: 'api_gateway' })
                  }
                  className={`rounded px-2 py-1 text-[11px] font-bold transition-colors ${
                    config.mode === 'api_gateway'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  API Gateway Router
                </button>
              </div>
            </div>

            {(config.mode === 'reverse_proxy' ||
              config.mode === 'api_gateway') && (
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  Reverse Proxy Upstream Address
                </label>
                <input
                  type="text"
                  value={config.proxyTarget}
                  onChange={(e) =>
                    setConfig({ ...config, proxyTarget: e.target.value })
                  }
                  placeholder="127.0.0.1:3000"
                  className="w-full rounded border border-border bg-card px-2.5 py-1 font-mono text-xs font-bold text-primary"
                />
              </div>
            )}

            {(config.mode === 'file_server' ||
              config.mode === 'api_gateway') && (
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  Static File Root Directory (root *)
                </label>
                <input
                  type="text"
                  value={config.staticRoot}
                  onChange={(e) =>
                    setConfig({ ...config, staticRoot: e.target.value })
                  }
                  placeholder="/var/www/html"
                  className="w-full rounded border border-border bg-card px-2.5 py-1 font-mono text-xs text-foreground"
                />
              </div>
            )}
          </div>

          {/* Hardening Info */}
          <div className="rounded-xl border border-border bg-background p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              <div>
                <div className="text-xs font-bold text-foreground">
                  Caddy v2 Production Defaults Active
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Automatic HTTPS redirection, TLS 1.3, and OCSP stapling are built-in
                </div>
              </div>
            </div>
          </div>

          {/* Custom Directives */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-2 flex-1 flex flex-col">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b border-border pb-2">
              <Sliders className="h-4 w-4 text-primary" />
              <span>Custom Caddy Directives</span>
            </div>
            <textarea
              rows={5}
              value={config.customDirectives}
              onChange={(e) =>
                setConfig({ ...config, customDirectives: e.target.value })
              }
              placeholder="log { output file /var/log/caddy/access.log }"
              className="w-full flex-1 rounded border border-border bg-card p-3 font-mono text-xs text-foreground focus:outline-none"
            />
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title={`Generated Caddyfile (${config.domain})`}
          value={output}
          language="caddyfile"
        />
      }
    />
  );
}
