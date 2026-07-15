'use client';

import type { KeyboardEvent } from 'react';
import { ArrowRight, Blocks, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ToolMetadata } from '@/sdk/tool-types';

interface ToolCardProps { tool: ToolMetadata; isFavorite?: boolean; isRecentlyUsed?: boolean; onFavoriteToggle?: () => void; onClick?: () => void; className?: string; }

export function ToolCard({ tool, isFavorite = false, isRecentlyUsed = false, onFavoriteToggle, onClick, className }: ToolCardProps) {
  const keyDown = (event: KeyboardEvent) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onClick?.(); } };
  return <motion.article whileHover={{ y: -3 }} tabIndex={0} role="button" aria-label={`Launch ${tool.name}`} onKeyDown={keyDown} onClick={onClick} className={cn('group flex h-full cursor-pointer flex-col rounded-2xl border border-white/[.09] bg-white/[.035] p-5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,.04)] transition hover:border-white/[.16] hover:bg-white/[.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300', className)}>
    <div className="flex items-start justify-between gap-3"><span className="grid size-10 place-items-center rounded-xl bg-violet-300/15 text-violet-200"><Blocks className="size-4" /></span><div className="flex items-center gap-2">{isRecentlyUsed && <span className="rounded-full bg-teal-300/10 px-2 py-1 text-[10px] font-medium text-teal-200">Recent</span>}<button type="button" onClick={(event) => { event.stopPropagation(); onFavoriteToggle?.(); }} className="grid size-8 place-items-center rounded-lg text-zinc-600 transition hover:bg-white/[.07] hover:text-violet-200" aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}><Heart className={cn('size-4', isFavorite && 'fill-violet-300 text-violet-300')} /></button></div></div>
    <div className="mt-7"><p className="text-[10px] font-medium uppercase tracking-[.13em] text-zinc-600">{tool.category}</p><h3 className="mt-2 text-base font-medium tracking-tight text-zinc-100">{tool.name}</h3><p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500">{tool.description}</p></div><div className="mt-auto flex items-center justify-between border-t border-white/[.07] pt-4 text-xs text-zinc-600"><span>{tool.shortcut ? <kbd className="keyboard-key">{tool.shortcut}</kbd> : 'Open tool'}</span><ArrowRight className="size-4 transition group-hover:translate-x-0.5 group-hover:text-violet-200" /></div>
  </motion.article>;
}
