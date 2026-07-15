'use client';

import { Bell, Github, Menu, Moon, Search, SlidersHorizontal } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useCommand } from '@/components/command';

interface TopBarProps { onSidebarToggle: () => void; onRightPanelToggle: () => void; rightPanelOpen: boolean; }

export function TopBar({ onSidebarToggle, onRightPanelToggle, rightPanelOpen }: TopBarProps) {
  const { setTheme } = useTheme();
  const { openCommandPalette } = useCommand();
  return <header className="z-30 flex h-[68px] shrink-0 items-center border-b border-white/[.07] bg-[#0d0d10]/75 px-4 backdrop-blur-xl sm:px-6">
    <div className="flex flex-1 items-center gap-3"><button onClick={onSidebarToggle} className="grid size-9 place-items-center rounded-lg text-zinc-400 hover:bg-white/[.06] hover:text-white md:hidden"><Menu className="size-4" /></button><button onClick={openCommandPalette} className="flex h-9 w-full max-w-xl items-center gap-2 rounded-xl border border-white/[.07] bg-white/[.035] px-3 text-sm text-zinc-500 transition hover:border-white/[.12] hover:text-zinc-300"><Search className="size-4" /><span className="flex-1 text-left">Search tools, commands, and docs</span><kbd className="keyboard-key hidden sm:block">⌘ K</kbd></button></div>
    <div className="ml-3 flex items-center gap-1"><a href="https://github.com/Arterouss/ForgeKit" target="_blank" rel="noreferrer" className="grid size-9 place-items-center rounded-lg text-zinc-500 transition hover:bg-white/[.06] hover:text-white"><Github className="size-4" /></a><button onClick={() => setTheme('dark')} className="grid size-9 place-items-center rounded-lg text-zinc-500 transition hover:bg-white/[.06] hover:text-white" title="Dark theme"><Moon className="size-4" /></button><button onClick={onRightPanelToggle} className={`grid size-9 place-items-center rounded-lg transition ${rightPanelOpen ? 'bg-violet-300/15 text-violet-200' : 'text-zinc-500 hover:bg-white/[.06] hover:text-white'}`} title="Toggle inspector"><SlidersHorizontal className="size-4" /></button><button className="relative grid size-9 place-items-center rounded-lg text-zinc-500 transition hover:bg-white/[.06] hover:text-white"><Bell className="size-4" /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-violet-300" /></button></div>
  </header>;
}
