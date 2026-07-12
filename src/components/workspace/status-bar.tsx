'use client';

import { useState, useEffect } from 'react';
import {
  Terminal,
  Cpu,
  CheckCircle2,
  GitBranch,
} from 'lucide-react';
import { useWorkspace } from './workspace-context';
import { cn } from '@/lib/utils';

export function StatusBar() {
  const { activeTab } = useWorkspace();
  const [isOnline, setIsOnline] = useState(true);
  const [memoryUsage, setMemoryUsage] = useState<string>('32 MB');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsOnline(navigator.onLine);
      // Simulate/read memory if supported
      if ('memory' in performance) {
        const mem = (performance as unknown as { memory: { usedJSHeapSize: number } }).memory;
        if (mem && mem.usedJSHeapSize) {
          setMemoryUsage(`${Math.round(mem.usedJSHeapSize / 1024 / 1024)} MB`);
        }
      }
    }, 0);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <footer className="flex h-7 shrink-0 items-center justify-between border-t border-border bg-card/70 px-3 font-mono text-[11px] text-muted-foreground select-none z-10">
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Branch / Workspace */}
        <div className="flex items-center gap-1.5 text-foreground">
          <GitBranch className="h-3 w-3 text-primary" />
          <span>main</span>
        </div>

        <div className="h-3 w-px bg-border" />

        {/* Online / Offline status */}
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'h-2 w-2 rounded-full',
              isOnline ? 'bg-success animate-pulse' : 'bg-destructive'
            )}
          />
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>

        <div className="h-3 w-px bg-border hidden sm:block" />

        {/* Active Tool */}
        <div className="hidden sm:flex items-center gap-1.5">
          <Terminal className="h-3 w-3 text-primary" />
          <span className="text-foreground">
            {activeTab ? activeTab.title : 'Workspace Idle'}
          </span>
        </div>
      </div>

      {/* Center section: Runtime Engine status */}
      <div className="hidden md:flex items-center gap-2">
        <div className="flex items-center gap-1 text-xs">
          <CheckCircle2 className="h-3 w-3 text-success" />
          <span>Engine Ready</span>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Memory / Performance */}
        <div className="hidden sm:flex items-center gap-1" title="Estimated JS Heap Size">
          <Cpu className="h-3 w-3" />
          <span>Heap: {memoryUsage}</span>
        </div>

        <div className="h-3 w-px bg-border hidden sm:block" />

        {/* Encoding & EOL */}
        <div className="hidden lg:flex items-center gap-2">
          <span>UTF-8</span>
          <span>LF</span>
          <span>TypeScript</span>
        </div>

        <div className="h-3 w-px bg-border hidden lg:block" />

        {/* Version badge */}
        <span className="font-semibold text-foreground">v0.1.0</span>
      </div>
    </footer>
  );
}
