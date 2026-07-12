'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface WorkspaceTab {
  id: string;
  title: string;
  icon?: string;
  category: string;
  isPinned: boolean;
  isDirty: boolean;
  href: string;
  toolId?: string;
}

export interface WorkspaceHistoryItem {
  id: string;
  timestamp: string;
  toolName: string;
  action: string;
  detail?: string;
}

export interface WorkspaceSnippet {
  id: string;
  title: string;
  language: string;
  code: string;
  createdAt: string;
}

export type UtilityTabType = 'history' | 'snippets' | 'cheatsheet' | 'notes';

interface WorkspaceContextType {
  tabs: WorkspaceTab[];
  activeTabId: string | null;
  openTab: (tab: Omit<WorkspaceTab, 'isPinned' | 'isDirty'> & { isPinned?: boolean; isDirty?: boolean }) => void;
  closeTab: (id: string) => void;
  closeOtherTabs: (id: string) => void;
  closeAllTabs: () => void;
  togglePinTab: (id: string) => void;
  setTabDirty: (id: string, isDirty: boolean) => void;
  reorderTabs: (fromIndex: number, toIndex: number) => void;
  activeTab: WorkspaceTab | null;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  activeUtilityTab: UtilityTabType;
  setActiveUtilityTab: (tab: UtilityTabType) => void;
  notes: string;
  setNotes: (notes: string) => void;
  historyItems: WorkspaceHistoryItem[];
  addHistoryItem: (toolName: string, action: string, detail?: string) => void;
  clearHistory: () => void;
  snippets: WorkspaceSnippet[];
  addSnippet: (title: string, language: string, code: string) => void;
  deleteSnippet: (id: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

const DEFAULT_TABS: WorkspaceTab[] = [
  {
    id: 'json-formatter',
    title: 'JSON Formatter',
    icon: 'Braces',
    category: 'Formatters',
    isPinned: true,
    isDirty: false,
    href: '/dashboard/tools/json-formatter',
    toolId: 'json-formatter',
  },
  {
    id: 'regex-tester',
    title: 'Regex Tester',
    icon: 'Regex',
    category: 'Text',
    isPinned: false,
    isDirty: false,
    href: '/dashboard/tools/regex-tester',
    toolId: 'regex-tester',
  },
];

const DEFAULT_SNIPPETS: WorkspaceSnippet[] = [
  {
    id: '1',
    title: 'Sample JSON Payload',
    language: 'json',
    code: '{\n  "status": "success",\n  "code": 200,\n  "data": {\n    "name": "DevForge"\n  }\n}',
    createdAt: 'Just now',
  },
  {
    id: '2',
    title: 'Email Regex Pattern',
    language: 'regex',
    code: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    createdAt: '1 hour ago',
  },
];

const DEFAULT_HISTORY: WorkspaceHistoryItem[] = [
  {
    id: 'h1',
    timestamp: '2 mins ago',
    toolName: 'JSON Formatter',
    action: 'Formatted & Validated Payload',
    detail: '42 lines formatted successfully',
  },
  {
    id: 'h2',
    timestamp: '15 mins ago',
    toolName: 'JWT Decoder',
    action: 'Decoded RS256 Token',
    detail: 'Payload expired verification',
  },
];

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [tabs, setTabs] = useState<WorkspaceTab[]>(DEFAULT_TABS);
  const [activeTabId, setActiveTabId] = useState<string | null>('json-formatter');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeUtilityTab, setActiveUtilityTab] = useState<UtilityTabType>('history');
  const [notes, setNotesState] = useState<string>(
    '# DevForge Scratchpad\n\nUse this persistent notepad to jot down quick JSON payloads, regex expressions, API tokens, or notes while using tools.\n\n- [x] Configure workspace engine\n- [ ] Test JSON formatter tool\n'
  );
  const [historyItems, setHistoryItems] = useState<WorkspaceHistoryItem[]>(DEFAULT_HISTORY);
  const [snippets, setSnippets] = useState<WorkspaceSnippet[]>(DEFAULT_SNIPPETS);

