'use client';

import { useState, useMemo } from 'react';
import {
  Link2,
  ArrowRightLeft,
  ListFilter,
  AlertCircle,
} from 'lucide-react';
import {
  encodeUrlText,
  decodeUrlText,
  parseUrlComponents,
  URL_ENCODER_PRESETS,
  type UrlEncodingMode,
} from '@/lib/url-encoder-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function UrlEncoderDecoderPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [inputString, setInputString] = useState<string>(
    URL_ENCODER_PRESETS[0].content
  );
  const [mode, setMode] = useState<UrlEncodingMode>('component');
  const [action, setAction] = useState<'encode' | 'decode'>('encode');

  const outputString = useMemo(() => {
    if (action === 'encode') {
      return encodeUrlText(inputString, mode);
    }
    return decodeUrlText(inputString, mode);
  }, [inputString, mode, action]);

  const parsedComponents = useMemo(
    () => parseUrlComponents(action === 'encode' ? inputString : outputString),
    [inputString, outputString, action]
  );

  const handleRunConversion = () => {
    addHistoryItem(
      'URL Encoder / Decoder',
      `${action === 'encode' ? 'Encoded' : 'Decoded'} URL string (${mode})`
    );
  };

  const handleSwapInputOutput = () => {
    setInputString(outputString);
    setAction(action === 'encode' ? 'decode' : 'encode');
  };

  return (
    <ToolPage
      title="URL Encoder / Decoder"
      description="Encode and decode URLs, URI components, and query parameters with RFC 3986 and form-data (+) modes, plus interactive URL structure and query parameter inspection"
      category="Encoding"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const preset = URL_ENCODER_PRESETS.find(
                  (p) => p.name === e.target.value
                );
                if (preset) {
                  setInputString(preset.content);
                  setAction('encode');
                }
              }}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Sample URL / Query...
              </option>
              {URL_ENCODER_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAction('encode')}
                className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                  action === 'encode'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                Encode URL
              </button>
              <button
                type="button"
                onClick={() => setAction('decode')}
                className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                  action === 'decode'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                Decode URL
              </button>
              <button
                type="button"
                onClick={handleSwapInputOutput}
                title="Swap Input and Output"
                className="flex items-center gap-1 rounded bg-secondary/20 px-2 py-1 text-xs font-semibold text-secondary hover:bg-secondary/30"
              >
                <ArrowRightLeft className="h-3.5 w-3.5" />
                <span>Swap</span>
              </button>
            </div>
          </div>

          <ToolToolbar
            onRun={handleRunConversion}
            runLabel={action === 'encode' ? 'Encode String' : 'Decode String'}
            onLoadSample={() => {
              setInputString(URL_ENCODER_PRESETS[0].content);
              setAction('encode');
            }}
            onClear={() => setInputString('')}
            onCopyOutput={() => copyOutput(outputString)}
            canCopy={Boolean(outputString)}
            onDownloadOutput={() =>
              downloadFile(outputString, 'url-encoded-output.txt')
            }
            canDownload={Boolean(outputString)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status={parsedComponents.isValid ? 'success' : 'info'}
          message={
            action === 'encode'
              ? 'URI Component Encoded'
              : 'URI Component Decoded'
          }
          detail={
            parsedComponents.isValid
              ? `Valid URL Host: ${parsedComponents.host}`
              : 'String or URI Component Query Fragment'
          }
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* Mode Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <span className="text-xs font-bold text-foreground">
              Encoding Standard Mode
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setMode('component')}
                className={`rounded px-2.5 py-1 text-xs font-bold ${
                  mode === 'component'
                    ? 'bg-primary/20 text-primary border border-primary/40'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                RFC 3986 Component
              </button>
              <button
                type="button"
                onClick={() => setMode('full')}
                className={`rounded px-2.5 py-1 text-xs font-bold ${
                  mode === 'full'
                    ? 'bg-primary/20 text-primary border border-primary/40'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                Full Absolute URI
              </button>
              <button
                type="button"
                onClick={() => setMode('form')}
                className={`rounded px-2.5 py-1 text-xs font-bold ${
                  mode === 'form'
                    ? 'bg-primary/20 text-primary border border-primary/40'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                Form Space (+)
              </button>
            </div>
          </div>

          {/* Input Area */}
          <div className="space-y-1.5 flex-1 flex flex-col">
            <label className="text-xs font-bold text-foreground">
              Input URL / Query Parameter String
            </label>
            <textarea
              rows={6}
              value={inputString}
              onChange={(e) => setInputString(e.target.value)}
              placeholder="Paste URL or query parameter text here..."
              className="w-full flex-1 rounded-xl border border-border bg-background p-3 font-mono text-xs text-foreground focus:outline-none"
            />
          </div>

          {/* URL Breakdown Inspector */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Link2 className="h-4 w-4 text-primary" />
              <span>URL Structure Inspector</span>
            </div>

            {parsedComponents.isValid ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="rounded-lg border border-border bg-background p-2.5">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">
                      Protocol
                    </div>
                    <div className="font-mono font-bold text-primary mt-0.5">
                      {parsedComponents.protocol}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-2.5">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">
                      Host / Domain
                    </div>
                    <div className="font-mono font-bold text-foreground mt-0.5">
                      {parsedComponents.host}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-2.5">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">
                      Pathname
                    </div>
                    <div className="font-mono text-foreground mt-0.5">
                      {parsedComponents.pathname}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-2.5">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">
                      Query Count
                    </div>
                    <div className="font-mono font-bold text-emerald-400 mt-0.5">
                      {parsedComponents.queryParams.length} Parameters
                    </div>
                  </div>
                </div>

                {/* Query Parameters Table */}
                {parsedComponents.queryParams.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <ListFilter className="h-3.5 w-3.5 text-primary" />
                      <span>Parsed Query Parameters Breakdown</span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-border bg-background">
                      <table className="w-full text-left text-xs font-mono">
                        <thead>
                          <tr className="border-b border-border bg-card text-muted-foreground">
                            <th className="p-2 font-bold">Key</th>
                            <th className="p-2 font-bold">Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {parsedComponents.queryParams.map((param, idx) => (
                            <tr key={`${param.key}_${idx}`} className="hover:bg-card/40">
                              <td className="p-2 font-bold text-primary">
                                {param.key}
                              </td>
                              <td className="p-2 text-foreground break-all">
                                {param.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background p-3 text-xs text-muted-foreground">
                <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
                <span>
                  Input is a raw query component or fragment string. Structure inspection is enabled when an absolute URL (https://...) is present.
                </span>
              </div>
            )}
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title={action === 'encode' ? 'Encoded URL Output' : 'Decoded URL Output'}
          value={outputString}
          language="text"
        />
      }
    />
  );
}
