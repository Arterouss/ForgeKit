'use client';

import { MoreHorizontal, Pin, PinOff, X } from 'lucide-react';
import { useWorkspace, WorkspaceTab } from './workspace-context';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function WorkspaceTabs() {
  const { tabs, activeTabId, openTab, closeTab, closeOtherTabs, closeAllTabs, togglePinTab } = useWorkspace();
  const renderTab = (tab: WorkspaceTab) => <div key={tab.id} onClick={() => openTab(tab)} className={cn('group flex h-10 max-w-52 cursor-pointer items-center gap-2 border-r border-white/[.06] px-3 text-xs transition', tab.id === activeTabId ? 'bg-[#16161b] text-zinc-100 shadow-[inset_0_2px_0_#c4b5fd]' : 'bg-[#101014] text-zinc-500 hover:bg-white/[.04] hover:text-zinc-300')}><span className={cn('size-1.5 shrink-0 rounded-full', tab.isDirty ? 'bg-amber-200' : tab.isPinned ? 'bg-violet-300' : 'bg-zinc-600')} /><span className="truncate">{tab.title}</span><button onClick={(event) => { event.stopPropagation(); closeTab(tab.id); }} className="ml-auto hidden rounded p-0.5 text-zinc-500 hover:bg-white/[.08] hover:text-white group-hover:block"><X className="size-3" /></button><DropdownMenu><DropdownMenuTrigger onClick={(event) => event.stopPropagation()} className="hidden rounded p-0.5 text-zinc-500 hover:bg-white/[.08] group-hover:block"><MoreHorizontal className="size-3" /></DropdownMenuTrigger><DropdownMenuContent align="start" className="w-44 border-white/10 bg-[#19191e] text-zinc-200"><DropdownMenuItem onClick={() => togglePinTab(tab.id)}>{tab.isPinned ? <PinOff className="mr-2 size-3.5" /> : <Pin className="mr-2 size-3.5" />}{tab.isPinned ? 'Unpin tab' : 'Pin tab'}</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem onClick={() => closeOtherTabs(tab.id)}>Close other tabs</DropdownMenuItem><DropdownMenuItem onClick={closeAllTabs}>Close all unpinned</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div>;
  return <div className="flex h-10 shrink-0 overflow-x-auto border-b border-white/[.07] bg-[#101014]">{tabs.map(renderTab)}</div>;
}
