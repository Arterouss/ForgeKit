'use client';

import { useState, useMemo } from 'react';
import {
  Binary,
  CheckCircle2,
  XCircle,
  Hash,
  Copy,
  Check,
} from 'lucide-react';
import {
  encodeBase32,
  decodeBase32,
  formatBase32Chunks,
  SAMPLE_BASE32_INPUTS,
} from '@/lib/base32-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function Base32Pro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [inputText, setInputText] = useState<string>(
    SAMPLE_BASE32_INPUTS[0].text
  );
  const [withPadding, setWithPadding] = useState<boolean>(true);
  const [copiedChunk, setCopiedChunk] = useState<boolean>(false);

  const encodedResult = useMemo(
    () => encodeBase32(inputText, withPadding),
    [inputText, withPadding]
  );

  const decodedResult = useMemo(() => decodeBase32(inputText), [inputText]);

  const outputValue = useMemo(() => {
    return mode === 'encode' ? encodedResult : decodedResult.decodedText;
  }, [mode, encodedResult, decodedResult]);

  const totpFormatted = useMemo(() => {
    const src = mode === 'encode' ? encodedResult : inputText;
    return formatBase32Chunks(src, 4);
  }, [mode, encodedResult, inputText]);

  const handleRun = () => {
    addHistoryItem(
      'Base32 Encoder / Decoder',
      `${mode === 'encode' ? 'Encoded' : 'Decoded'} Base32 string`
    );
  };

  const handleCopyTotp = () => {
    copyOutput(totpFormatted);
    setCopiedChunk(true);
    setTimeout(() => setCopiedChunk(false), 1500);
  };

  return (
    <ToolPage
      title="RFC 4648 Base32 Encoder / Decoder & TOTP Secret Formatter"
      description="Encode UTF-8 text into standard RFC 4648 Base32 alphabet (A-Z2-7), decode Base32 secrets, and format 4-character TOTP blocks for Authenticator apps"
      category="Security"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setMode('encode');
                  setInputText(SAMPLE_BASE32_INPUTS[0].text);
                }}
                className={`rounded px-3 py-1 text-xs font-bold transition-colors ${
                  mode === 'encode'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                Encode Text → Base32
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('decode');
                  setInputText(SAMPLE_BASE32_INPUTS[0].base32);
                }}
                className={`rounded px-3 py-1 text-xs font-bold transition-colors ${
                  mode === 'decode'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                Decode Base32 → Text
              </button>
            </div>

            <div className="flex items-center gap-3">
              {mode === 'encode' && (
                <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={withPadding}
                    onChange={(e) => setWithPadding(e.target.checked)}
                    className="rounded accent-primary"
                  />
                  <span>Include &apos;=&apos; Padding</span>
                </label>
              )}

              <select
                onChange={(e) => {
                  const sample = SAMPLE_BASE32_INPUTS.find(
                    (s) => s.name === e.target.value
                  );
                  if (sample) {
                    setInputText(mode === 'encode' ? sample.text : sample.base32);
                  }
                }}
                className="rounded border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none"
                defaultValue=""
              >
                <option value="" disabled>
                  Load Sample...
                </option>
                {SAMPLE_BASE32_INPUTS.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ToolToolbar
            onRun={handleRun}
            runLabel={mode === 'encode' ? 'Encode Base32' : 'Decode Base32'}
            onLoadSample={() => {
              setMode('encode');
              setInputText(SAMPLE_BASE32_INPUTS[1].text);
            }}
            onClear={() => setInputText('')}
            onCopyOutput={() => copyOutput(outputValue)}
            canCopy={Boolean(outputValue)}
            onDownloadOutput={() =>
              downloadFile(outputValue, `devforge-base32-${mode}.txt`)
            }
            canDownload={Boolean(outputValue)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status={
            mode === 'encode' || decodedResult.valid ? 'success' : 'error'
          }
          message={
            mode === 'encode'
              ? `Encoded (${encodedResult.length} chars)`
              : decodedResult.valid
                ? 'Valid Base32 Decoded'
                : 'Invalid Base32 Characters'
          }
          detail={`Alphabet: RFC 4648 (A-Z, 2-7)`}
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Binary className="h-4 w-4 text-primary" />
              <span>
                {mode === 'encode'
                  ? 'Input UTF-8 Text String'
                  : 'Input RFC 4648 Base32 Encoded String'}
              </span>
            </div>
          </div>

          <textarea
            rows={14}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              mode === 'encode'
                ? 'Type text to encode into Base32...'
                : 'Paste Base32 string to decode...'
            }
            className="w-full flex-1 rounded-xl border border-border bg-background p-3 font-mono text-xs text-foreground focus:outline-none"
          />
        </div>
      }
      outputPanel={
        <div className="flex h-full flex-col space-y-4 overflow-y-auto">
          {/* Main Output Box */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">
                {mode === 'encode'
                  ? 'Encoded RFC 4648 Base32 Output'
                  : 'Decoded UTF-8 Text Result'}
              </span>
              {mode === 'decode' && (
                <span
                  className={`flex items-center gap-1 text-xs font-bold ${
                    decodedResult.valid ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {decodedResult.valid ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Valid Alphabet</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Invalid Format</span>
                    </>
                  )}
                </span>
              )}
            </div>

            <textarea
              readOnly
              rows={6}
              value={outputValue}
              className="w-full rounded-lg border border-border bg-background p-3 font-mono text-xs text-foreground focus:outline-none select-all"
            />
          </div>

          {/* TOTP Formatter Box */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Hash className="h-4 w-4 text-primary" />
                <span>2FA / TOTP Authenticator App Formatter (4-char blocks)</span>
              </div>
              <button
                type="button"
                onClick={handleCopyTotp}
                className="flex items-center gap-1 rounded bg-secondary/30 px-2.5 py-1 text-xs font-bold text-foreground hover:bg-primary/20 hover:text-primary transition-colors"
              >
                {copiedChunk ? (
                  <>
                    <Check className="h-3 w-3 text-primary" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy Chunks</span>
                  </>
                )}
              </button>
            </div>

            <div className="rounded-lg border border-border bg-background p-3 font-mono text-xs font-bold text-primary tracking-wider break-all">
              {totpFormatted || '(Empty)'}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Authenticator apps (Google Authenticator, 1Password, Authy) format Base32 secret keys into 4-character chunks for manual verification.
            </p>
          </div>

          {/* Hex Representation */}
          {mode === 'decode' && decodedResult.valid && (
            <div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
              <span className="text-xs font-bold text-foreground block">
                Hexadecimal Byte Representation
              </span>
              <div className="rounded-lg border border-border bg-background p-2.5 font-mono text-xs text-muted-foreground break-all">
                {decodedResult.hexString || '(Empty)'}
              </div>
            </div>
          )}

          <div className="hidden">
            <OutputPanel
              title="Output"
              value={outputValue}
              language="text"
            />
          </div>
        </div>
      }
    />
  );
}
