'use client';

import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  Terminal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface OutputPanelProps {
  title?: string;
  value: string;
  errorMessage?: string | null;
  executionTimeMs?: number | null;
  language?: string;
  onCopy?: () => void;
  onDownload?: () => void;
  children?: React.ReactNode;
  headerRight?: React.ReactNode;
}

export function OutputPanel({
  title = 'Output Result',
  value,
  errorMessage = null,
  executionTimeMs = null,
  language = 'Result',
  onCopy,
  onDownload,
  children,
  headerRight,
}: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (onCopy) {
      onCopy();
    } else if (value) {
      navigator.clipboard?.writeText(value);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = value ? value.split(/\r\n|\r|\n/).length : 0;
  const hasError = Boolean(errorMessage);

  return (
    <div className="flex h-full min-h-[320px] flex-col overflow-hidden rounded-xl border border-border bg-card/60 shadow-sm">
      {/* Panel Header */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-border bg-card/80 px-3 select-none">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">{title}</span>

          {hasError ? (
            <span className="inline-flex items-center gap-1 rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive">
              <AlertCircle className="h-3 w-3" />
              Error
            </span>
          ) : value ? (
            <span className="inline-flex items-center gap-1 rounded bg-success/10 px-1.5 py-0.5 text-[10px] font-semibold text-success">
              <CheckCircle2 className="h-3 w-3" />
              Valid {language}
            </span>
          ) : (
            <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              Ready
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
          {executionTimeMs !== null && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-primary" />
              {executionTimeMs} ms
            </span>
          )}

          {value && !hasError && <span>{lineCount} lines</span>}

          <div className="h-3 w-px bg-border mx-1" />

          {headerRight}

          <button
            onClick={handleCopy}
            disabled={!value && !hasError}
            className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 transition-colors"
            title="Copy output"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-success" />
                <span className="text-success font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>

          {onDownload && (
            <button
              onClick={onDownload}
              disabled={!value || hasError}
              className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 transition-colors"
              title="Download result"
            >
              <Download className="h-3 w-3" />
              <span>Download</span>
            </button>
          )}
        </div>
      </div>

      {/* Panel Content / Error Banner */}
      <div className="relative flex-1 overflow-hidden flex flex-col">
        {hasError && (
          <div className="flex items-start gap-2.5 border-b border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-semibold">Execution or Syntax Error</span>
              <span className="font-mono text-[11px] mt-0.5 text-destructive/90">
                {errorMessage}
              </span>
            </div>
          </div>
        )}

        <div className="relative flex-1 overflow-auto">
          {children ? (
            children
          ) : (
            <pre
              className={cn(
                'h-full w-full overflow-auto p-4 font-mono text-xs text-foreground',
                !value && !hasError && 'text-muted-foreground italic'
              )}
            >
              <code>{value || 'No output generated yet...'}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