  // Sync active tab with current pathname
  useEffect(() => {
    if (pathname === '/dashboard') {
      const timer = setTimeout(() => setActiveTabId(null), 0);
      return () => clearTimeout(timer);
    } else if (pathname) {
      const matchingTab = tabs.find((t) => t.href === pathname);
      if (matchingTab && matchingTab.id !== activeTabId) {
        const timer = setTimeout(() => setActiveTabId(matchingTab.id), 0);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname, tabs, activeTabId]);

  // Load saved notes from localStorage on mount
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        const savedNotes = localStorage.getItem('devforge_workspace_notes');
        if (savedNotes !== null) {
          setNotesState(savedNotes);
        }
      } catch {
        // Ignore localStorage errors
      }
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const setNotes = useCallback((newNotes: string) => {
    setNotesState(newNotes);
    try {
      localStorage.setItem('devforge_workspace_notes', newNotes);
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const openTab = useCallback(
    (tabData: Omit<WorkspaceTab, 'isPinned' | 'isDirty'> & { isPinned?: boolean; isDirty?: boolean }) => {
      setTabs((prev) => {
        const exists = prev.find((t) => t.id === tabData.id);
        if (exists) {
          return prev;
        }
        const newTab: WorkspaceTab = {
          ...tabData,
          isPinned: tabData.isPinned ?? false,
          isDirty: tabData.isDirty ?? false,
        };
        return [...prev, newTab];
      });
      setActiveTabId(tabData.id);
      if (tabData.href && pathname !== tabData.href) {
        router.push(tabData.href);
      }
    },
    [pathname, router]
  );

  const closeTab = useCallback(
    (id: string) => {
      setTabs((prev) => {
        const next = prev.filter((t) => t.id !== id);
        if (activeTabId === id) {
          const closedIndex = prev.findIndex((t) => t.id === id);
          const nextActive =
            next[closedIndex] ?? next[closedIndex - 1] ?? next[0] ?? null;
          setActiveTabId(nextActive ? nextActive.id : null);
        }
        return next;
      });
    },
    [activeTabId]
  );

  const closeOtherTabs = useCallback(
    (id: string) => {
      setTabs((prev) => prev.filter((t) => t.id === id || t.isPinned));
      setActiveTabId(id);
    },
    []
  );

  const closeAllTabs = useCallback(() => {
    setTabs((prev) => prev.filter((t) => t.isPinned));
    setTabs((prev) => {
      if (prev.length > 0 && prev[0]) {
        setActiveTabId(prev[0].id);
      } else {
        setActiveTabId(null);
      }
      return prev;
    });
  }, []);

  const togglePinTab = useCallback((id: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isPinned: !t.isPinned } : t))
    );
  }, []);

  const setTabDirty = useCallback((id: string, isDirty: boolean) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isDirty } : t))
    );
  }, []);

  const reorderTabs = useCallback((fromIndex: number, toIndex: number) => {
    setTabs((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      if (moved) {
        copy.splice(toIndex, 0, moved);
      }
      return copy;
    });
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const addHistoryItem = useCallback((toolName: string, action: string, detail?: string) => {
    const newItem: WorkspaceHistoryItem = {
      id: `h_${Date.now()}`,
      timestamp: 'Just now',
      toolName,
      action,
      detail,
    };
    setHistoryItems((prev) => [newItem, ...prev.slice(0, 19)]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistoryItems([]);
  }, []);

  const addSnippet = useCallback((title: string, language: string, code: string) => {
    const newSnippet: WorkspaceSnippet = {
      id: `s_${Date.now()}`,
      title,
      language,
      code,
      createdAt: 'Just now',
    };
    setSnippets((prev) => [newSnippet, ...prev]);
  }, []);

  const deleteSnippet = useCallback((id: string) => {
    setSnippets((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? null;

  return (
    <WorkspaceContext.Provider
      value={{
        tabs,
        activeTabId,
        openTab,
        closeTab,
        closeOtherTabs,
        closeAllTabs,
        togglePinTab,
        setTabDirty,
        reorderTabs,
        activeTab,
        isFullscreen,
        toggleFullscreen,
        activeUtilityTab,
        setActiveUtilityTab,
        notes,
        setNotes,
        historyItems,
        addHistoryItem,
        clearHistory,
        snippets,
        addSnippet,
        deleteSnippet,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
