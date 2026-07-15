'use client';

import React, { useState } from 'react';
import { Check, Columns2, Maximize2, Minimize2, Share2, Square } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useWorkspace } from './workspace-context';
import { cn } from '@/lib/utils';

export function ToolContainer({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const { activeTab, isFullscreen, toggleFullscreen } = useWorkspace();
  const [splitView, setSplitView] = useState(true);
  const [copied, setCopied] = useState(false);
  const isToolRoute = pathname?.startsWith('/dashboard/tools');

  if (!isToolRoute) return <div className="flex flex-1 flex-col overflow-y-auto bg-[#09090b]">{children}</div>;
  if (!activeTab) return <div className="flex flex-1 items-center justify-center bg-[#09090b]"><div className="app-panel max-w-sm p-7 text-center"><p className="text-sm font-medium text-zinc-200">Choose a tool to begin</p><p className="mt-2 text-xs leading-5 text-zinc-500">Open any utility from the dashboard to start a focused session.</p></div></div>;
  const share = () => { navigator.clipboard?.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return <div className="flex flex-1 flex-col overflow-hidden bg-[#09090b]">
    <div className="flex h-12 shrink-0 items-center justify-end gap-3 border-b border-white/[.07] bg-[#101014]/80 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex shrink-0 items-center gap-1"><div className="hidden rounded-lg border border-white/[.07] bg-white/[.035] p-0.5 sm:flex"><button onClick={() => setSplitView(true)} className={cn('grid size-7 place-items-center rounded-md transition', splitView ? 'bg-white/[.1] text-white' : 'text-zinc-600 hover:text-zinc-300')} title="Split view"><Columns2 className="size-3.5" /></button><button onClick={() => setSplitView(false)} className={cn('grid size-7 place-items-center rounded-md transition', !splitView ? 'bg-white/[.1] text-white' : 'text-zinc-600 hover:text-zinc-300')} title="Single view"><Square className="size-3.5" /></button></div><button onClick={share} className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs text-zinc-500 transition hover:bg-white/[.06] hover:text-white">{copied ? <Check className="size-3.5 text-teal-200" /> : <Share2 className="size-3.5" />}<span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span></button><button onClick={toggleFullscreen} className="grid size-8 place-items-center rounded-lg text-zinc-500 transition hover:bg-white/[.06] hover:text-white" title="Toggle fullscreen">{isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}</button></div>
    </div>
    <div className={cn('flex-1 overflow-y-auto', splitView ? 'tool-split-view' : '')}><div className="mx-auto w-full max-w-7xl p-5 sm:p-7 lg:p-8">{children}</div></div>
  </div>;
}
