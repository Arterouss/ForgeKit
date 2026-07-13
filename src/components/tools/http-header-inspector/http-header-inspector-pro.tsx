'use client';

import { useState, useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Search,
} from 'lucide-react';
import {
  inspectHttpHeaders,
  HTTP_HEADER_SAMPLES,
  type SecurityGrade,
} from '@/lib/http-header-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function HttpHeaderInspectorPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [rawHeaders, setRawHeaders] = useState<string>(
    HTTP_HEADER_SAMPLES[0].content
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  const inspection = useMemo(
    () => inspectHttpHeaders(rawHeaders),
    [rawHeaders]
  );

  const filteredParsedHeaders = useMemo(() => {
    const entries = Object.entries(inspection.parsedHeaders);
    if (!searchQuery.trim()) return entries;
    const lower = searchQuery.toLowerCase();
    return entries.filter(
      ([k, v]) => k.includes(lower) || v.toLowerCase().includes(lower)
    );
  }, [inspection.parsedHeaders, searchQuery]);

  const handleRunAudit = () => {
    addHistoryItem('HTTP Header Inspector', `Audited response headers (Grade ${inspection.grade})`);
  };

  const getGradeBadgeColor = (grade: SecurityGrade) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'B':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'C':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  const auditReportJson = useMemo(
    () => JSON.stringify(inspection, null, 2),
    [inspection]
  );

  return (
    <ToolPage
      title="HTTP Header Inspector"
      description="Analyze raw HTTP response headers, evaluate OWASP security posture (HSTS, CSP, X-Frame-Options, nosniff), detect technology stack leaks, and grade security rating"
      category="Network"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const found = HTTP_HEADER_SAMPLES.find(
                  (s) => s.name === e.target.value
                );
                if (found) setRawHeaders(found.content);
              }}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Sample Response Headers...
              </option>
              {HTTP_HEADER_SAMPLES.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Security Rating:
              </span>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-black ${getGradeBadgeColor(
                  inspection.grade
                )}`}
              >
                Grade {inspection.grade}
              </span>
            </div>
          </div>

          <ToolToolbar
            onRun={handleRunAudit}
            runLabel="Audit Headers"
            onLoadSample={() =>
              setRawHeaders(HTTP_HEADER_SAMPLES[0].content)
            }
            onClear={() => setRawHeaders('')}
            onCopyOutput={() => copyOutput(auditReportJson)}
            canCopy={Boolean(auditReportJson)}
            onDownloadOutput={() =>
              downloadFile(auditReportJson, 'http-headers-audit.json')
            }
            canDownload={Boolean(auditReportJson)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status={inspection.grade === 'F' ? 'error' : 'success'}
          message={`Security Rating: Grade ${inspection.grade}`}
          detail={inspection.summaryMessage}
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">
              Raw HTTP Response Headers
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              {Object.keys(inspection.parsedHeaders).length} Headers Parsed
            </span>
          </div>

          <textarea
            rows={8}
            value={rawHeaders}
            onChange={(e) => setRawHeaders(e.target.value)}
            placeholder="HTTP/1.1 200 OK&#10;Content-Type: text/html&#10;Strict-Transport-Security: max-age=31536000..."
            className="w-full rounded-xl border border-border bg-background p-3 font-mono text-xs text-foreground focus:outline-none"
          />

          {/* Leaked Information Alert */}
          {inspection.leakedHeaders.length > 0 && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                <ShieldAlert className="h-4 w-4" />
                <span>Information Leakage Warning Detected</span>
              </div>
              <div className="space-y-1.5 text-xs text-foreground/90">
                {inspection.leakedHeaders.map((leak) => (
                  <div key={leak.headerName} className="rounded bg-background/80 p-2 space-y-1">
                    <div className="font-mono font-bold text-red-400">
                      {leak.headerName}: {leak.value}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {leak.risk}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OWASP Security Hardening Scorecard */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-foreground">
              OWASP Security Header Hardening Checks
            </div>
            <div className="space-y-2">
              {inspection.securityChecks.map((check) => (
                <div
                  key={check.headerName}
                  className="rounded-xl border border-border bg-background p-3 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-primary">
                      {check.headerName}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        check.status === 'pass'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : check.status === 'warn'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {check.status === 'pass' ? (
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" /> Pass
                        </span>
                      ) : check.status === 'warn' ? (
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Warn
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <ShieldAlert className="h-3 w-3" /> Missing
                        </span>
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/90">
                    {check.explanation}
                  </p>
                  {check.status !== 'pass' && (
                    <div className="text-[11px] font-mono text-amber-400/90 pt-1">
                      💡 Fix: {check.recommendation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Parsed Headers Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">
                All Parsed Key-Value Headers
              </span>
              <div className="relative w-48">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter headers..."
                  className="w-full rounded-lg border border-border bg-background pl-8 pr-3 py-1 text-xs text-foreground focus:outline-none"
                />
              </div>
            </div>
            <div className="overflow-x-auto rounded-xl border border-border bg-background">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-border bg-card text-muted-foreground">
                    <th className="p-2 font-bold">Header Name</th>
                    <th className="p-2 font-bold">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredParsedHeaders.map(([k, v]) => (
                    <tr key={k} className="hover:bg-card/40">
                      <td className="p-2 font-bold text-primary">{k}</td>
                      <td className="p-2 text-foreground break-all">{v}</td>
                    </tr>
                  ))}
                  {filteredParsedHeaders.length === 0 && (
                    <tr>
                      <td colSpan={2} className="p-4 text-center text-muted-foreground">
                        No headers match your filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title="Security Inspection Audit Report (JSON)"
          value={auditReportJson}
          language="json"
        />
      }
    />
  );
}
