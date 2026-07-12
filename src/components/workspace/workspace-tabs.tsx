'use client';

import { useState } from 'react';
import {
  Pin,
  PinOff,
  X,
  Plus,
  MoreVertical,
  Maximize2,
  Minimize2,
  Sparkles,
} from 'lucide-react';
import { useWorkspace, WorkspaceTab } from './workspace-context';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const QUICK_OPEN_TOOLS = [
  { id: 'json-formatter', title: 'JSON Formatter', icon: 'Braces', category: 'Formatters', href: '/dashboard/tools/json-formatter' },
  { id: 'regex-tester', title: 'Regex Tester', icon: 'Regex', category: 'Text', href: '/dashboard/tools/regex-tester' },
  { id: 'jwt-decoder', title: 'JWT Decoder', icon: 'Key', category: 'Security', href: '/dashboard/tools/jwt-decoder' },
  { id: 'sql-formatter', title: 'SQL Formatter', icon: 'Database', category: 'Formatters', href: '/dashboard/tools/sql-formatter' },
  { id: 'base64-encoder', title: 'Base64 Encoder', icon: 'FileCode', category: 'Encoding', href: '/dashboard/tools/base64-encoder' },
  { id: 'curl-builder', title: 'cURL Builder', icon: 'Globe', category: 'Network', href: '/dashboard/tools/curl-builder' },
];

export function WorkspaceTabs() {
  const {
    tabs,
    activeTabId,
    openTab,
    closeTab,
    closeOtherTabs,
    closeAllTabs,
    togglePinTab,
    isFullscreen,
    toggleFullscreen,
  } = useWorkspace();

  const [draggedTabId, setDraggedTabId] = useState<string | null>(null);

  const pinnedTabs = tabs.filter((t) => t.isPinned);
  const unpinnedTabs = tabs.filter((t) => !t.isPinned);

  const renderTab = (tab: WorkspaceTab) => {
    const isActive = tab.id === activeTabId;

    return (
      <div
        key={tab.id}
        draggable={!tab.isPinned}
        onDragStart={() => setDraggedTabId(tab.id)}
        onDragEnd={() => setDraggedTabId(null)}
        onClick={() => openTab(tab)}
        className={cn(
          'group relative flex h-9 items-center gap-2 border-r border-border/60 px-3 text-xs font-medium transition-all select-none cursor-pointer',
          isActive
            ? 'bg-background text-foreground'
            : 'bg-card/40 text-muted-foreground hover:bg-card/80 hover:text-foreground',
          draggedTabId === tab.id && 'opacity-50'
        )}
      >
        {/* Active tab top glow & line */}
        {isActive && (
          <>
            <span className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/80 to-accent" />
          </>
        )}

        {/* Pin icon or tab indicator */}
        {tab.isPinned ? (
          <Pin className="h-3 w-3 shrink-0 text-primary" />
        ) : tab.isDirty ? (
          <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0 animate-pulse" />
        ) : null}

        {/* Title */}
        <span className="truncate max-w-[130px]">{tab.title}</span>

        {/* Tab Context & Action Buttons */}
        <div className="flex items-center gap-0.5 ml-1">
          {!tab.isPinned && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className={cn(
                'rounded-sm p-0.5 transition-opacity hover:bg-muted hover:text-foreground',
                isActive ? 'opacity-80 hover:opacity-100' : 'opacity-0 group-hover:opacity-100'
              )}
              title="Close tab (Ctrl+W)"
            >
              <X className="h-3 w-3" />
            </button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger
              onClick={(e) => e.stopPropagation()}
              className="opacity-0 group-hover:opacity-100 rounded-sm p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-opacity focus:outline-none"
            >
              <MoreVertical className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44 text-xs">
              <DropdownMenuItem onClick={() => togglePinTab(tab.id)}>
                {tab.isPinned ? (
                  <>
                    <PinOff className="mr-2 h-3.5 w-3.5" /> Unpin Tab
                  </>
                ) : (
                  <>
                    <Pin className="mr-2 h-3.5 w-3.5" /> Pin Tab
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => closeTab(tab.id)}>
                <X className="mr-2 h-3.5 w-3.5" /> Close
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => closeOtherTabs(tab.id)}>
                Close Others
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => closeAllTabs()}>
                Close All Unpinned
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-10 w-full shrink-0 items-center justify-between border-b border-border bg-card/60 backdrop-blur-md overflow-x-auto overflow-y-hidden no-scrollbar">
      {/* Left: Tab list */}
      <div className="flex h-full items-center">
        {/* Pinned tabs */}
        {pinnedTabs.length > 0 && (
          <div className="flex h-full items-center bg-card/80 border-r border-border">
            {pinnedTabs.map(renderTab)}
          </div>
        )}

        {/* Unpinned tabs */}
        <div className="flex h-full items-center">
          {unpinnedTabs.map(renderTab)}
        </div>

        {/* Quick Open new tab launcher */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex h-7 w-7 items-center justify-center ml-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none"
            title="Open a Tool Tab"
          >
            <Plus className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <div className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Quick Launch Tools
            </div>
            <DropdownMenuSeparator />
            {QUICK_OPEN_TOOLS.map((tool) => (
              <DropdownMenuItem
                key={tool.id}
                onClick={() => openTab(tool)}
                className="flex items-center justify-between text-xs cursor-pointer"
              >
                <span>{tool.title}</span>
                <span className="text-[10px] text-muted-foreground">{tool.category}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right: Workspace controls */}
      <div className="flex items-center gap-1 px-3">
        <button
          onClick={toggleFullscreen}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Workspace'}
        >
          {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
