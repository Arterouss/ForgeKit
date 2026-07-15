'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Braces,
  Regex,
  Key,
  Database,
  FileCode,
  Globe,
  Maximize2,
  Minimize2,
  X,
  Sun,
  Moon,
  Laptop,
  Terminal,
  ArrowRight,
  Sparkles,
  History,
  Trash2,
  Package,
  Palette,
  Cpu,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useCommand } from './command-context';
import { useWorkspace } from '@/components/workspace';
import { getAllTools } from '@/sdk/tool-registry';
import { cn } from '@/lib/utils';

export interface PaletteItem {
  id: string;
  title: string;
  description: string;
  category: 'Tools' | 'Workspace' | 'Theme' | 'Actions';
  shortcut?: string;
  action: () => void;
}

export function CommandPalette() {
  const router = useRouter();
  const { isOpen, closeCommandPalette, recentCommandIds, addRecentCommand } = useCommand();
  const { openTab, closeTab, closeAllTabs, activeTabId, isFullscreen, toggleFullscreen, clearHistory } = useWorkspace();
  const { setTheme } = useTheme();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setQuery('');
        setSelectedIndex(0);
        inputRef.current?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const allItems: PaletteItem[] = useMemo(() => {
    const tools = getAllTools();
    const toolItems: PaletteItem[] = tools.map((tool) => ({
      id: `tool-${tool.slug}`,
      title: tool.name,
      description: tool.description,
      category: 'Tools' as const,
      action: () => {
        openTab({
          id: tool.slug,
          title: tool.name,
          category: tool.category,
          href: `/dashboard/tools/${tool.slug}`,
        });
        closeCommandPalette();
      },
    }));

    const workspaceItems: PaletteItem[] = [
      {
        id: 'ws-marketplace',
        title: 'Open Plugin Marketplace & Extension Hub',
        description: 'Browse, install, and sandbox third-party developer plugins',
        category: 'Workspace',
        shortcut: 'Ctrl+M',
        action: () => {
          router.push('/dashboard/marketplace');
          closeCommandPalette();
        },
      },
      {
        id: 'ws-hub',
        title: 'Open Workspace Ecosystem Hub',
        description: 'Manage saved workspaces, snapshots, and JSON import/export',
        category: 'Workspace',
        shortcut: 'Ctrl+1',
        action: () => {
          router.push('/dashboard/workspace');
          closeCommandPalette();
        },
      },
      {
        id: 'ws-collections',
        title: 'Open Collections Manager',
        description: 'Browse and organize custom tool collections & kits',
        category: 'Workspace',
        shortcut: 'Ctrl+2',
        action: () => {
          router.push('/dashboard/collections');
          closeCommandPalette();
        },
      },
      {
        id: 'ws-favorites',
        title: 'Open Favorites Manager',
        description: 'View and launch pinned utilities',
        category: 'Workspace',
        shortcut: 'Ctrl+3',
        action: () => {
          router.push('/dashboard/favorites');
          closeCommandPalette();
        },
      },
      {
        id: 'ws-toggle-fullscreen',
        title: isFullscreen ? 'Exit Fullscreen IDE Mode' : 'Enter Fullscreen IDE Mode',
        description: 'Maximize workspace across dual screens',
        category: 'Workspace',
        shortcut: 'F11',
        action: () => {
          toggleFullscreen();
          closeCommandPalette();
        },
      },
      {
        id: 'ws-close-tab',
        title: 'Close Active Utility Tab',
        description: 'Dismiss current active tool window',
        category: 'Workspace',
        shortcut: 'Ctrl+W',
        action: () => {
          if (activeTabId) closeTab(activeTabId);
          closeCommandPalette();
        },
      },
      {
        id: 'ws-close-all',
        title: 'Close All Open Tabs',
        description: 'Reset active workspace window sessions',
        category: 'Workspace',
        action: () => {
          closeAllTabs();
          closeCommandPalette();
        },
      },
    ];

    const themeItems: PaletteItem[] = [
      {
        id: 'theme-dark',
        title: 'Switch to Dark Glass Theme',
        description: 'High contrast obsidian glass aesthetic with purple glow',
        category: 'Theme',
        action: () => {
          setTheme('dark');
          closeCommandPalette();
        },
      },
      {
        id: 'theme-light',
        title: 'Switch to Light Theme',
        description: 'Clean high contrast bright aesthetic',
        category: 'Theme',
        action: () => {
          setTheme('light');
          closeCommandPalette();
        },
      },
      {
        id: 'theme-midnight',
        title: 'Switch to Midnight Theme',
        description: 'Deep pitch black AMOLED mode for OLED displays',
        category: 'Theme',
        action: () => {
          setTheme('midnight');
          closeCommandPalette();
        },
      },
      {
        id: 'theme-nord',
        title: 'Switch to Nord Arctic Theme',
        description: 'Clean Arctic frost palette for focused development',
        category: 'Theme',
        action: () => {
          setTheme('nord');
          closeCommandPalette();
        },
      },
      {
        id: 'theme-tokyo-night',
        title: 'Switch to Tokyo Night Theme',
        description: 'Cyberpunk indigo-slate theme with neon highlights',
        category: 'Theme',
        action: () => {
          setTheme('tokyo-night');
          closeCommandPalette();
        },
      },
      {
        id: 'theme-dracula',
        title: 'Switch to Dracula Theme',
        description: 'Classic dark purple theme with pink accents',
        category: 'Theme',
        action: () => {
          setTheme('dracula');
          closeCommandPalette();
        },
      },
      {
        id: 'theme-system',
        title: 'Use System Theme',
        description: 'Sync appearance with OS settings',
        category: 'Theme',
        action: () => {
          setTheme('system');
          closeCommandPalette();
        },
      },
    ];

    const actionItems: PaletteItem[] = [
      {
        id: 'action-clear-history',
        title: 'Clear Activity History',
        description: 'Remove all recorded logs from utility center',
        category: 'Actions',
        action: () => {
          clearHistory();
          closeCommandPalette();
        },
      },
    ];

    return [...toolItems, ...workspaceItems, ...themeItems, ...actionItems];
  }, [openTab, closeCommandPalette, router, isFullscreen, toggleFullscreen, activeTabId, closeTab, closeAllTabs, setTheme, clearHistory]);

  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      const recent = recentCommandIds
        .map((id) => allItems.find((item) => item.id === id))
        .filter((item): item is PaletteItem => Boolean(item));

      const remaining = allItems.filter((item) => !recentCommandIds.includes(item.id));
      return [...recent, ...remaining];
    }
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [allItems, query, recentCommandIds]);

  useEffect(() => {
    if (selectedIndex >= filteredItems.length) {
      const timer = setTimeout(() => setSelectedIndex(0), 0);
      return () => clearTimeout(timer);
    }
  }, [filteredItems, selectedIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeCommandPalette();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(filteredItems.length, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev <= 0 ? Math.max(filteredItems.length - 1, 0) : prev - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredItems[selectedIndex];
        if (selected) {
          addRecentCommand(selected.id);
          selected.action();
          closeCommandPalette();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, closeCommandPalette, addRecentCommand]);

  const getIcon = (item: PaletteItem) => {
    switch (item.id) {
      case 'tool-json-formatter':
        return <Braces className="h-4 w-4 text-cyan-400" />;
      case 'tool-regex-tester':
        return <Regex className="h-4 w-4 text-fuchsia-400" />;
      case 'tool-jwt-decoder':
        return <Key className="h-4 w-4 text-lime-400" />;
      case 'tool-sql-formatter':
        return <Database className="h-4 w-4 text-yellow-400" />;
      case 'tool-base64-encoder':
        return <FileCode className="h-4 w-4 text-cyan-300" />;
      case 'tool-curl-builder':
        return <Globe className="h-4 w-4 text-violet-400" />;
      case 'ws-marketplace':
        return <Package className="h-4 w-4 text-fuchsia-400" />;
      case 'ws-toggle-fullscreen':
        return isFullscreen ? <Minimize2 className="h-4 w-4 text-cyan-400" /> : <Maximize2 className="h-4 w-4 text-cyan-400" />;
      case 'ws-close-tab':
      case 'ws-close-all':
        return <X className="h-4 w-4 text-rose-400" />;
      case 'theme-dark':
        return <Moon className="h-4 w-4 text-cyan-400" />;
      case 'theme-light':
        return <Sun className="h-4 w-4 text-yellow-400" />;
      case 'theme-midnight':
      case 'theme-nord':
      case 'theme-tokyo-night':
      case 'theme-dracula':
        return <Palette className="h-4 w-4 text-fuchsia-400" />;
      case 'theme-system':
        return <Laptop className="h-4 w-4 text-lime-400" />;
      case 'action-clear-history':
        return <Trash2 className="h-4 w-4 text-rose-500" />;
      default:
        return <Terminal className="h-4 w-4 text-cyan-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4 select-none font-mono">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closeCommandPalette}
            className="fixed inset-0 bg-[#070512]/85 backdrop-blur-md"
          />

          {/* Cyber Terminal Spotlight Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border-2 border-cyan-400 bg-[#0c091f]/95 shadow-[0_0_60px_rgba(0,240,255,0.35)]"
          >
            {/* Top Retro Computer Strip */}
            <div className="flex items-center justify-between border-b border-cyan-500/30 bg-[#070512] px-5 py-2.5 text-[11px]">
              <div className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full bg-fuchsia-500/80 border border-fuchsia-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/80 border border-yellow-300" />
                <span className="h-3 w-3 rounded-full bg-lime-400/80 border border-lime-300 animate-pulse" />
                <span className="text-cyan-300 font-extrabold tracking-wider ml-1">
                  DEVFORGE_SPOTLIGHT_TERMINAL // CMD_BUFFER
                </span>
              </div>
              <span className="text-lime-400 font-bold flex items-center gap-1">
                <Cpu className="h-3 w-3" /> WASM_EXEC
              </span>
            </div>

            {/* Search Input Bar */}
            <div className="flex items-center border-b border-cyan-500/30 px-5 py-4 bg-[#090718]">
              <span className="text-fuchsia-400 font-black text-lg mr-3">{'>'}</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="search_commands --instant (e.g. JSON, Regex, JWT, Theme)..."
                className="flex-1 bg-transparent text-sm sm:text-base text-cyan-100 placeholder:text-cyan-400/50 focus:outline-none font-mono"
              />
              <kbd className="hidden sm:flex items-center gap-1 rounded border border-cyan-500/40 bg-cyan-500/20 px-2.5 py-1 font-mono text-[10px] font-bold text-cyan-300">
                ESC
              </kbd>
            </div>

            {/* Command List Area */}
            <div className="max-h-[380px] overflow-y-auto p-3 bg-[#0c091f]">
              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-cyan-400/60 font-mono">
                  <Terminal className="h-8 w-8 text-fuchsia-400 mb-2 animate-bounce" />
                  <p className="text-xs font-bold text-cyan-200">NO TARGET COMMANDS OR MODULES DETECTED</p>
                  <p className="text-[11px] opacity-75 mt-1">Verify query string syntax or clear buffer</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {!query && recentCommandIds.length > 0 && (
                    <div className="px-3 pt-2 pb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5 border-b border-cyan-500/20 mb-2">
                      <History className="h-3 w-3 text-fuchsia-400" />
                      <span>// RECENT_COMMAND_HISTORY</span>
                    </div>
                  )}

                  {filteredItems.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <div
                        key={item.id}
                        onMouseEnter={() => setSelectedIndex(index)}
                        onClick={() => {
                          addRecentCommand(item.id);
                          item.action();
                          closeCommandPalette();
                        }}
                        className={cn(
                          'flex items-center justify-between rounded-xl px-3.5 py-3 transition-all cursor-pointer font-mono',
                          isSelected
                            ? 'bg-cyan-500/20 border border-cyan-400 text-white shadow-[0_0_15px_rgba(0,240,255,0.25)] scale-[1.01]'
                            : 'hover:bg-cyan-500/10 text-cyan-200/80 border border-transparent'
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors",
                            isSelected
                              ? "border-cyan-400 bg-cyan-500/30 text-white shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                              : "border-cyan-500/30 bg-[#070512] text-cyan-400"
                          )}>
                            {getIcon(item)}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className={cn(
                              "text-xs font-bold truncate",
                              isSelected ? "text-white" : "text-cyan-200"
                            )}>
                              {item.title}
                            </span>
                            <span className="text-[11px] text-cyan-400/70 truncate font-sans">
                              {item.description}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          <span className={cn(
                            "rounded px-2 py-0.5 text-[10px] font-bold uppercase",
                            isSelected ? "bg-cyan-400 text-[#070512]" : "bg-[#070512] border border-cyan-500/30 text-cyan-400"
                          )}>
                            {item.category}
                          </span>
                          {item.shortcut && (
                            <kbd className="hidden sm:inline-block rounded border border-cyan-500/40 bg-[#070512] px-2 py-0.5 font-mono text-[10px] font-extrabold text-lime-400">
                              {item.shortcut}
                            </kbd>
                          )}
                          {isSelected && (
                            <ArrowRight className="h-4 w-4 text-lime-400 shrink-0 stroke-[3]" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div className="flex items-center justify-between border-t border-cyan-500/30 bg-[#070512] px-5 py-2.5 text-[11px] text-cyan-400 font-mono">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-cyan-500/40 bg-cyan-500/15 px-1.5 py-0.5 text-[10px] font-extrabold text-cyan-300">↑</kbd>
                  <kbd className="rounded border border-cyan-500/40 bg-cyan-500/15 px-1.5 py-0.5 text-[10px] font-extrabold text-cyan-300">↓</kbd>
                  <span>NAVIGATE</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-lime-500/40 bg-lime-500/15 px-1.5 py-0.5 text-[10px] font-extrabold text-lime-400">↵</kbd>
                  <span>EXECUTE</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-lime-400 font-extrabold">
                <Sparkles className="h-3.5 w-3.5 text-fuchsia-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>TERMINAL_READY</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
