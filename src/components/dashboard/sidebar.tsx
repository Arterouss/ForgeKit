'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Blocks,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FolderKanban,
  LayoutGrid,
  Package,
  PanelLeft,
  Search,
  Settings,
  Star,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps { collapsed: boolean; setCollapsed: (collapsed: boolean) => void; }
type Item = { label: string; href: string; icon: React.ElementType };

const primary: Item[] = [
  { label: 'Overview', href: '/dashboard', icon: LayoutGrid },
  { label: 'Workspace', href: '/dashboard/workspace', icon: PanelLeft },
  { label: 'Pinned', href: '/dashboard/pinned', icon: Star },
  { label: 'Recent', href: '/dashboard/recent', icon: Clock3 },
];
const library: Item[] = [
  { label: 'Collections', href: '/dashboard/collections', icon: FolderKanban },
  { label: 'Tools', href: '/dashboard/category/formatting', icon: Blocks },
  { label: 'Plugins', href: '/dashboard/marketplace', icon: Package },
];

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const toggle = () => { const next = !collapsed; setCollapsed(next); localStorage.setItem('devforge_sidebar_collapsed', String(next)); };
  const isActive = (href: string) => href === '/dashboard' ? pathname === href : pathname?.startsWith(href);
  const menu = (title: string, items: Item[]) => <div className="space-y-1">
    {!collapsed && <p className="px-3 pb-1 pt-4 text-[10px] font-medium uppercase tracking-[.14em] text-zinc-600">{title}</p>}
    {items.map(({ label, href, icon: Icon }) => <Link key={href} href={href} title={collapsed ? label : undefined} className={cn('group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition', isActive(href) ? 'bg-white/[.075] text-white' : 'text-zinc-500 hover:bg-white/[.045] hover:text-zinc-200')}>
      {isActive(href) && <motion.span layoutId="active-sidebar-item" className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-violet-300" />}
      <Icon className={cn('size-4 shrink-0', isActive(href) ? 'text-violet-200' : 'text-zinc-500 group-hover:text-zinc-300')} />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>)}
  </div>;

  return <aside className={cn('relative z-20 flex h-full shrink-0 flex-col border-r border-white/[.07] bg-[#0d0d10]/85 backdrop-blur-xl transition-[width] duration-300', collapsed ? 'w-[68px]' : 'w-[242px]')}>
    <div className="flex h-[68px] items-center border-b border-white/[.07] px-3">
      <Link href="/dashboard" className="flex min-w-0 items-center gap-2.5 px-1.5"><span className="grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-200 to-violet-400 text-violet-950 shadow-lg shadow-violet-500/15"><Zap className="size-4 fill-current" /></span>{!collapsed && <span className="truncate text-[15px] font-semibold tracking-tight text-white">DevForge</span>}</Link>
    </div>
    {!collapsed && <button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))} className="mx-3 mt-4 flex items-center justify-between rounded-xl border border-white/[.07] bg-white/[.035] px-3 py-2.5 text-xs text-zinc-500 transition hover:border-white/[.13] hover:text-zinc-300"><span className="flex items-center gap-2"><Search className="size-3.5" />Search tools</span><kbd className="keyboard-key">⌘K</kbd></button>}
    <nav className="flex-1 overflow-y-auto px-3 pb-6">{menu('Workspace', primary)}{menu('Library', library)}</nav>
    <div className="border-t border-white/[.07] p-3"><Link href="/dashboard/settings" title={collapsed ? 'Settings' : undefined} className={cn('flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-500 transition hover:bg-white/[.045] hover:text-zinc-200', pathname?.startsWith('/dashboard/settings') && 'bg-white/[.075] text-white')}><Settings className="size-4" />{!collapsed && 'Settings'}</Link><div className={cn('mt-3 flex items-center gap-2.5 rounded-xl bg-white/[.035] p-2.5', collapsed && 'justify-center')}><span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-zinc-200 to-zinc-400 text-[10px] font-semibold text-zinc-800">DF</span>{!collapsed && <span className="min-w-0"><b className="block truncate text-xs font-medium text-zinc-200">Personal space</b><small className="text-[10px] text-zinc-600">Local workspace</small></span>}</div></div>
    <button onClick={toggle} className="absolute -right-3 top-24 grid size-6 place-items-center rounded-full border border-white/[.12] bg-[#17171c] text-zinc-500 shadow-lg transition hover:text-white"><span className="sr-only">Toggle sidebar</span>{collapsed ? <ChevronRight className="size-3" /> : <ChevronLeft className="size-3" />}</button>
  </aside>;
}
