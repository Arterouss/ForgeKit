'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, AlertCircle, Network, ShieldCheck } from 'lucide-react';
import {
  generateTraefikConfig,
  validateTraefikConfig,
  TRAEFIK_PRESETS,
  generateTraefikRouterId,
  type TraefikConfigOptions,
} from '@/lib/traefik-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function TraefikBuilderPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [options, setOptions] = useState<TraefikConfigOptions>(
    TRAEFIK_PRESETS[0].options
  );

  const output = useMemo(() => {
    return generateTraefikConfig(options);
  }, [options]);

  const validation = useMemo(() => {
    return validateTraefikConfig(options);
  }, [options]);

  const handleRun = () => {
    addHistoryItem(
      'Traefik Config Builder Pro',
      `Generated Traefik (${options.routers.length} routers)`
    );
  };

  const handleClear = () => {
    setOptions({
      apiDashboardEnabled: false,
      dockerProviderEnabled: true,
      httpPort: 80,
      httpsPort: 443,
      letsEncryptEnabled: false,
      acmeEmail: '',
      routers: [],
    });
  };

  const addRouter = () => {
    setOptions((prev) => ({
      ...prev,
      routers: [
        ...prev.routers,
        {
          id: generateTraefikRouterId(),
          name: `router-${prev.routers.length + 1}`,
          hostRule: 'app.example.com',
          serviceTargetUrl: 'http://localhost:8080',
          tlsEnabled: prev.letsEncryptEnabled,
        },
      ],
    }));
  };

  const removeRouter = (id: string) => {
    setOptions((prev) => ({
      ...prev,
      routers: prev.routers.filter((r) => r.id !== id),
    }));
  };

  return (
    <ToolPage
      title="Traefik Config Builder Pro"
      description="Visual Traefik v3 static & dynamic YAML generator with Docker auto-discovery and Let's Encrypt automated TLS"
      category="DevOps"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const p = TRAEFIK_PRESETS.find((x) => x.name === e.target.value);
                if (p) setOptions(p.options);
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Traefik Preset...
              </option>
              {TRAEFIK_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.dockerProviderEnabled}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      dockerProviderEnabled: e.target.checked,
                    })
                  }
                  className="rounded border-border"
                />
                Docker Provider
              </label>
              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.letsEncryptEnabled}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      letsEncryptEnabled: e.target.checked,
                    })
                  }
                  className="rounded border-border"
                />
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Let&apos;s Encrypt TLS
              </label>
              <button
                onClick={addRouter}
                className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Router</span>
              </button>
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
            runLabel="Generate Traefik Config"
            onLoadSample={() => setOptions(TRAEFIK_PRESETS[0].options)}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(output)}
            canCopy={Boolean(output)}
            onDownloadOutput={() => downloadFile(output, 'traefik.yml')}
            canDownload={Boolean(output)}
          />
        </div>
      }
      statusArea={
        validation.isValid ? (
          <StatusArea
            status="success"
            message={`Traefik Configured (${options.routers.length} routes)`}
            detail={
              options.letsEncryptEnabled
                ? 'ACME Let\'s Encrypt Active'
                : 'Static Routing Mode'
            }
          />
        ) : (
          <StatusArea
            status="error"
            message="Configuration Error"
            detail={validation.errors[0] ?? 'Check router definitions'}
          />
        )
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="flex items-center gap-2 border-b border-border pb-2 text-xs font-bold text-foreground">
              <Network className="h-4 w-4 text-primary" />
              <span>Global EntryPoints & ACME</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  HTTP Port
                </label>
                <input
                  type="number"
                  value={options.httpPort}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      httpPort: parseInt(e.target.value) || 80,
                    })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  HTTPS Port
                </label>
                <input
                  type="number"
                  value={options.httpsPort}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      httpsPort: parseInt(e.target.value) || 443,
                    })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  ACME Email
                </label>
                <input
                  type="email"
                  placeholder="admin@domain.com"
                  value={options.acmeEmail ?? ''}
                  onChange={(e) =>
                    setOptions({ ...options, acmeEmail: e.target.value })
                  }
                  disabled={!options.letsEncryptEnabled}
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-foreground">
              Dynamic Routers & Services
            </span>
            {options.routers.map((router, idx) => (
              <div
                key={router.id}
                className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-background p-2.5"
              >
                <input
                  type="text"
                  placeholder="router-name"
                  value={router.name}
                  onChange={(e) => {
                    const next = [...options.routers];
                    next[idx] = { ...router, name: e.target.value };
                    setOptions({ ...options, routers: next });
                  }}
                  className="w-28 rounded border border-border bg-card px-2 py-1 font-mono text-xs font-bold text-foreground"
                />
                <input
                  type="text"
                  placeholder="domain.com"
                  value={router.hostRule}
                  onChange={(e) => {
                    const next = [...options.routers];
                    next[idx] = { ...router, hostRule: e.target.value };
                    setOptions({ ...options, routers: next });
                  }}
                  className="w-36 rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
                <input
                  type="text"
                  placeholder="http://localhost:3000"
                  value={router.serviceTargetUrl}
                  onChange={(e) => {
                    const next = [...options.routers];
                    next[idx] = { ...router, serviceTargetUrl: e.target.value };
                    setOptions({ ...options, routers: next });
                  }}
                  className="flex-1 min-w-[140px] rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
                <label className="flex items-center gap-1 text-[11px] font-bold text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={router.tlsEnabled}
                    onChange={(e) => {
                      const next = [...options.routers];
                      next[idx] = { ...router, tlsEnabled: e.target.checked };
                      setOptions({ ...options, routers: next });
                    }}
                    className="rounded border-border"
                  />
                  TLS
                </label>
                <button
                  onClick={() => removeRouter(router.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title="Generated Traefik Configuration YAML"
          value={output}
          language="yaml"
        />
      }
    />
  );
}
