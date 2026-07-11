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
  placeholder = 'Search tools, commands, categories…',
  value,
  onChange,
  onFocus,
  showShortcut = true,
  className,
}: SearchBarProps) {
  return (
    <div
      className={cn(
        'group relative flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 transition-colors focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 hover:border-muted-foreground/30',
        className
      )}
    >
      <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
      {showShortcut && (
        <kbd className="hidden items-center gap-0.5 rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:flex">
          <Command className="h-2.5 w-2.5" />K
        </kbd>
      )}
    </div>
  );
}
