'use client';

import React, { useState } from 'react';
import { ClipboardPaste, RotateCcw, FileText } from 'lucide-react';

export interface InputPanelProps {
  title?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  language?: string;
  children?: React.ReactNode;
  headerRight?: React.ReactNode;
}

export function InputPanel({
  title = 'Input Source',
  value,
  onChange,
  placeholder = 'Enter or paste content here...',
  onClear,
  language = 'Text',
  children,
  headerRight,
}: InputPanelProps) {
  const [pasted, setPasted] = useState(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text);
        setPasted(true);
        setTimeout(() => setPasted(false), 2000);
      }
    } catch {
      // Clipboard read failed or permission denied
    }
  };

  const lineCount = value ? value.split(/\r\n|\r|\n/).length : 0;
  const charCount = value.length;

  return (
    <div className="flex h-full min-h-[320px] flex-col overflow-hidden rounded-xl border border-border bg-card/60 shadow-sm">
      {/* Panel Header */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-border bg-card/80 px-3 select-none">
        <div className="flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">{title}</span>
          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
          <span>
            {lineCount} {lineCount === 1 ? 'line' : 'lines'} • {charCount} chars
          </span>

          <div className="h-3 w-px bg-border mx-1" />

          {headerRight}

          <button
            onClick={handlePaste}
            className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Paste from clipboard"
          >
            <ClipboardPaste className="h-3 w-3" />
            <span>{pasted ? 'Pasted!' : 'Paste'}</span>
          </button>

          {onClear && value.length > 0 && (
            <button
              onClick={onClear}
              className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
              title="Clear input"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Panel Content */}
      <div className="relative flex-1 overflow-hidden">
        {children ? (
          children
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            spellCheck={false}
            className="h-full w-full resize-none border-0 bg-transparent p-4 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
          />
        )}
      </div>
    </div>
  );
}
