'use client';

import { useState, useMemo } from 'react';
import { AlertCircle, Server, Shield, Zap } from 'lucide-react';
import {
  generateNginxConfig,
  validateNginxConfig,
  NGINX_PRESETS,
  type NginxConfigOptions,
} from '@/lib/nginx-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function NginxBuilderPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [options, setOptions] = useState<NginxConfigOptions>(
    NGINX_PRESETS[0].options
  );

  const output = useMemo(() => {
    return generateNginxConfig(options);
  }, [options]);

  const validation = useMemo(() => {
    return validateNginxConfig(options);
  }, [options]);

  const handleRun = () => {
    addHistoryItem(
      'Nginx Config Builder Pro',
      `Generated Nginx (${options.serverName})`
    );
  };

  const handleClear = () => {
    setOptions({
      mode: 'reverse_proxy',
      serverName: 'example.com',
      listenPort: 80,
      sslEnabled: false,
      proxyPassUrl: 'http://localhost:3000',
      gzipEnabled: true,
      securityHeadersEnabled: true,
      clientMaxBodySize: '10M',
    });
  };

  return (
    <ToolPage
      title="Nginx Config Builder Pro"
      description="Visual Nginx server block builder for reverse proxies, SPA static site routing, SSL TLSv1.3, and Gzip compression"
      category="DevOps"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const p = NGINX_PRESETS.find((x) => x.name === e.target.value);
                if (p) setOptions(p.options);
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Nginx Architecture...
              </option>
              {NGINX_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.gzipEnabled}
                  onChange={(e) =>
                    setOptions({ ...options, gzipEnabled: e.target.checked })
                  }
                  className="rounded border-border"
                />
                <Zap className="h-3 w-3 text-primary" />
                Gzip
              </label>
              <label className="flex items-center gap-1 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.securityHeadersEnabled}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      securityHeadersEnabled: e.target.checked,
                    })
                  }
                  className="rounded border-border"
                />
                <Shield className="h-3 w-3 text-emerald-500" />
                Sec Headers
              </label>
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
            runLabel="Generate Nginx Config"
            onLoadSample={() => setOptions(NGINX_PRESETS[0].options)}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(output)}
            canCopy={Boolean(output)}
            onDownloadOutput={() => downloadFile(output, 'nginx.conf')}
            canDownload={Boolean(output)}
          />
        </div>
      }
      statusArea={
        validation.isValid ? (
          <StatusArea
            status="success"
            message={`Nginx Block: ${options.serverName}:${options.listenPort}`}
            detail={`Mode: ${options.mode}`}
          />
        ) : (
          <StatusArea
            status="error"
            message="Configuration Error"
            detail={validation.errors[0] ?? 'Check Nginx settings'}
          />
        )
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-2 text-xs font-bold text-foreground">
            <Server className="h-4 w-4 text-primary" />
            <span>Server Block Settings</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">
                Hosting Mode
              </label>
              <select
                value={options.mode}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    mode: e.target.value as
                      | 'reverse_proxy'
                      | 'spa_static'
                      | 'load_balancer',
                  })
                }
                className="mt-1 w-full rounded border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground focus:outline-none"
              >
                <option value="reverse_proxy">Reverse Proxy Forwarder</option>
                <option value="spa_static">SPA Static Site Hosting</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">
                Domain Name (server_name)
              </label>
              <input
                type="text"
                value={options.serverName}
                onChange={(e) =>
                  setOptions({ ...options, serverName: e.target.value })
                }
                className="mt-1 w-full rounded border border-border bg-background px-2.5 py-1.5 font-mono text-xs text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">
                Listen Port
              </label>
              <input
                type="number"
                value={options.listenPort}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    listenPort: parseInt(e.target.value) || 80,
                  })
                }
                className="mt-1 w-full rounded border border-border bg-background px-2.5 py-1.5 font-mono text-xs text-foreground"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">
                Max Upload Body Size
              </label>
              <input
                type="text"
                value={options.clientMaxBodySize}
                onChange={(e) =>
                  setOptions({ ...options, clientMaxBodySize: e.target.value })
                }
                className="mt-1 w-full rounded border border-border bg-background px-2.5 py-1.5 font-mono text-xs text-foreground"
              />
            </div>
          </div>

          {options.mode === 'reverse_proxy' ? (
            <div>
              <label className="text-xs font-semibold text-muted-foreground">
                Upstream Target (proxy_pass URL)
              </label>
              <input
                type="text"
                value={options.proxyPassUrl ?? ''}
                onChange={(e) =>
                  setOptions({ ...options, proxyPassUrl: e.target.value })
                }
                placeholder="http://localhost:3000"
                className="mt-1 w-full rounded border border-border bg-background px-2.5 py-1.5 font-mono text-xs text-foreground"
              />
            </div>
          ) : (
            <div>
              <label className="text-xs font-semibold text-muted-foreground">
                Root HTML Directory (root path)
              </label>
              <input
                type="text"
                value={options.rootPath ?? ''}
                onChange={(e) =>
                  setOptions({ ...options, rootPath: e.target.value })
                }
                placeholder="/usr/share/nginx/html"
                className="mt-1 w-full rounded border border-border bg-background px-2.5 py-1.5 font-mono text-xs text-foreground"
              />
            </div>
          )}
        </div>
      }
      outputPanel={
        <OutputPanel
          title="Generated Nginx Config"
          value={output}
          language="nginx"
        />
      }
    />
  );
}
