'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
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
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useCommand } from './command-context';
import { useWorkspace } from '@/components/workspace';
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
  const { isOpen, closeCommandPalette, recentCommandIds, addRecentCommand } = useCommand();
  const { openTab, closeTab, closeAllTabs, activeTabId, isFullscreen, toggleFullscreen, clearHistory } = useWorkspace();
  const { setTheme } = useTheme();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus search input when modal opens
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

  // All available commands and tools
  const allItems: PaletteItem[] = useMemo(
    () => [
      // TOOLS
      {
        id: 'tool-json-formatter',
        title: 'JSON Formatter Pro',
        description: 'Format, validate, minify, and inspect JSON structures',
        category: 'Tools',
        shortcut: 'J',
        action: () => {
          openTab({
            id: 'json-formatter',
            title: 'JSON Formatter',
            category: 'Formatters',
            href: '/dashboard/tools/json-formatter',
          });
        },
      },
      {
        id: 'tool-regex-tester',
        title: 'Regex Tester & Debugger',
        description: 'Real-time regular expression evaluation & match highlighting',
        category: 'Tools',
        shortcut: 'R',
        action: () => {
          openTab({
            id: 'regex-tester',
            title: 'Regex Tester',
            category: 'Text',
            href: '/dashboard/tools/regex-tester',
          });
        },
      },
      {
        id: 'tool-jwt-decoder',
        title: 'JWT Token Inspector',
        description: 'Decode and verify JSON Web Token claims and headers',
        category: 'Tools',
        action: () => {
          openTab({
            id: 'jwt-decoder',
            title: 'JWT Decoder',
            category: 'Security',
            href: '/dashboard/tools/jwt-decoder',
          });
        },
      },
      {
        id: 'tool-sql-formatter',
        title: 'SQL Formatter & Validator',
        description: 'Beautify messy PostgreSQL, MySQL, and SQLite queries',
        category: 'Tools',
        action: () => {
          openTab({
            id: 'sql-formatter',
            title: 'SQL Formatter',
            category: 'Formatters',
            href: '/dashboard/tools/sql-formatter',
          });
        },
      },
      {
        id: 'tool-base64-encoder',
        title: 'Base64 String & File Studio',
        description: 'Encode and decode Base64 strings and binary files',
        category: 'Tools',
        action: () => {
          openTab({
            id: 'base64-encoder',
            title: 'Base64 Encoder',
            category: 'Encoding',
            href: '/dashboard/tools/base64-encoder',
          });
        },
      },
      {
        id: 'tool-curl-builder',
        title: 'HTTP cURL Builder',
        description: 'Construct cURL requests with headers, auth, and bodies',
        category: 'Tools',
        action: () => {
          openTab({
            id: 'curl-builder',
            title: 'cURL Builder',
            category: 'Network',
            href: '/dashboard/tools/curl-builder',
          });
        },
      },

      // WORKSPACE
      {
        id: 'ws-toggle-fullscreen',
        title: isFullscreen ? 'Exit Workspace Fullscreen' : 'Enter Workspace Fullscreen',
        description: 'Maximize or restore the tool container area',
        category: 'Workspace',
        shortcut: 'F11',
        action: () => toggleFullscreen(),
      },
      {
        id: 'ws-close-tab',
        title: 'Close Active Tab',
        description: 'Close currently open tool tab',
        category: 'Workspace',
        shortcut: 'Ctrl+W',
        action: () => {
          if (activeTabId) closeTab(activeTabId);
        },
      },
      {
        id: 'ws-close-all',
        title: 'Close All Unpinned Tabs',
        description: 'Clear all unpinned tool tabs from the workspace',
        category: 'Workspace',
        action: () => closeAllTabs(),
      },

      // THEME
      {
        id: 'theme-dark',
        title: 'Switch to Dark Theme',
        description: 'Enable sleek dark aesthetics',
        category: 'Theme',
        action: () => setTheme('dark'),
      },
      {
        id: 'theme-light',
        title: 'Switch to Light Theme',
        description: 'Enable clean high-contrast light aesthetics',
        category: 'Theme',
        action: () => setTheme('light'),
      },
      {
        id: 'theme-system',
        title: 'Use System Theme',
        description: 'Sync appearance with OS settings',
        category: 'Theme',
        action: () => setTheme('system'),
      },

      // ACTIONS
      {
        id: 'action-clear-history',
        title: 'Clear Activity History',
        description: 'Remove all recorded logs from utility center',
        category: 'Actions',
        action: () => clearHistory(),
      },
    ],
    [openTab, isFullscreen, toggleFullscreen, activeTabId, closeTab, closeAllTabs, setTheme, clearHistory]
  );

  // Filter items by search query
  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      // If query is empty, show recent commands first, then all items
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

  // Keep selectedIndex valid when filtered list changes
  useEffect(() => {
    if (selectedIndex >= filteredItems.length) {
      const timer = setTimeout(() => setSelectedIndex(0), 0);
      return () => clearTimeout(timer);
    }
  }, [filteredItems, selectedIndex]);

  // Keyboard navigation inside modal
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
        return <Braces className="h-4 w-4 text-primary" />;
      case 'tool-regex-tester':
        return <Regex className="h-4 w-4 text-primary" />;
      case 'tool-jwt-decoder':
        return <Key className="h-4 w-4 text-primary" />;
      case 'tool-sql-formatter':
        return <Database className="h-4 w-4 text-primary" />;
      case 'tool-base64-encoder':
        return <FileCode className="h-4 w-4 text-primary" />;
      case 'tool-curl-builder':
        return <Globe className="h-4 w-4 text-primary" />;
      case 'ws-toggle-fullscreen':
        return isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />;
      case 'ws-close-tab':
      case 'ws-close-all':
        return <X className="h-4 w-4" />;
      case 'theme-dark':
        return <Moon className="h-4 w-4" />;
      case 'theme-light':
        return <Sun className="h-4 w-4" />;
      case 'theme-system':
        return <Laptop className="h-4 w-4" />;
      case 'action-clear-history':
        return <Trash2 className="h-4 w-4 text-destructive" />;
      default:
        return <Terminal className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closeCommandPalette}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            {/* Search Input Bar */}
            <div className="flex items-center border-b border-border px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search tools (e.g. JSON, Regex, Dark Theme)..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <kbd className="hidden sm:flex items-center gap-1 rounded border border-border bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                ESC
              </kbd>
            </div>

            {/* Command List Area */}
            <div className="max-h-[380px] overflow-y-auto p-2">
              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <Terminal className="h-8 w-8 opacity-40 mb-2" />
                  <p className="text-xs font-medium">No results found for &quot;{query}&quot;</p>
                  <p className="text-[11px] opacity-75 mt-1">Try searching by tool name, category, or action</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {!query && recentCommandIds.length > 0 && (
                    <div className="px-2.5 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <History className="h-3 w-3 text-primary" />
                      <span>Recent Commands</span>
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
                          'flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors cursor-pointer',
                          isSelected
                            ? 'bg-primary/10 text-foreground'
                            : 'hover:bg-muted/50 text-muted-foreground'
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-background/60">
                            {getIcon(item)}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-foreground truncate">
                              {item.title}
                            </span>
                            <span className="text-[11px] text-muted-foreground truncate">
                              {item.description}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {item.category}
                          </span>
                          {item.shortcut && (
                            <kbd className="hidden sm:inline-block rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                              {item.shortcut}
                            </kbd>
                          )}
                          {isSelected && (
                            <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-2 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono">↑</kbd>
                  <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono">↓</kbd>
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono">↵</kbd>
                  to select
                </span>
              </div>
              <div className="flex items-center gap-1 text-primary font-medium">
                <Sparkles className="h-3 w-3" />
                <span>Global Command Palette</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
