'use client';

import { useState, useMemo } from 'react';
import { KeyRound, Shield, Lock, Unlock, Mail, FileCode } from 'lucide-react';
import { inspectSshKey, SSH_KEY_SAMPLES } from '@/lib/ssh-key-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function SshKeyViewerPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [rawKey, setRawKey] = useState(SSH_KEY_SAMPLES[0].content);

  const inspection = useMemo(() => inspectSshKey(rawKey), [rawKey]);

  const markdownReport = useMemo(() => {
    return [
      '# SSH Key Inspection Report',
      `**Key Type:** ${inspection.keyType.toUpperCase()}`,
      `**Algorithm:** ${inspection.algorithm}`,
      `**Security Rating:** ${inspection.strength.toUpperCase()}`,
      `**Reason:** ${inspection.strengthReason}`,
      `**Format:** ${inspection.formatDetails}`,
      inspection.comment ? `**Comment / Label:** ${inspection.comment}` : '',
      inspection.isEncrypted !== undefined
        ? `**Encryption Status:** ${
            inspection.isEncrypted ? 'Passphrase Protected' : 'Unencrypted'
          }`
        : '',
    ]
      .filter(Boolean)
      .join('\n\n');
  }, [inspection]);

  const handleRun = () => {
    addHistoryItem(
      'SSH Key Viewer',
      `Inspected ${inspection.algorithm} (${inspection.strength.toUpperCase()})`
    );
  };

  const handleClear = () => {
    setRawKey('');
  };

  return (
    <ToolPage
      title="SSH Key Viewer"
      description="Cryptographic inspection tool for SSH public and private keys to identify algorithm, estimate bit strength, verify passphrase protection, and extract email comments"
      category="Linux"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const sample = SSH_KEY_SAMPLES.find(
                  (s) => s.name === e.target.value
                );
                if (sample) setRawKey(sample.content);
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load SSH Key Sample...
              </option>
              {SSH_KEY_SAMPLES.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <ToolToolbar
            onRun={handleRun}
            runLabel="Save Report"
            onLoadSample={() => setRawKey(SSH_KEY_SAMPLES[0].content)}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(markdownReport)}
            canCopy={Boolean(markdownReport)}
            onDownloadOutput={() => downloadFile(markdownReport, 'ssh-key-report.md')}
            canDownload={Boolean(markdownReport)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status={
            inspection.strength === 'strong'
              ? 'success'
              : inspection.strength === 'acceptable'
              ? 'info'
              : 'error'
          }
          message={`${inspection.algorithm} (${inspection.strength.toUpperCase()})`}
          detail={inspection.formatDetails}
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* Key Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-background p-3 flex items-center gap-3">
              <KeyRound className="h-6 w-6 text-primary shrink-0" />
              <div>
                <div className="text-[10px] font-semibold text-muted-foreground uppercase">
                  Algorithm & Format
                </div>
                <div className="text-xs font-bold text-foreground">
                  {inspection.algorithm}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-3 flex items-center gap-3">
              <Shield
                className={`h-6 w-6 shrink-0 ${
                  inspection.strength === 'strong'
                    ? 'text-emerald-500'
                    : inspection.strength === 'acceptable'
                    ? 'text-blue-500'
                    : 'text-destructive'
                }`}
              />
              <div>
                <div className="text-[10px] font-semibold text-muted-foreground uppercase">
                  Security Assessment
                </div>
                <div
                  className={`text-xs font-bold uppercase ${
                    inspection.strength === 'strong'
                      ? 'text-emerald-500'
                      : inspection.strength === 'acceptable'
                      ? 'text-blue-500'
                      : 'text-destructive'
                  }`}
                >
                  {inspection.strength}
                </div>
              </div>
            </div>
          </div>

          {/* Cryptographic Assessment Details */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b border-border pb-2">
              <FileCode className="h-4 w-4 text-primary" />
              <span>Inspection & Cryptographic Reasoning</span>
            </div>

            <p className="text-xs text-foreground/90 leading-relaxed">
              {inspection.strengthReason}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {inspection.comment && (
                <div className="flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-mono text-primary">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{inspection.comment}</span>
                </div>
              )}

              {inspection.isEncrypted !== undefined && (
                <div
                  className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold ${
                    inspection.isEncrypted
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
                      : 'border-amber-500/30 bg-amber-500/10 text-amber-500'
                  }`}
                >
                  {inspection.isEncrypted ? (
                    <Lock className="h-3.5 w-3.5" />
                  ) : (
                    <Unlock className="h-3.5 w-3.5" />
                  )}
                  <span>
                    {inspection.isEncrypted
                      ? 'Passphrase Protected'
                      : 'Unencrypted Key Storage'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Key input Textarea */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-2 flex-1 flex flex-col">
            <span className="text-xs font-bold text-foreground">
              Paste SSH Public or Private Key Content
            </span>
            <textarea
              rows={8}
              value={rawKey}
              onChange={(e) => setRawKey(e.target.value)}
              placeholder="ssh-ed25519 AAAA... user@domain.com or -----BEGIN OPENSSH PRIVATE KEY-----"
              className="w-full flex-1 rounded border border-border bg-card p-3 font-mono text-xs text-foreground focus:outline-none"
            />
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title="Cryptographic Inspection Report"
          value={markdownReport}
          language="markdown"
        />
      }
    />
  );
}
