'use client';

import { useState } from 'react';
import { Copy, Check, Trash2, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  placeholder?: string;
  readOnly?: boolean;
  rows?: number;
  className?: string;
  showLineNumbers?: boolean;
}

export function CodeEditor({
  value,
  onChange,
  language = 'text',
  placeholder = 'Enter code or text here...',
  readOnly = false,
  rows = 12,
  className,
  showLineNumbers = true,
}: CodeEditorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard error
    }
  };

  const handleClear = () => {
    if (onChange && !readOnly) {
      onChange('');
    }
  };

  const lines = value.split('\n');
  const lineCount = Math.max(lines.length, 1);

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl border border-border bg-card/80 overflow-hidden transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30',
        className
      )}
    >
      {/* Editor Header */}
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {!readOnly && value.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              title="Clear editor content"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            disabled={!value}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition disabled:opacity-40"
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative flex flex-1 overflow-hidden font-mono text-xs">
        {showLineNumbers && (
          <div className="select-none flex flex-col items-end border-r border-border/40 bg-muted/20 px-3 py-3.5 text-muted-foreground/60">
            {Array.from({ length: lineCount }).map((_, i) => (
              <span key={i} className="leading-relaxed">
                {i + 1}
              </span>
            ))}
          </div>
        )}

        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          rows={rows}
          className="w-full flex-1 resize-y bg-transparent p-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none leading-relaxed"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
