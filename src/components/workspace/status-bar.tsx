'use client';

import { useEffect, useState } from 'react';
import { CircleDot, GitBranch } from 'lucide-react';
import { useWorkspace } from './workspace-context';

export function StatusBar() {
  const { activeTab } = useWorkspace();
  const [online, setOnline] = useState(true);
  useEffect(() => { const update = () => setOnline(navigator.onLine); window.addEventListener('online', update); window.addEventListener('offline', update); return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update); }; }, []);
  return <footer className="flex h-7 shrink-0 items-center justify-between border-t border-white/[.07] bg-[#101014] px-4 text-[10px] text-zinc-600 sm:px-5"><span className="flex items-center gap-3"><span className="flex items-center gap-1.5"><GitBranch className="size-3" />main</span><span className="hidden sm:inline">{activeTab?.title ?? 'Workspace ready'}</span></span><span className="hidden md:flex items-center gap-1.5 text-zinc-500"><span>Built by</span><a href="https://github.com/Arterouss" target="_blank" rel="noopener noreferrer" className="font-semibold text-zinc-300 hover:text-cyan-400 transition-colors">@Arterouss</a></span><span className="flex items-center gap-1.5"><CircleDot className={`size-3 ${online ? 'text-teal-200' : 'text-rose-300'}`} />{online ? 'Local session' : 'Offline'}</span></footer>;
}
