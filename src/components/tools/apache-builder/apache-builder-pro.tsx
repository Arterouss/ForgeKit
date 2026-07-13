'use client';

import { useState, useMemo } from 'react';
import { Globe, Shield, FolderGit2, Network } from 'lucide-react';
import {
  generateApacheConfig,
  APACHE_PRESETS,
  type ApacheVirtualHostConfig,
} from '@/lib/apache-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function ApacheBuilderPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [config, setConfig] = useState<ApacheVirtualHostConfig>(
    APACHE_PRESETS[0].config
  );

  const output = useMemo(() => generateApacheConfig(config), [config]);

  const handleRun = () => {
    addHistoryItem(
      'Apache Virtual Host Builder',
      `Generated VirtualHost for ${config.serverName}`
    );
  };

  const handleClear = () => {
    setConfig({
      serverName: 'localhost',
      serverAlias: '',
      adminEmail: 'webmaster@localhost',
      port: 80,
      enableSsl: false,
      sslPort: 443,
      sslCertFile: '',
      sslKeyFile: '',
      enableHttpRedirect: false,
      mode: 'static',
      documentRoot: '/var/www/html',
      allowOverride: false,
      proxyTargetUrl: '',
      accessLogPath: '${APACHE_LOG_DIR}/access.log',
      errorLogPath: '${APACHE_LOG_DIR}/error.log',
    });
  };

  return (
    <ToolPage
      title="Apache Virtual Host Builder"
      description="Visual generator for Apache 2.4 VirtualHost configurations with SSL/TLS certificates, mod_proxy reverse proxying, AllowOverride .htaccess permissions, and HTTP redirect blocks"
      category="Linux"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const preset = APACHE_PRESETS.find(
                  (p) => p.name === e.target.value
                );
                if (preset) setConfig(preset.config);
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Apache VirtualHost Preset...
              </option>
              {APACHE_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableSsl}
                  onChange={(e) =>
                    setConfig({ ...config, enableSsl: e.target.checked })
                  }
                  className="rounded border-border"
                />
                SSL/TLS Enabled (Port 443)
              </label>

              {config.enableSsl && (
                <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableHttpRedirect}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        enableHttpRedirect: e.target.checked,
                      })
                    }
                    className="rounded border-border"
                  />
                  HTTP → HTTPS Redirect
                </label>
              )}
            </div>
          </div>

          <ToolToolbar
            onRun={handleRun}
            runLabel="Save Config"
            onLoadSample={() => setConfig(APACHE_PRESETS[0].config)}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(output)}
            canCopy={Boolean(output)}
            onDownloadOutput={() => downloadFile(output, 'apache-site.conf')}
            canDownload={Boolean(output)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status="success"
          message={`VirtualHost: ${config.serverName}`}
          detail={`Mode: ${config.mode.toUpperCase()} | SSL: ${
            config.enableSsl ? 'Enabled' : 'Disabled'
          }`}
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* General Server Info */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b border-border pb-2">
              <Globe className="h-4 w-4 text-primary" />
              <span>Server & Domain Identification</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  ServerName (Primary Domain)
                </label>
                <input
                  type="text"
                  value={config.serverName}
                  onChange={(e) =>
                    setConfig({ ...config, serverName: e.target.value })
                  }
                  placeholder="app.devforge.io"
                  className="w-full rounded border border-border bg-card px-2.5 py-1 font-mono text-xs font-bold text-primary"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  ServerAlias (WWW or Alternate)
                </label>
                <input
                  type="text"
                  value={config.serverAlias}
                  onChange={(e) =>
                    setConfig({ ...config, serverAlias: e.target.value })
                  }
                  placeholder="www.app.devforge.io"
                  className="w-full rounded border border-border bg-card px-2.5 py-1 font-mono text-xs text-foreground"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  ServerAdmin Email
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

          {/* Hosting Mode switch */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Network className="h-4 w-4 text-primary" />
                <span>VirtualHost Architecture Mode</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, mode: 'static' })}
                  className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                    config.mode === 'static'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Static / PHP DocumentRoot
                </button>
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, mode: 'proxy' })}
                  className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                    config.mode === 'proxy'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Reverse Proxy (mod_proxy)
                </button>
              </div>
            </div>

            {config.mode === 'static' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground">
                    DocumentRoot Path
                  </label>
                  <input
                    type="text"
                    value={config.documentRoot}
                    onChange={(e) =>
                      setConfig({ ...config, documentRoot: e.target.value })
                    }
                    placeholder="/var/www/html"
                    className="w-full rounded border border-border bg-card px-2.5 py-1 font-mono text-xs text-foreground"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.allowOverride}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          allowOverride: e.target.checked,
                        })
                      }
                      className="rounded border-border"
                    />
                    AllowOverride All (.htaccess permalinks & rewrites)
                  </label>
                </div>
              </div>
            ) : (
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  ProxyTarget URL (ProxyPass / to backend daemon)
                </label>
                <input
                  type="text"
                  value={config.proxyTargetUrl}
                  onChange={(e) =>
                    setConfig({ ...config, proxyTargetUrl: e.target.value })
                  }
                  placeholder="http://127.0.0.1:3000/"
                  className="w-full rounded border border-border bg-card px-2.5 py-1 font-mono text-xs font-bold text-primary"
                />
              </div>
            )}
          </div>

          {/* SSL Certificate Paths */}
          {config.enableSsl && (
            <div className="rounded-xl border border-border bg-background p-3 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b border-border pb-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>SSL/TLS Certificates (SSLEngine on)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground">
                    SSLCertificateFile (Fullchain PEM)
                  </label>
                  <input
                    type="text"
                    value={config.sslCertFile}
                    onChange={(e) =>
                      setConfig({ ...config, sslCertFile: e.target.value })
                    }
                    placeholder="/etc/letsencrypt/live/domain/fullchain.pem"
                    className="w-full rounded border border-border bg-card px-2.5 py-1 font-mono text-xs text-foreground"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground">
                    SSLCertificateKeyFile (Private Key)
                  </label>
                  <input
                    type="text"
                    value={config.sslKeyFile}
                    onChange={(e) =>
                      setConfig({ ...config, sslKeyFile: e.target.value })
                    }
                    placeholder="/etc/letsencrypt/live/domain/privkey.pem"
                    className="w-full rounded border border-border bg-card px-2.5 py-1 font-mono text-xs text-foreground"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Log Paths */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b border-border pb-2">
              <FolderGit2 className="h-4 w-4 text-primary" />
              <span>Logging Configuration</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  CustomLog (Access Log)
                </label>
                <input
                  type="text"
                  value={config.accessLogPath}
                  onChange={(e) =>
                    setConfig({ ...config, accessLogPath: e.target.value })
                  }
                  className="w-full rounded border border-border bg-card px-2.5 py-1 font-mono text-xs text-foreground"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  ErrorLog (Error Log)
                </label>
                <input
                  type="text"
                  value={config.errorLogPath}
                  onChange={(e) =>
                    setConfig({ ...config, errorLogPath: e.target.value })
                  }
                  className="w-full rounded border border-border bg-card px-2.5 py-1 font-mono text-xs text-foreground"
                />
              </div>
            </div>
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title={`Generated apache-site.conf (${config.serverName})`}
          value={output}
          language="apache"
        />
      }
    />
  );
}
