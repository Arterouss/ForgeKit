'use client';

import { useState, useEffect } from 'react';
import {
  Hash,
  Copy,
  Check,
  ShieldCheck,
  FileText,
  Search,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  generateAllHashes,
  verifyHashMatch,
  SAMPLE_TEXTS_TO_HASH,
  type HashAlgorithm,
  type HashResult,
} from '@/lib/hash-generator-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function HashGeneratorPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [inputData, setInputData] = useState<string>(
    SAMPLE_TEXTS_TO_HASH[0].text
  );
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [targetHashToVerify, setTargetHashToVerify] = useState<string>('');
  const [copiedAlgo, setCopiedAlgo] = useState<string | null>(null);

  const [hashes, setHashes] = useState<Record<HashAlgorithm, HashResult>>({
    'SHA-1': { algorithm: 'SHA-1', hex: '', uppercaseHex: '', byteLength: 20 },
    'SHA-256': {
      algorithm: 'SHA-256',
      hex: '',
      uppercaseHex: '',
      byteLength: 32,
    },
    'SHA-384': {
      algorithm: 'SHA-384',
      hex: '',
      uppercaseHex: '',
      byteLength: 48,
    },
    'SHA-512': {
      algorithm: 'SHA-512',
      hex: '',
      uppercaseHex: '',
      byteLength: 64,
    },
  });

  useEffect(() => {
    let mounted = true;
    generateAllHashes(inputData || '').then((res) => {
      if (mounted) setHashes(res);
    });
    return () => {
      mounted = false;
    };
  }, [inputData]);

  const fullTextOutput = [
    `DevForge Hash Generator Report`,
    `=============================`,
    `Input Text (${inputData.length} chars): ${inputData}`,
    ``,
    `SHA-1:   ${uppercase ? hashes['SHA-1'].uppercaseHex : hashes['SHA-1'].hex}`,
    `SHA-256: ${uppercase ? hashes['SHA-256'].uppercaseHex : hashes['SHA-256'].hex}`,
    `SHA-384: ${uppercase ? hashes['SHA-384'].uppercaseHex : hashes['SHA-384'].hex}`,
    `SHA-512: ${uppercase ? hashes['SHA-512'].uppercaseHex : hashes['SHA-512'].hex}`,
  ].join('\n');

  const handleRunHash = () => {
    addHistoryItem('Hash Generator', `Computed SHA hashes for text`);
  };

  const handleCopyAlgo = (algo: HashAlgorithm) => {
    const val = uppercase ? hashes[algo].uppercaseHex : hashes[algo].hex;
    copyOutput(val);
    setCopiedAlgo(algo);
    setTimeout(() => setCopiedAlgo(null), 1500);
  };

  const matchFound =
    targetHashToVerify.trim().length > 0 &&
    (verifyHashMatch(hashes['SHA-1'].hex, targetHashToVerify) ||
      verifyHashMatch(hashes['SHA-256'].hex, targetHashToVerify) ||
      verifyHashMatch(hashes['SHA-384'].hex, targetHashToVerify) ||
      verifyHashMatch(hashes['SHA-512'].hex, targetHashToVerify));

  return (
    <ToolPage
      title="Cryptographic Hash Generator (SHA-1 / SHA-256 / SHA-512)"
      description="Compute locally-secure SHA digests via Web Crypto API, compare verification checksums, and export formatted hexadecimal hashes"
      category="Security"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const sample = SAMPLE_TEXTS_TO_HASH.find(
                  (s) => s.name === e.target.value
                );
                if (sample) setInputData(sample.text);
              }}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Sample Text...
              </option>
              {SAMPLE_TEXTS_TO_HASH.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="rounded accent-primary"
              />
              <span>Uppercase Hex Output</span>
            </label>
          </div>

          <ToolToolbar
            onRun={handleRunHash}
            runLabel="Compute Hashes"
            onLoadSample={() => {
              setInputData(SAMPLE_TEXTS_TO_HASH[1].text);
            }}
            onClear={() => {
              setInputData('');
              setTargetHashToVerify('');
            }}
            onCopyOutput={() => copyOutput(fullTextOutput)}
            canCopy={Boolean(inputData)}
            onDownloadOutput={() =>
              downloadFile(fullTextOutput, `devforge-hashes.txt`)
            }
            canDownload={Boolean(inputData)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status="success"
          message={`SHA-256 Computed (${hashes['SHA-256'].byteLength} bytes)`}
          detail={`Input length: ${inputData.length} characters`}
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          <div className="space-y-1.5 flex-1 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <FileText className="h-4 w-4 text-primary" />
                <span>Text / Payload Input to Hash</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">
                {inputData.length} chars
              </span>
            </div>
            <textarea
              rows={8}
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder="Enter text or paste payload..."
              className="w-full flex-1 rounded-xl border border-border bg-background p-3 font-mono text-xs text-foreground focus:outline-none"
            />
          </div>

          {/* Verification Box */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Search className="h-4 w-4 text-primary" />
              <span>Verify Expected Digest (Check Match)</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={targetHashToVerify}
                onChange={(e) => setTargetHashToVerify(e.target.value)}
                placeholder="Paste expected hex hash to verify against any generated digest..."
                className="w-full rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none"
              />
              {targetHashToVerify.trim().length > 0 && (
                <div
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold shrink-0 ${
                    matchFound
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {matchFound ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>MATCH</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" />
                      <span>NO MATCH</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      }
      outputPanel={
        <div className="flex h-full flex-col space-y-3 overflow-y-auto">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <Hash className="h-4 w-4 text-primary" />
            <span>Generated Cryptographic Digests</span>
          </div>

          <div className="space-y-3">
            {(['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as HashAlgorithm[]).map(
              (algo) => {
                const item = hashes[algo];
                const displayHex = uppercase ? item.uppercaseHex : item.hex;
                return (
                  <div
                    key={algo}
                    className="rounded-xl border border-border bg-card p-3 space-y-1.5 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold text-foreground">
                          {algo}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyAlgo(algo)}
                        className="flex items-center gap-1 rounded bg-secondary/40 px-2 py-0.5 text-xs font-bold text-foreground hover:bg-primary/20 hover:text-primary transition-colors"
                      >
                        {copiedAlgo === algo ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-primary" />
                            <span className="text-primary">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="rounded border border-border bg-background p-2.5 font-mono text-xs text-foreground break-all select-all">
                      {displayHex || 'Computing...'}
                    </div>
                  </div>
                );
              }
            )}
          </div>

          <div className="hidden">
            <OutputPanel
              title="Full Output"
              value={fullTextOutput}
              language="text"
            />
          </div>
        </div>
      }
    />
  );
}
