'use client';

import { useState, useMemo } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Wand2,
  ShieldCheck,
} from 'lucide-react';
import {
  inspectSshConfig,
  SSH_CONFIG_SAMPLES,
} from '@/lib/ssh-config-validator-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function SshConfigValidatorPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [rawConfig, setRawConfig] = useState(SSH_CONFIG_SAMPLES[0].content);

  const inspection = useMemo(() => inspectSshConfig(rawConfig), [rawConfig]);

  const handleRun = () => {
    addHistoryItem(
      'SSH Config Validator',
      `Inspected config — Score: ${inspection.score}/100 (${inspection.parsedHostCount} hosts)`
    );
  };

  const handleClear = () => {
    setRawConfig('');
  };

  const handleAutoFormat = () => {
    setRawConfig(inspection.formattedConfig);
  };

  return (
    <ToolPage
      title="SSH Config Validator"
      description="Interactive ~/.ssh/config security scanner and syntax linter detecting duplicate Host aliases, wildcard shadowing, Agent Forwarding risks, and formatting issues"
      category="Linux"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const sample = SSH_CONFIG_SAMPLES.find(
                  (s) => s.name === e.target.value
                );
                if (sample) setRawConfig(sample.content);
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load SSH Config Inspection Sample...
              </option>
              {SSH_CONFIG_SAMPLES.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleAutoFormat}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1 text-xs font-bold text-primary-foreground hover:bg-primary/90"
            >
              <Wand2 className="h-3.5 w-3.5" />
              Auto-Format Indentation
            </button>
          </div>

          <ToolToolbar
            onRun={handleRun}
            runLabel="Save Inspection"
            onLoadSample={() => setRawConfig(SSH_CONFIG_SAMPLES[1].content)}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(inspection.formattedConfig)}
            canCopy={Boolean(inspection.formattedConfig)}
            onDownloadOutput={() =>
              downloadFile(inspection.formattedConfig, 'config')
            }
            canDownload={Boolean(inspection.formattedConfig)}
          />
        </div>
      }
      statusArea={
        inspection.isValid ? (
          <StatusArea
            status="success"
            message={`Score: ${inspection.score}/100`}
            detail={`Hosts: ${inspection.parsedHostCount} | No critical syntax errors`}
          />
        ) : (
          <StatusArea
            status="error"
            message={`Score: ${inspection.score}/100`}
            detail={`${
              inspection.diagnostics.filter((d) => d.severity === 'error')
                .length
            } Critical Errors Detected`}
          />
        )
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* Quality Badge */}
          <div className="rounded-xl border border-border bg-background p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck
                className={`h-6 w-6 ${
                  inspection.score >= 80
                    ? 'text-emerald-500'
                    : inspection.score >= 50
                    ? 'text-amber-500'
                    : 'text-destructive'
                }`}
              />
              <div>
                <div className="text-xs font-bold text-foreground">
                  Security & Architecture Quality Score
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Analyzed {inspection.parsedHostCount} Host definitions
                </div>
              </div>
            </div>
            <span
              className={`text-2xl font-extrabold ${
                inspection.score >= 80
                  ? 'text-emerald-500'
                  : inspection.score >= 50
                  ? 'text-amber-500'
                  : 'text-destructive'
              }`}
            >
              {inspection.score}
              <span className="text-xs text-muted-foreground font-normal">
                /100
              </span>
            </span>
          </div>

          {/* Textarea */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-2 flex-1 flex flex-col">
            <span className="text-xs font-bold text-foreground">
              Paste ~/.ssh/config Content
            </span>
            <textarea
              rows={10}
              value={rawConfig}
              onChange={(e) => setRawConfig(e.target.value)}
              placeholder="# Paste ~/.ssh/config content here..."
              className="w-full flex-1 rounded border border-border bg-card p-3 font-mono text-xs text-foreground focus:outline-none"
            />
          </div>

          {/* Diagnostics List */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-2">
            <span className="text-xs font-bold text-foreground">
              Diagnostic Reports ({inspection.diagnostics.length})
            </span>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {inspection.diagnostics.map((diag, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 rounded-lg border p-2.5 text-xs ${
                    diag.severity === 'error'
                      ? 'border-destructive/40 bg-destructive/10 text-destructive'
                      : diag.severity === 'warning'
                      ? 'border-amber-500/40 bg-amber-500/10 text-amber-500'
                      : 'border-blue-500/40 bg-blue-500/10 text-blue-400'
                  }`}
                >
                  {diag.severity === 'error' ? (
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  ) : diag.severity === 'warning' ? (
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  ) : (
                    <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold">
                      {diag.title}{' '}
                      {diag.line && (
                        <span className="font-mono text-[10px] opacity-80">
                          (Line {diag.line})
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] opacity-90 mt-0.5">
                      {diag.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title="Formatted & Standardized ~/.ssh/config"
          value={inspection.formattedConfig}
          language="bash"
        />
      }
    />
  );
}
