'use client';

import { useState, useMemo, useRef } from 'react';
import { Image as ImageIcon, Upload, ArrowRightLeft } from 'lucide-react';
import {
  encodeBase64Text,
  decodeBase64Text,
  SAMPLE_BASE64_TEXT,
} from '@/lib/base64-utils';
import { useDownload, useClipboard } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  InputPanel,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export type Base64Mode = 'encode' | 'decode';

export function Base64StudioPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const [mode, setMode] = useState<Base64Mode>('decode');
  const [input, setInput] = useState<string>(SAMPLE_BASE64_TEXT);
  const [urlSafe, setUrlSafe] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { downloadFile } = useDownload();

  // Run encode or decode
  const result = useMemo(() => {
    if (!input.trim()) {
      return {
        output: '',
        isValid: true,
        error: null,
        detectedMime: null,
        isImage: false,
        dataUrl: null,
        sizeBytes: 0,
      };
    }

    if (mode === 'encode') {
      const encoded = encodeBase64Text(input, urlSafe);
      return {
        output: encoded,
        isValid: true,
        error: null,
        detectedMime: 'text/plain',
        isImage: false,
        dataUrl: null,
        sizeBytes: input.length,
      };
    } else {
      const decoded = decodeBase64Text(input);
      return {
        output: decoded.text ?? '',
        isValid: decoded.isValid,
        error: decoded.error,
        detectedMime: decoded.detectedMime,
        isImage: decoded.isImage,
        dataUrl: decoded.dataUrl,
        sizeBytes: decoded.sizeBytes,
      };
    }
  }, [input, mode, urlSafe]);

  const handleRun = () => {
    addHistoryItem(
      'Base64 Studio Pro',
      `${mode === 'encode' ? 'Encoded Text' : 'Decoded Base64'} (${urlSafe ? 'URL-Safe' : 'Standard'})`
    );
  };

  const handleLoadSample = () => {
    if (mode === 'decode') {
      setInput(SAMPLE_BASE64_TEXT);
    } else {
      setInput('DevForge — The Ultimate Developer Toolbox');
    }
  };

  const handleClear = () => {
    setInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64DataUrl = String(reader.result ?? '');
      // If we are in encode mode, switch to decode mode and display encoded file or keep raw base64
      const commaIndex = base64DataUrl.indexOf(',');
      const rawBase64 = commaIndex >= 0 ? base64DataUrl.slice(commaIndex + 1) : base64DataUrl;
      setMode('decode');
      setInput(rawBase64);
      addHistoryItem('Base64 Studio Pro', `Uploaded File: ${file.name} (${file.size} bytes)`);
    };
    reader.readAsDataURL(file);
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'encode' ? 'decode' : 'encode'));
    if (result.isValid && result.output) {
      setInput(result.output);
    }
  };

  return (
    <ToolPage
      title="Base64 Studio Pro"
      description="Encode, decode, and inspect text, JSON, images, and binary files with smart MIME detection and URL-safe formatting"
      category="Encoding"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            {/* Mode Switcher */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setMode('encode')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  mode === 'encode'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <span>Encode Text</span>
              </button>
              <button
                onClick={() => setMode('decode')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  mode === 'decode'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <span>Decode Base64</span>
              </button>
              <button
                onClick={toggleMode}
                title="Swap Input and Output"
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </button>
            </div>

            {/* Options & File Upload */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={urlSafe}
                  onChange={(e) => setUrlSafe(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                />
                <span>URL-Safe (- / _)</span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <Upload className="h-3.5 w-3.5 text-primary" />
                <span>Encode File</span>
              </button>
            </div>
          </div>

          <ToolToolbar
            onRun={handleRun}
            runLabel={mode === 'encode' ? 'Encode to Base64' : 'Decode Base64'}
            onLoadSample={handleLoadSample}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(result.output)}
            canCopy={result.isValid && Boolean(result.output)}
            onDownloadOutput={() =>
              downloadFile(result.output, `devforge-base64-${mode}.txt`)
            }
            canDownload={result.isValid && Boolean(result.output)}
          />
        </div>
      }
      statusArea={
        result.isValid ? (
          <StatusArea
            status="success"
            message={
              mode === 'encode'
                ? 'Text Encoded Successfully'
                : result.isImage
                  ? 'Decoded Image Data URL'
                  : 'Decoded Base64 String'
            }
            detail={
              result.detectedMime
                ? `Detected MIME: ${result.detectedMime} (${result.sizeBytes} bytes)`
                : undefined
            }
          />
        ) : (
          <StatusArea
            status="error"
            message="Invalid Base64 Encoding"
            detail={result.error ?? 'Corrupted Base64 sequence'}
          />
        )
      }
      inputPanel={
        <InputPanel
          title={mode === 'encode' ? 'Plain Text / Input' : 'Base64 Encoded String'}
          value={input}
          onChange={setInput}
          language="text"
          onClear={handleClear}
        />
      }
      outputPanel={
        <div className="flex h-full flex-col gap-3">
          {result.isImage && result.dataUrl && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card/60 p-4 text-center">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-3">
                <ImageIcon className="h-4 w-4 text-primary" />
                <span>Image Preview ({result.detectedMime})</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.dataUrl}
                alt="Decoded Base64 preview"
                className="max-h-48 max-w-full rounded-lg border border-border object-contain shadow-sm"
              />
            </div>
          )}
          <div className="flex-1">
            <OutputPanel
              title={mode === 'encode' ? 'Base64 Encoded Result' : 'Decoded Result'}
              value={result.output}
              language="text"
              errorMessage={result.error ?? undefined}
            />
          </div>
        </div>
      }
    />
  );
}
