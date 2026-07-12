'use client';

import { useState } from 'react';
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Download,
  Upload,
  FileText,
  HelpCircle,
} from 'lucide-react';

export interface ToolToolbarProps {
  onRun?: () => void;
  runLabel?: string;
  onClear?: () => void;
  onLoadSample?: () => void;
  onCopyOutput?: () => void;
  onDownloadOutput?: () => void;
  onUploadInput?: (fileContent: string) => void;
  onShowHelp?: () => void;
  isProcessing?: boolean;
  canCopy?: boolean;
  canDownload?: boolean;
}

export function ToolToolbar({
  onRun,
  runLabel = 'Format / Execute',
  onClear,
  onLoadSample,
  onCopyOutput,
  onDownloadOutput,
  onUploadInput,
  onShowHelp,
  isProcessing = false,
  canCopy = true,
  canDownload = true,
}: ToolToolbarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (onCopyOutput) {
      onCopyOutput();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadInput) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        onUploadInput(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card/60 p-2.5 backdrop-blur-md select-none">
      {/* Left: Primary Execution & Sample Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {onRun && (
          <button
            onClick={onRun}
            disabled={isProcessing}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-50 transition-all"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>{isProcessing ? 'Processing…' : runLabel}</span>
          </button>
        )}

        {onLoadSample && (
          <button
            onClick={onLoadSample}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-background/80 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
          >
            <FileText className="h-3.5 w-3.5 text-primary" />
            <span>Load Sample</span>
          </button>
        )}

        {onUploadInput && (
          <label className="flex items-center gap-1.5 rounded-lg border border-border bg-background/80 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer">
            <Upload className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Upload File</span>
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Right: Clear, Copy, Download, Help */}
      <div className="flex flex-wrap items-center gap-1.5">
        {onClear && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Clear Input & Output"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Clear</span>
          </button>
        )}

        {onCopyOutput && (
          <button
            onClick={handleCopy}
            disabled={!canCopy}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-background/80 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
            title="Copy output to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-success" />
                <span className="text-success font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Copy Output</span>
              </>
            )}
          </button>
        )}

        {onDownloadOutput && (
          <button
            onClick={onDownloadOutput}
            disabled={!canDownload}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-background/80 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
            title="Download output as file"
          >
            <Download className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Download</span>
          </button>
        )}

        {onShowHelp && (
          <button
            onClick={onShowHelp}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Documentation & Usage"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
