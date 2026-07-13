'use client';

import { useState, useMemo } from 'react';
import {
  FileCheck,
  AlertTriangle,
  Globe,
  Award,
  Calendar,
  Fingerprint,
  Building2,
} from 'lucide-react';
import {
  analyzeCertificate,
  SAMPLE_CERTIFICATES,
} from '@/lib/certificate-viewer-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function CertificateViewerPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [pem, setPem] = useState<string>(SAMPLE_CERTIFICATES[0].pem);

  const analysis = useMemo(() => analyzeCertificate(pem), [pem]);

  const reportText = useMemo(() => {
    return [
      `X.509 SSL Certificate Audit Report`,
      `==================================`,
      `Subject CN:      ${analysis.subject.commonName}`,
      `Subject Org:     ${analysis.subject.organization || 'N/A'} (${analysis.subject.country || ''})`,
      `Issuer CN:       ${analysis.issuer.commonName}`,
      `Issuer Org:      ${analysis.issuer.organization || 'N/A'}`,
      `Self-Signed:     ${analysis.isSelfSigned ? 'YES' : 'NO'}`,
      ``,
      `Validity Period:`,
      ` - Valid From:   ${analysis.validFrom}`,
      ` - Valid Until:  ${analysis.validTo}`,
      ` - Days Left:    ${analysis.daysRemaining} days (${analysis.statusLabel})`,
      ``,
      `Technical Details:`,
      ` - Serial Num:   ${analysis.serialNumber}`,
      ` - SHA-256 FP:   ${analysis.sha256Fingerprint}`,
      ` - Algorithm:    ${analysis.publicKeyAlgorithm}`,
      ``,
      `Subject Alternative Names (${analysis.subjectAlternativeNames.length}):`,
      ...analysis.subjectAlternativeNames.map((san) => ` * ${san}`),
    ].join('\n');
  }, [analysis]);

  const handleAudit = () => {
    addHistoryItem(
      'X.509 Certificate Viewer',
      `Audited SSL Cert: ${analysis.subject.commonName}`
    );
  };

  const getBadgeStyle = (status: string) => {
    if (status === 'Valid')
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (status === 'Expiring Soon')
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
  };

  return (
    <ToolPage
      title="X.509 Certificate Viewer & SSL Chain Auditor"
      description="Inspect PEM X.509 SSL/TLS certificates to audit expiration dates, issuer authority, SANs, serial numbers, and SHA-256 fingerprints"
      category="Security"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const sample = SAMPLE_CERTIFICATES.find(
                  (s) => s.name === e.target.value
                );
                if (sample) setPem(sample.pem);
              }}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Sample Certificate...
              </option>
              {SAMPLE_CERTIFICATES.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <ToolToolbar
            onRun={handleAudit}
            runLabel="Audit Certificate"
            onLoadSample={() => setPem(SAMPLE_CERTIFICATES[1].pem)}
            onClear={() => setPem('')}
            onCopyOutput={() => copyOutput(reportText)}
            canCopy={Boolean(pem)}
            onDownloadOutput={() =>
              downloadFile(reportText, `ssl-certificate-audit.txt`)
            }
            canDownload={Boolean(pem)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status={analysis.statusLabel === 'Valid' ? 'success' : 'error'}
          message={`${analysis.statusLabel} (${analysis.daysRemaining} days left)`}
          detail={`CN: ${analysis.subject.commonName} | Issuer: ${analysis.issuer.commonName}`}
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <FileCheck className="h-4 w-4 text-primary" />
              <span>PEM X.509 Certificate Input</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              -----BEGIN CERTIFICATE-----
            </span>
          </div>

          <textarea
            rows={16}
            value={pem}
            onChange={(e) => setPem(e.target.value)}
            placeholder="Paste raw PEM SSL certificate here..."
            className="w-full flex-1 rounded-xl border border-border bg-background p-3 font-mono text-xs text-foreground focus:outline-none"
          />
        </div>
      }
      outputPanel={
        <div className="flex h-full flex-col space-y-4 overflow-y-auto">
          {/* Status & Expiry Bar */}
          <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground">
                  SSL Validity Status
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Valid From: {analysis.validFrom.slice(0, 10)} → Until:{' '}
                  {analysis.validTo.slice(0, 10)}
                </span>
              </div>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold ${getBadgeStyle(
                analysis.statusLabel
              )}`}
            >
              {analysis.statusLabel} ({analysis.daysRemaining} days)
            </span>
          </div>

          {/* Subject vs Issuer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Globe className="h-4 w-4 text-primary" />
                <span>Subject (Issued To)</span>
              </div>
              <div className="text-xs space-y-1">
                <div className="font-mono font-bold text-sm text-foreground">
                  {analysis.subject.commonName}
                </div>
                <div className="text-muted-foreground">
                  Org: {analysis.subject.organization || 'N/A'} (
                  {analysis.subject.country})
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Award className="h-4 w-4 text-primary" />
                <span>Issuer (Certificate Authority)</span>
              </div>
              <div className="text-xs space-y-1">
                <div className="font-mono font-bold text-sm text-foreground">
                  {analysis.issuer.commonName}
                </div>
                <div className="text-muted-foreground">
                  Org: {analysis.issuer.organization || 'N/A'} (
                  {analysis.issuer.country})
                </div>
              </div>
            </div>
          </div>

          {/* SANs Box */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Building2 className="h-4 w-4 text-primary" />
              <span>
                Subject Alternative Names ({analysis.subjectAlternativeNames.length})
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {analysis.subjectAlternativeNames.map((san) => (
                <span
                  key={san}
                  className="rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-xs font-semibold text-primary"
                >
                  {san}
                </span>
              ))}
            </div>
          </div>

          {/* Serial & Fingerprint Card */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Fingerprint className="h-4 w-4 text-primary" />
              <span>Serial Number & Fingerprints</span>
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex flex-col rounded border border-border bg-background p-2">
                <span className="text-[10px] uppercase font-sans text-muted-foreground">
                  Serial Number
                </span>
                <span className="text-foreground">{analysis.serialNumber}</span>
              </div>
              <div className="flex flex-col rounded border border-border bg-background p-2">
                <span className="text-[10px] uppercase font-sans text-muted-foreground">
                  SHA-256 Fingerprint
                </span>
                <span className="text-foreground break-all">
                  {analysis.sha256Fingerprint}
                </span>
              </div>
            </div>
          </div>

          {/* Warnings Box */}
          {analysis.warnings.length > 0 && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <AlertTriangle className="h-4 w-4" />
                <span>Certificate Audit Warnings ({analysis.warnings.length})</span>
              </div>
              <ul className="space-y-1 text-xs text-amber-200/80 list-disc list-inside">
                {analysis.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

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
