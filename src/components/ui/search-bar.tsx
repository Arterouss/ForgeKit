'use client';

import { cn } from '@/lib/utils';
import { Search, Command } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  showShortcut?: boolean;
  className?: string;
}

export function SearchBar({
  placeholder = '> search_tools --query="all"...',
  value,
  onChange,
  onFocus,
  showShortcut = true,
  className,
}: SearchBarProps) {
  return (
    <div
      className={cn(
        'group relative flex items-center gap-3 rounded-2xl border-2 border-cyan-500/40 bg-[#070512]/90 px-4 py-3 transition-all focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:border-cyan-400/70 font-mono',
        className
      )}
    >
      <div className="flex items-center gap-2 shrink-0">
        <Search className="h-4 w-4 text-cyan-400 group-focus-within:text-fuchsia-400 transition-colors" />
        <span className="text-fuchsia-400 font-extrabold">{'>'}</span>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm sm:text-base text-cyan-100 placeholder:text-cyan-400/50 focus:outline-none font-mono"
      />
      {showShortcut && (
        <kbd className="hidden items-center gap-1 rounded-lg border border-cyan-500/40 bg-cyan-500/20 px-2 py-0.5 font-mono text-[11px] font-bold text-cyan-300 sm:flex shadow-sm">
          <Command className="h-3 w-3" />K
        </kbd>
      )}
    </div>
  );
}
