'use client';

import { useState, useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Clock,
  KeyRound,
  FileJson,
} from 'lucide-react';
import {
  auditJwtSecurity,
  SAMPLE_SECURITY_JWTS,
} from '@/lib/jwt-inspector-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function JwtInspectorPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [token, setToken] = useState<string>(SAMPLE_SECURITY_JWTS[0].token);

  const audit = useMemo(() => auditJwtSecurity(token), [token]);

  const reportText = useMemo(() => {
    return [
      `JWT Security Audit Report`,
      `=========================`,
      `Security Score: ${audit.securityScore} / 100`,
      `Valid Structure: ${audit.validFormat ? 'YES' : 'NO'}`,
      `Expiration Status: ${
        audit.isExpired ? 'EXPIRED' : 'ACTIVE / UNEXPIRED'
      }`,
      ``,
      `Vulnerabilities & Flaws Found (${audit.flaws.length}):`,
      ...audit.flaws.map(
        (f) =>
          ` [${f.severity.toUpperCase()}] ${f.title}\n   Problem: ${f.description}\n   Remediation: ${f.remediation}`
      ),
      ``,
      `Decoded Header:`,
      JSON.stringify(audit.header, null, 2),
      ``,
      `Decoded Payload:`,
      JSON.stringify(audit.payload, null, 2),
    ].join('\n');
  }, [audit]);

  const handleAudit = () => {
    addHistoryItem(
      'JWT Security Auditor',
      `Audited JWT (Score: ${audit.securityScore}/100)`
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80)
      return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400';
    if (score >= 50) return 'border-amber-500/40 bg-amber-500/10 text-amber-400';
    return 'border-rose-500/40 bg-rose-500/10 text-rose-400';
  };

  const getSeverityBadge = (sev: 'critical' | 'warning' | 'info') => {
    if (sev === 'critical')
      return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    if (sev === 'warning')
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
  };

  return (
    <ToolPage
      title="JWT Security Auditor & Flaw Inspector"
      description="Perform a comprehensive security audit on JSON Web Tokens to detect alg='none' flaws, missing exp claims, PII exposure, and calculate security scores"
      category="Security"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const sample = SAMPLE_SECURITY_JWTS.find(
                  (s) => s.name === e.target.value
                );
                if (sample) setToken(sample.token);
              }}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Vulnerability Sample...
              </option>
              {SAMPLE_SECURITY_JWTS.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <ToolToolbar
            onRun={handleAudit}
            runLabel="Audit Security"
            onLoadSample={() => setToken(SAMPLE_SECURITY_JWTS[1].token)}
            onClear={() => setToken('')}
            onCopyOutput={() => copyOutput(reportText)}
            canCopy={Boolean(token)}
            onDownloadOutput={() =>
              downloadFile(reportText, `jwt-security-audit.txt`)
            }
            canDownload={Boolean(token)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status={audit.securityScore >= 80 ? 'success' : 'error'}
          message={`Security Score: ${audit.securityScore}/100 (${audit.flaws.length} flaws)`}
          detail={`Algorithm: ${String(audit.header.alg || 'none').toUpperCase()} | Expired: ${audit.isExpired ? 'Yes' : 'No'}`}
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <KeyRound className="h-4 w-4 text-primary" />
              <span>Paste JSON Web Token (JWT) String</span>
            </div>
          </div>

          <textarea
            rows={12}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste header.payload.signature token here..."
            className="w-full flex-1 rounded-xl border border-border bg-background p-3 font-mono text-xs text-foreground focus:outline-none break-all"
          />
        </div>
      }
      outputPanel={
        <div className="flex h-full flex-col space-y-4 overflow-y-auto">
          {/* Score Card */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              {audit.securityScore >= 80 ? (
                <ShieldCheck className="h-8 w-8 text-emerald-400" />
              ) : (
                <ShieldAlert className="h-8 w-8 text-rose-400" />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">
                  Security Assessment Score
                </span>
                <span className="text-xs text-muted-foreground">
                  Analyzes algorithm strength, expiration, and payload PII
                </span>
              </div>
            </div>

            <div
              className={`rounded-xl border px-4 py-2 font-mono text-xl font-black ${getScoreColor(
                audit.securityScore
              )}`}
            >
              {audit.securityScore}/100
            </div>
          </div>

          {/* Security Flaws Box */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <AlertTriangle className="h-4 w-4 text-primary" />
              <span>
                Detected Security Vulnerabilities & Findings ({audit.flaws.length})
              </span>
            </div>

            {audit.flaws.length === 0 ? (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400 font-semibold">
                No obvious security flaws or high-risk claims detected in this
                token.
              </div>
            ) : (
              <div className="space-y-2.5">
                {audit.flaws.map((f) => (
                  <div
                    key={f.id}
                    className="rounded-lg border border-border bg-background p-3 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">
                        {f.title}
                      </span>
                      <span
                        className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase ${getSeverityBadge(
                          f.severity
                        )}`}
                      >
                        {f.severity}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{f.description}</p>
                    <div className="rounded bg-secondary/30 p-2 text-[11px] text-primary font-semibold">
                      Recommendation: {f.remediation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expiration Card */}
          <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-foreground font-bold">
              <Clock className="h-4 w-4 text-primary" />
              <span>Expiration Claim Status</span>
            </div>
            <span className="font-mono text-muted-foreground">
              {audit.expiryFormatted
                ? `Expires: ${audit.expiryFormatted}`
                : 'No expiration timestamp set'}
            </span>
          </div>

          {/* Decoded Header & Payload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <FileJson className="h-4 w-4 text-primary" />
                <span>Decoded Header</span>
              </div>
              <pre className="overflow-x-auto rounded border border-border bg-background p-2.5 font-mono text-xs text-foreground">
                {JSON.stringify(audit.header, null, 2)}
              </pre>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <FileJson className="h-4 w-4 text-primary" />
                <span>Decoded Payload</span>
              </div>
              <pre className="overflow-x-auto rounded border border-border bg-background p-2.5 font-mono text-xs text-foreground">
                {JSON.stringify(audit.payload, null, 2)}
              </pre>
            </div>
          </div>

          <div className="hidden">
            <OutputPanel
              title="Report"
              value={reportText}
              language="text"
            />
          </div>
        </div>
      }
    />
  );
}
