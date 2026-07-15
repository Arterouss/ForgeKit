'use client';

import { ArrowRight, Blocks } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { CategoryDefinition } from '@/sdk/tool-types';

interface CategoryCardProps { category: CategoryDefinition; toolCount?: number; onClick?: () => void; className?: string; }
export function CategoryCard({ category, toolCount = 0, onClick, className }: CategoryCardProps) {
  return <motion.button whileHover={{ y: -3 }} onClick={onClick} className={cn('group flex h-full w-full flex-col rounded-2xl border border-white/[.09] bg-white/[.035] p-5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,.04)] transition hover:border-white/[.16] hover:bg-white/[.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300', className)}><span className="grid size-10 place-items-center rounded-xl bg-violet-300/15 text-violet-200"><Blocks className="size-4" /></span><p className="mt-7 text-[10px] font-medium uppercase tracking-[.13em] text-zinc-600">{toolCount} tools</p><h3 className="mt-2 text-base font-medium text-zinc-100">{category.name}</h3><p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500">{category.description}</p><span className="mt-5 flex items-center gap-1 text-xs font-medium text-violet-200">Explore <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" /></span></motion.button>;
}
