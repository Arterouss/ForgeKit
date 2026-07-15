'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ToolPageProps {
  title?: string;
  description?: string;
  category?: string;
  toolbar?: React.ReactNode;
  inputPanel?: React.ReactNode;
  outputPanel?: React.ReactNode;
  statusArea?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  splitView?: boolean;
}

export function ToolPage({
  title,
  description,
  category,
  toolbar,
  inputPanel,
  outputPanel,
  statusArea,
  children,
  className,
  splitView = true,
}: ToolPageProps) {
  return (
    <div className={cn('flex flex-1 flex-col space-y-5 overflow-hidden', className)}>
      {/* Tool Page Title Header (optional if shown inside container) */}
      {(title || description) && (
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2">
            {title && (
              <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                {title}
              </h1>
            )}
            {category && (
              <span className="rounded-full border border-white/[.09] bg-white/[.045] px-2.5 py-1 text-[10px] font-medium text-zinc-400">
                {category}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Action Toolbar */}
      {toolbar && <div className="shrink-0">{toolbar}</div>}

      {/* Status Area Notification */}
      {statusArea && <div className="shrink-0">{statusArea}</div>}

      {/* Main Tool Panels */}
      {children ? (
        <div className="flex-1 overflow-auto">{children}</div>
      ) : (
        <div
          className={cn(
            'grid flex-1 gap-4 overflow-hidden min-h-[460px]',
            splitView ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
          )}
        >
          {inputPanel && <div className="flex flex-col overflow-hidden">{inputPanel}</div>}
          {outputPanel && <div className="flex flex-col overflow-hidden">{outputPanel}</div>}
        </div>
      )}
    </div>
  );
}
