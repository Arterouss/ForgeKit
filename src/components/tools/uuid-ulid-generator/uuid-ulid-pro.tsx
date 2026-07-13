'use client';

import { useState, useMemo } from 'react';
import {
  Copy,
  RefreshCw,
  Check,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  Hash,
} from 'lucide-react';
import {
  generateIdentifiersBatch,
  decodeIdentifier,
  SAMPLE_IDENTIFIERS_TO_DECODE,
  type IdentifierType,
} from '@/lib/uuid-ulid-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function UuidUlidPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [idType, setIdType] = useState<IdentifierType>('uuid-v7');
  const [count, setCount] = useState<number>(5);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [seed, setSeed] = useState<number>(1);
  const [decodeInput, setDecodeInput] = useState<string>(
    SAMPLE_IDENTIFIERS_TO_DECODE[0].id
  );
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generatedList = useMemo(
    () => generateIdentifiersBatch(idType, count, uppercase),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [idType, count, uppercase, seed]
  );

  const outputText = useMemo(
    () => generatedList.map((g) => g.value).join('\n'),
    [generatedList]
  );

  const decodeResult = useMemo(
    () => decodeIdentifier(decodeInput),
    [decodeInput]
  );

  const handleRegenerate = () => {
    setSeed((prev) => prev + 1);
    addHistoryItem('UUID / ULID Generator', `Generated ${count} ${idType}s`);
  };

  const handleCopyItem = (val: string, idx: number) => {
    copyOutput(val);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <ToolPage
      title="UUID v4 / UUID v7 / ULID Generator & Timestamp Decoder"
      description="Generate standard random UUID v4, time-ordered RFC 9562 UUID v7, and sortable 26-char ULIDs, plus extract embedded creation timestamps"
      category="Security"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <div className="flex items-center gap-1.5">
              {[
                { id: 'uuid-v7', label: 'UUID v7 (Time-Ordered)' },
                { id: 'uuid-v4', label: 'UUID v4 (Random)' },
                { id: 'ulid', label: 'ULID (Base32 Sortable)' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setIdType(t.id as IdentifierType)}
                  className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                    idType === t.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  className="rounded accent-primary"
                />
                <span>Uppercase</span>
              </label>

              <button
                type="button"
                onClick={handleRegenerate}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Generate New</span>
              </button>
            </div>
          </div>

          <ToolToolbar
            onRun={handleRegenerate}
            runLabel="Generate Batch"
            onLoadSample={() => {
              setIdType('uuid-v7');
              setCount(10);
            }}
            onClear={() => {
              setCount(1);
            }}
            onCopyOutput={() => copyOutput(outputText)}
            canCopy={Boolean(outputText)}
            onDownloadOutput={() =>
              downloadFile(outputText, `devforge-${idType}-list.txt`)
            }
            canDownload={Boolean(outputText)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status="success"
          message={`Generated ${generatedList.length} ${idType.toUpperCase()}`}
          detail="Cryptographically secure local generation"
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Batch Quantity</span>
              <span className="font-mono text-primary font-bold">
                {count} IDs
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 5, 10, 25].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCount(c)}
                  className={`rounded px-3 py-1 text-xs font-bold border transition-colors ${
                    count === c
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-foreground hover:bg-secondary/20'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Timestamp Inspector Box */}
          <div className="rounded-xl border border-border bg-background p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Search className="h-4 w-4 text-primary" />
                <span>Inspect / Decode Embedded Timestamp</span>
              </div>
              <select
                onChange={(e) => {
                  const sample = SAMPLE_IDENTIFIERS_TO_DECODE.find(
                    (s) => s.name === e.target.value
                  );
                  if (sample) setDecodeInput(sample.id);
                }}
                className="rounded border border-border bg-card px-2 py-0.5 text-[11px] font-semibold text-foreground"
                defaultValue=""
              >
                <option value="" disabled>
                  Load Sample...
                </option>
                {SAMPLE_IDENTIFIERS_TO_DECODE.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="text"
              value={decodeInput}
              onChange={(e) => setDecodeInput(e.target.value)}
              placeholder="Paste any UUID v7, UUID v4, or ULID here to inspect..."
              className="w-full rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs text-foreground focus:outline-none"
            />

            {decodeResult.valid ? (
              <div className="rounded-lg border border-border bg-card p-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">
                    {decodeResult.detectedType}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Valid Format</span>
                  </span>
                </div>

                {decodeResult.creationDateUtc ? (
                  <div className="flex items-center gap-1.5 text-foreground font-mono text-xs">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Created: {decodeResult.creationDateUtc}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-[11px]">
                    UUID v4 does not embed creation time (pure random bits).
                  </span>
                )}
              </div>
            ) : decodeInput.trim() ? (
              <div className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-400 font-bold">
                <XCircle className="h-4 w-4" />
                <span>Invalid UUID or ULID format string.</span>
              </div>
            ) : null}
          </div>

          {/* Info Box */}
          <div className="rounded-xl border border-border bg-card p-3 space-y-1 text-xs text-muted-foreground">
            <span className="font-bold text-foreground block">
              Why use UUID v7 or ULID over UUID v4?
            </span>
            <p className="text-[11px]">
              UUID v7 and ULIDs embed a 48-bit millisecond Unix timestamp at the
              beginning of the identifier, making database indexing (B-trees)
              significantly faster and avoiding index fragmentation compared to
              random v4 UUIDs.
            </p>
          </div>
        </div>
      }
      outputPanel={
        <div className="flex h-full flex-col space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-foreground">
            <div className="flex items-center gap-1.5">
              <Hash className="h-4 w-4 text-primary" />
              <span>
                Generated {idType.toUpperCase()} Batch ({generatedList.length})
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {generatedList.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 hover:border-primary/40 transition-colors"
              >
                <div className="flex flex-col overflow-hidden">
                  <span className="font-mono text-sm font-bold text-foreground truncate select-all">
                    {item.value}
                  </span>
                  {item.timestampFormatted && (
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      Time: {item.timestampFormatted}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyItem(item.value, idx)}
                  className="flex shrink-0 items-center gap-1 rounded bg-secondary/30 px-2.5 py-1 text-xs font-bold text-foreground hover:bg-primary/20 hover:text-primary transition-colors"
                >
                  {copiedIndex === idx ? (
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
            ))}
          </div>

          <div className="hidden">
            <OutputPanel
              title="Raw Batch Output"
              value={outputText}
              language="text"
            />
          </div>
        </div>
      }
    />
  );
}
