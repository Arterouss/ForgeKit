'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pin,
  Clock,
  Search,
  Bell,
  Sun,
  Moon,
  Github,
  Keyboard,
  Terminal,
  Activity,
  PanelRightClose,
  PanelRight,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { APP_VERSION } from '@/constants/app';
import { Sidebar } from './sidebar';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { theme, setTheme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  // Monitor online status
  useEffect(() => {
    // Defer setting state to avoid synchronous effect call warnings
    const timeoutId = setTimeout(() => {
      setIsOnline(navigator.onLine);
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
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background font-sans text-foreground select-none">
      {/* Top Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/30 px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl">⚒️</span>
            <span className="font-heading text-lg font-bold">
              <span className="text-primary">Dev</span>Forge
            </span>
          </Link>
          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            v{APP_VERSION}
          </span>
        </div>

        {/* Global Search Trigger */}
        <div className="flex max-w-md flex-1 px-8">
          <button className="flex w-full items-center gap-2 rounded-xl border border-border bg-card/50 px-3 py-1.5 text-left text-xs text-muted-foreground transition-all hover:border-primary/30 hover:bg-card">
            <Search className="h-3.5 w-3.5" />
            <span>Search tools, commands, categories...</span>
            <kbd className="ml-auto hidden items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[9px] sm:flex">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Arterouss/ForgeKit"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" title="Notifications">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
          </button>
          <button
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className={cn(
              "rounded-lg p-2 transition-colors hover:bg-muted hover:text-foreground",
              rightPanelOpen ? "text-primary bg-primary/10" : "text-muted-foreground"
            )}
            title="Toggle Utility Panel"
          >
            {rightPanelOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
          </button>
          <div className="h-7 w-7 overflow-hidden rounded-full border border-border bg-muted">
            <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
              U
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace + Sidebar + Panel */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

        {/* Main Content Area / Workspace */}
        <main className="flex flex-1 flex-col overflow-y-auto bg-background/50">
          <div className="flex-1 p-6 sm:p-8 max-w-6xl w-full mx-auto">
            {children}
          </div>
        </main>

        {/* Collapsible Utility Panel */}
        <AnimatePresence>
          {rightPanelOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="hidden lg:flex w-[300px] shrink-0 flex-col border-l border-border bg-card/10 overflow-y-auto"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-primary" />
                  Utility Center
                </span>
              </div>

              {/* Pinned Tools */}
              <div className="p-4 border-b border-border">
                <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                  <Pin className="h-3.5 w-3.5 text-muted-foreground" />
                  Pinned Tools
                </h4>
                <div className="space-y-1">
                  {[
                    { name: 'JSON Formatter', desc: 'Beautify and validate JSON' },
                    { name: 'JWT Decoder', desc: 'Decode JWT tokens' },
                  ].map((tool) => (
                    <div key={tool.name} className="group flex items-center justify-between rounded-lg p-2 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium text-foreground">{tool.name}</span>
                        <span className="text-[10px] text-muted-foreground">{tool.desc}</span>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 text-xs text-primary hover:underline">
                        Open
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="p-4 border-b border-border">
                <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  Recent Activity
                </h4>
                <div className="space-y-3">
                  {[
                    { time: '2 mins ago', action: 'Formatted JSON Payload' },
                    { time: '1 hr ago', action: 'Generated Dockerfile' },
                  ].map((act, i) => (
                    <div key={i} className="flex gap-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                      <div className="flex flex-col">
                        <span className="text-xs text-foreground">{act.action}</span>
                        <span className="text-[10px] text-muted-foreground">{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shortcuts */}
              <div className="p-4">
                <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                  <Keyboard className="h-3.5 w-3.5 text-muted-foreground" />
                  Shortcuts
                </h4>
                <div className="space-y-2">
                  {[
                    { key: 'Ctrl + K', desc: 'Global Command Search' },
                    { key: 'Ctrl + Tab', desc: 'Switch Workspace Tabs' },
                    { key: 'Ctrl + W', desc: 'Close Current Tab' },
                  ].map((short, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground text-[11px]">{short.desc}</span>
                      <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground">
                        {short.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Status Bar */}
      <footer className="flex h-8 shrink-0 items-center justify-between border-t border-border bg-card/50 px-4 text-[10px] text-muted-foreground z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className={cn("h-1.5 w-1.5 rounded-full", isOnline ? "bg-success" : "bg-destructive")} />
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          <div className="h-3 w-px bg-border" />
          <span>Workspace: <strong className="text-foreground">Default</strong></span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Terminal className="h-3 w-3" />
            <span>Ready</span>
          </div>
          <div className="h-3 w-px bg-border" />
          <span>v{APP_VERSION}</span>
        </div>
      </footer>
    </div>
  );
}
