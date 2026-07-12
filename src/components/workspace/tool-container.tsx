'use client';

import React, { useState } from 'react';
import {
  Maximize2,
  Minimize2,
  Columns,
  Square,
  Share2,
  Check,
} from 'lucide-react';
import { useWorkspace } from './workspace-context';
import { WorkspaceEmpty } from './workspace-empty';
import { cn } from '@/lib/utils';

interface ToolContainerProps {
  children?: React.ReactNode;
}

export function ToolContainer({ children }: ToolContainerProps) {
  const { activeTab, isFullscreen, toggleFullscreen } = useWorkspace();
  const [splitView, setSplitView] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!activeTab) {
    return <WorkspaceEmpty />;
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Tool Action Header Strip */}
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-border bg-card/40 px-4">
        {/* Left: Tool Title & Category */}
        <div className="flex items-center gap-2.5">
          <span className="font-heading text-sm font-semibold text-foreground">
            {activeTab.title}
          </span>
          <span className="rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {activeTab.category}
          </span>
          {activeTab.isDirty && (
            <span className="flex items-center gap-1 text-[11px] text-amber-500">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Unsaved changes
            </span>
          )}
        </div>

        {/* Right: Layout & Actions */}
        <div className="flex items-center gap-2">
          {/* Layout mode toggle */}
          <div className="hidden sm:flex items-center rounded-lg border border-border bg-muted/30 p-0.5">
            <button
              onClick={() => setSplitView(true)}
              className={cn(
                'flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors',
                splitView
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              title="Split view"
            >
              <Columns className="h-3.5 w-3.5" />
              <span>Split</span>
            </button>
            <button
              onClick={() => setSplitView(false)}
              className={cn(
                'flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors',
                !splitView
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              title="Single view"
            >
              <Square className="h-3.5 w-3.5" />
              <span>Single</span>
            </button>
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {/* Quick Share Link */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
            title="Copy URL link to this tool"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-success" />
                <span className="text-success">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span>Share</span>
              </>
            )}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Tool Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background/30">
        {children}
      </div>
    </div>
  );
}
