'use client';

import { useState, useMemo } from 'react';
import {
  FileCode,
  CheckCircle2,
  XCircle,
  Terminal,
} from 'lucide-react';
import {
  encodeHex,
  decodeHex,
  generateHexDump,
  SAMPLE_HEX_INPUTS,
  type HexDelimiter,
} from '@/lib/hex-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function HexPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [mode, setMode] = useState<'encode' | 'decode' | 'dump'>('encode');
  const [inputText, setInputText] = useState<string>(
    SAMPLE_HEX_INPUTS[0].text
  );
  const [delimiter, setDelimiter] = useState<HexDelimiter>('none');
  const [uppercase, setUppercase] = useState<boolean>(true);

  const encodedResult = useMemo(
    () => encodeHex(inputText, delimiter, uppercase),
    [inputText, delimiter, uppercase]
  );

  const decodedResult = useMemo(() => decodeHex(inputText), [inputText]);

  const hexDumpResult = useMemo(() => {
    const src = mode === 'decode' ? decodedResult.decodedText : inputText;
    return generateHexDump(src);
  }, [mode, decodedResult.decodedText, inputText]);

  const outputValue = useMemo(() => {
    if (mode === 'encode') return encodedResult;
    if (mode === 'decode') return decodedResult.decodedText;
    return hexDumpResult;
  }, [mode, encodedResult, decodedResult.decodedText, hexDumpResult]);

  const handleRun = () => {
    addHistoryItem(
      'Hex Encoder / Decoder',
      `Processed Hex (${mode.toUpperCase()})`
    );
  };

  return (
    <ToolPage
      title="Hexadecimal Encoder / Decoder & Memory Byte Dump Viewer"
      description="Encode UTF-8 strings into Hex bytes with custom delimiters (space, colon, 0x), decode Hex payloads, and inspect 16-byte memory hex dumps"
      category="Security"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <div className="flex items-center gap-1.5">
              {[
                { id: 'encode', label: 'Encode Text → Hex' },
                { id: 'decode', label: 'Decode Hex → Text' },
                { id: 'dump', label: 'Hex Memory Dump (16-Byte)' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setMode(t.id as 'encode' | 'decode' | 'dump');
                    if (t.id === 'decode') {
                      setInputText(SAMPLE_HEX_INPUTS[0].hex);
                    } else {
                      setInputText(SAMPLE_HEX_INPUTS[0].text);
                    }
                  }}
                  className={`rounded px-3 py-1 text-xs font-bold transition-colors ${
                    mode === t.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {mode === 'encode' && (
                <>
                  <select
                    value={delimiter}
                    onChange={(e) =>
                      setDelimiter(e.target.value as HexDelimiter)
                    }
                    className="rounded border border-border bg-background px-2 py-0.5 text-xs font-semibold text-foreground focus:outline-none"
                  >
                    <option value="none">No Delimiter (FF00AA)</option>
                    <option value="space">Space (FF 00 AA)</option>
                    <option value="colon">Colon (FF:00:AA)</option>
                    <option value="0x">0x Prefix (0xFF 0x00)</option>
                  </select>

                  <label className="flex items-center gap-1 text-xs font-bold text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={uppercase}
                      onChange={(e) => setUppercase(e.target.checked)}
                      className="rounded accent-primary"
                    />
                    <span>Uppercase</span>
                  </label>
                </>
              )}

              <select
                onChange={(e) => {
                  const sample = SAMPLE_HEX_INPUTS.find(
                    (s) => s.name === e.target.value
                  );
                  if (sample) {
                    setInputText(
                      mode === 'decode' ? sample.hex : sample.text
                    );
                  }
                }}
                className="rounded border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none"
                defaultValue=""
              >
                <option value="" disabled>
                  Load Sample...
                </option>
                {SAMPLE_HEX_INPUTS.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ToolToolbar
            onRun={handleRun}
            runLabel={`Process (${mode.toUpperCase()})`}
            onLoadSample={() => {
              setMode('encode');
              setInputText(SAMPLE_HEX_INPUTS[1].text);
            }}
            onClear={() => setInputText('')}
            onCopyOutput={() => copyOutput(outputValue)}
            canCopy={Boolean(outputValue)}
            onDownloadOutput={() =>
              downloadFile(outputValue, `devforge-hex-${mode}.txt`)
            }
            canDownload={Boolean(outputValue)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status={
            mode !== 'decode' || decodedResult.valid ? 'success' : 'error'
          }
          message={
            mode === 'encode'
              ? `Encoded Hex (${encodedResult.length} chars)`
              : mode === 'dump'
                ? 'Generated 16-Byte Hex Dump'
                : decodedResult.valid
                  ? `Valid Decoded Hex (${decodedResult.byteCount} bytes)`
                  : 'Invalid Hex Payload'
          }
          detail="Hexadecimal Base16 Cryptographic Converter"
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <FileCode className="h-4 w-4 text-primary" />
              <span>
                {mode === 'decode'
                  ? 'Input Hexadecimal Bytes (e.g. 41:42:43)'
                  : 'Input UTF-8 Text / Payload String'}
              </span>
            </div>
          </div>

          <textarea
            rows={14}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              mode === 'decode'
                ? 'Paste hex string to decode...'
                : 'Type text or payload to convert...'
            }
            className="w-full flex-1 rounded-xl border border-border bg-background p-3 font-mono text-xs text-foreground focus:outline-none"
          />
        </div>
      }
      outputPanel={
        <div className="flex h-full flex-col space-y-4 overflow-y-auto">
          {/* Main Output Box */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2 flex-1 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">
                {mode === 'encode'
                  ? 'Hexadecimal Base16 Encoded Bytes'
                  : mode === 'dump'
                    ? 'Classic 16-Byte Hex Memory Dump View'
                    : 'Decoded UTF-8 String Output'}
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
                      <span>Valid Base16</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Invalid Hex</span>
                    </>
                  )}
                </span>
              )}
            </div>

            <textarea
              readOnly
              rows={mode === 'dump' ? 12 : 8}
              value={outputValue}
              className="w-full flex-1 rounded-lg border border-border bg-background p-3 font-mono text-xs text-foreground focus:outline-none select-all whitespace-pre"
            />
          </div>

          {/* Hex Dump Inspector Preview when not in dump mode */}
          {mode !== 'dump' && (
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Terminal className="h-4 w-4 text-primary" />
                <span>Quick Memory Dump Inspector Preview</span>
              </div>
              <pre className="overflow-x-auto rounded-lg border border-border bg-background p-2.5 font-mono text-[11px] text-muted-foreground">
                {hexDumpResult || '(Empty)'}
              </pre>
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
