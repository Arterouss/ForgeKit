'use client';

import { useState, useMemo } from 'react';
import {
  FileCode2,
  AlertTriangle,
  Globe,
  Building2,
  Lock,
} from 'lucide-react';
import {
  decodeCsr,
  SAMPLE_CSR_PRESETS,
} from '@/lib/csr-decoder-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function CsrDecoderPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [pem, setPem] = useState<string>(SAMPLE_CSR_PRESETS[0].pem);

  const analysis = useMemo(() => decodeCsr(pem), [pem]);

  const reportText = useMemo(() => {
    return [
      `CSR Inspection Report`,
      `=====================`,
      `Common Name (CN): ${analysis.subject.commonName}`,
      `Organization (O): ${analysis.subject.organization || 'N/A'}`,
      `Org Unit (OU):    ${analysis.subject.organizationalUnit || 'N/A'}`,
      `Location:         ${analysis.subject.locality || ''}, ${analysis.subject.state || ''} (${analysis.subject.country || ''})`,
      ``,
      `Subject Alternative Names (SANs):`,
      ...analysis.subjectAlternativeNames.map((san) => ` - DNS: ${san}`),
      ``,
      `Public Key Info:`,
      ` - Algorithm: ${analysis.publicKeyAlgorithm}`,
      ` - Key Size:  ${analysis.keySizeBits} bits`,
      ` - Sig Algo:  ${analysis.signatureAlgorithm}`,
      ``,
      `Warnings (${analysis.warnings.length}):`,
      ...analysis.warnings.map((w) => ` * ${w}`),
    ].join('\n');
  }, [analysis]);

  const handleInspect = () => {
    addHistoryItem(
      'CSR Decoder',
      `Inspected CSR for ${analysis.subject.commonName}`
    );
  };

  return (
    <ToolPage
      title="X.509 Certificate Signing Request (CSR) Decoder"
      description="Inspect PEM-encoded PKCS#10 Certificate Signing Requests to verify Common Name (CN), SANs, Organization fields, and RSA/ECDSA key size"
      category="Security"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const sample = SAMPLE_CSR_PRESETS.find(
                  (s) => s.name === e.target.value
                );
                if (sample) setPem(sample.pem);
              }}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Sample CSR...
              </option>
              {SAMPLE_CSR_PRESETS.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <ToolToolbar
            onRun={handleInspect}
            runLabel="Inspect CSR"
            onLoadSample={() => setPem(SAMPLE_CSR_PRESETS[1].pem)}
            onClear={() => setPem('')}
            onCopyOutput={() => copyOutput(reportText)}
            canCopy={Boolean(pem)}
            onDownloadOutput={() =>
              downloadFile(reportText, `csr-inspection-report.txt`)
            }
            canDownload={Boolean(pem)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status={analysis.valid ? 'success' : 'error'}
          message={
            analysis.valid
              ? `Valid CSR: ${analysis.subject.commonName}`
              : 'Invalid CSR Format'
          }
          detail={`Algorithm: ${analysis.publicKeyAlgorithm} | SANs: ${analysis.subjectAlternativeNames.length}`}
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <FileCode2 className="h-4 w-4 text-primary" />
              <span>PEM Certificate Signing Request Input</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              -----BEGIN CERTIFICATE REQUEST-----
            </span>
          </div>

          <textarea
            rows={16}
            value={pem}
            onChange={(e) => setPem(e.target.value)}
            placeholder="Paste raw PEM encoded CSR here..."
            className="w-full flex-1 rounded-xl border border-border bg-background p-3 font-mono text-xs text-foreground focus:outline-none"
          />
        </div>
      }
      outputPanel={
        <div className="flex h-full flex-col space-y-4 overflow-y-auto">
          {/* Primary Subject Box */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground border-b border-border pb-2">
              <Globe className="h-4 w-4 text-primary" />
              <span>Subject Distinguished Name (DN)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Common Name (CN)
                </span>
                <span className="font-mono font-bold text-foreground text-sm">
                  {analysis.subject.commonName || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Organization (O)
                </span>
                <span className="font-semibold text-foreground">
                  {analysis.subject.organization || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Organizational Unit (OU)
                </span>
                <span className="font-semibold text-foreground">
                  {analysis.subject.organizationalUnit || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Location (L, ST, C)
                </span>
                <span className="font-semibold text-foreground">
                  {analysis.subject.locality}, {analysis.subject.state} (
                  {analysis.subject.country})
                </span>
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
                  DNS: {san}
                </span>
              ))}
            </div>
          </div>

          {/* Public Key & Security Box */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Lock className="h-4 w-4 text-primary" />
              <span>Cryptographic Key Parameters</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded border border-border bg-background p-2.5">
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Algorithm
                </span>
                <span className="font-bold text-foreground">
                  {analysis.publicKeyAlgorithm}
                </span>
              </div>
              <div className="rounded border border-border bg-background p-2.5">
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Key Size
                </span>
                <span className="font-mono font-bold text-primary">
                  {analysis.keySizeBits} bits
                </span>
              </div>
              <div className="rounded border border-border bg-background p-2.5">
                <span className="text-[10px] uppercase text-muted-foreground block">
                  Signature Algo
                </span>
                <span className="font-mono font-bold text-foreground">
                  {analysis.signatureAlgorithm}
                </span>
              </div>
            </div>
          </div>

          {/* Warnings Box */}
          {analysis.warnings.length > 0 && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <AlertTriangle className="h-4 w-4" />
                <span>Inspection Warnings ({analysis.warnings.length})</span>
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
