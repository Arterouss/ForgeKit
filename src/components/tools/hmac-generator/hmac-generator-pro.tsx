'use client';

import { useState, useEffect } from 'react';
import {
  KeyRound,
  ShieldCheck,
  Copy,
  Check,
  FileText,
  CheckCircle2,
  XCircle,
  Lock,
} from 'lucide-react';
import {
  generateHmac,
  verifyHmacMatch,
  SAMPLE_HMAC_PRESETS,
  type HmacAlgorithm,
  type HmacResult,
} from '@/lib/hmac-generator-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function HmacGeneratorPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [algorithm, setAlgorithm] = useState<HmacAlgorithm>('SHA-256');
  const [secret, setSecret] = useState<string>(SAMPLE_HMAC_PRESETS[0].secret);
  const [message, setMessage] = useState<string>(
    SAMPLE_HMAC_PRESETS[0].message
  );
  const [targetSignatureToVerify, setTargetSignatureToVerify] =
    useState<string>('');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const [result, setResult] = useState<HmacResult>({
    algorithm: 'SHA-256',
    hex: '',
    base64: '',
    keyLength: secret.length,
    messageLength: message.length,
  });

  useEffect(() => {
    let mounted = true;
    generateHmac(message, secret, algorithm).then((res) => {
      if (mounted) setResult(res);
    });
    return () => {
      mounted = false;
    };
  }, [message, secret, algorithm]);

  const outputSummary = [
    `HMAC Signature Report`,
    `=====================`,
    `Algorithm: HMAC-${algorithm}`,
    `Secret Length: ${secret.length} chars`,
    `Message Length: ${message.length} chars`,
    ``,
    `Hex Signature:`,
    `${result.hex}`,
    ``,
    `Base64 Signature:`,
    `${result.base64}`,
  ].join('\n');

  const handleRunHmac = () => {
    addHistoryItem(
      'HMAC Generator',
      `Computed HMAC-${algorithm} signature`
    );
  };

  const handleCopy = (val: string, format: string) => {
    copyOutput(val);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 1500);
  };

  const isVerifiedMatch =
    targetSignatureToVerify.trim().length > 0 &&
    verifyHmacMatch(result, targetSignatureToVerify);

  return (
    <ToolPage
      title="HMAC Generator & Signature Verifier"
      description="Compute cryptographic HMAC-SHA1, HMAC-SHA256, and HMAC-SHA512 signatures locally, compare webhook digests, and export Hex or Base64 signatures"
      category="Security"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <div className="flex items-center gap-1.5">
              {(['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as HmacAlgorithm[]).map(
                (algo) => (
                  <button
                    key={algo}
                    type="button"
                    onClick={() => setAlgorithm(algo)}
                    className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                      algorithm === algo
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    HMAC-{algo}
                  </button>
                )
              )}
            </div>

            <select
              onChange={(e) => {
                const sample = SAMPLE_HMAC_PRESETS.find(
                  (s) => s.name === e.target.value
                );
                if (sample) {
                  setAlgorithm(sample.algorithm);
                  setSecret(sample.secret);
                  setMessage(sample.message);
                }
              }}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Webhook Sample...
              </option>
              {SAMPLE_HMAC_PRESETS.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <ToolToolbar
            onRun={handleRunHmac}
            runLabel="Compute HMAC"
            onLoadSample={() => {
              setAlgorithm(SAMPLE_HMAC_PRESETS[1].algorithm);
              setSecret(SAMPLE_HMAC_PRESETS[1].secret);
              setMessage(SAMPLE_HMAC_PRESETS[1].message);
            }}
            onClear={() => {
              setSecret('');
              setMessage('');
              setTargetSignatureToVerify('');
            }}
            onCopyOutput={() => copyOutput(outputSummary)}
            canCopy={Boolean(result.hex)}
            onDownloadOutput={() =>
              downloadFile(outputSummary, `hmac-${algorithm}-signature.txt`)
            }
            canDownload={Boolean(result.hex)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status="success"
          message={`HMAC-${algorithm} Computed`}
          detail={`Key: ${secret.length} chars | Message: ${message.length} chars`}
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* Secret Key Input */}
          <div className="space-y-1 rounded-xl border border-border bg-background p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Lock className="h-4 w-4 text-primary" />
                <span>HMAC Secret / Signing Key</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">
                {secret.length} chars
              </span>
            </div>
            <input
              type="text"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter webhook or API signing secret key..."
              className="w-full rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none"
            />
          </div>

          {/* Message Payload Input */}
          <div className="space-y-1.5 flex-1 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <FileText className="h-4 w-4 text-primary" />
                <span>Payload / Signed Message Data</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">
                {message.length} chars
              </span>
            </div>
            <textarea
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter raw message body or payload to sign..."
              className="w-full flex-1 rounded-xl border border-border bg-background p-3 font-mono text-xs text-foreground focus:outline-none"
            />
          </div>

          {/* Signature Match Verifier Box */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Verify Expected Signature (Hex or Base64)</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={targetSignatureToVerify}
                onChange={(e) => setTargetSignatureToVerify(e.target.value)}
                placeholder="Paste incoming webhook X-Signature header to verify match..."
                className="w-full rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none"
              />
              {targetSignatureToVerify.trim().length > 0 && (
                <div
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold shrink-0 ${
                    isVerifiedMatch
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {isVerifiedMatch ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>VALID</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" />
                      <span>MISMATCH</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      }
      outputPanel={
        <div className="flex h-full flex-col space-y-4 overflow-y-auto">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <KeyRound className="h-4 w-4 text-primary" />
            <span>Generated HMAC-{algorithm} Signatures</span>
          </div>

          {/* Hex Output Card */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground uppercase">
                Hexadecimal Output (Lowercase)
              </span>
              <button
                type="button"
                onClick={() => handleCopy(result.hex, 'hex')}
                className="flex items-center gap-1 rounded bg-secondary/40 px-2.5 py-1 text-xs font-bold text-foreground hover:bg-primary/20 hover:text-primary transition-colors"
              >
                {copiedFormat === 'hex' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-primary" />
                    <span className="text-primary">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Hex</span>
                  </>
                )}
              </button>
            </div>
            <div className="rounded border border-border bg-background p-3 font-mono text-xs text-foreground break-all select-all">
              {result.hex || 'Computing...'}
            </div>
          </div>

          {/* Base64 Output Card */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground uppercase">
                Base64 Encoded Output
              </span>
              <button
                type="button"
                onClick={() => handleCopy(result.base64, 'base64')}
                className="flex items-center gap-1 rounded bg-secondary/40 px-2.5 py-1 text-xs font-bold text-foreground hover:bg-primary/20 hover:text-primary transition-colors"
              >
                {copiedFormat === 'base64' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-primary" />
                    <span className="text-primary">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Base64</span>
                  </>
                )}
              </button>
            </div>
            <div className="rounded border border-border bg-background p-3 font-mono text-xs text-foreground break-all select-all">
              {result.base64 || 'Computing...'}
            </div>
          </div>

          <div className="hidden">
            <OutputPanel
              title="Full Output"
              value={outputSummary}
              language="text"
            />
          </div>
        </div>
      }
    />
  );
}
