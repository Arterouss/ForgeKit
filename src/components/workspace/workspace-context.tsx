'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  type WorkspaceProfile,
  type ToolCollection,
  type WorkspaceSnapshot,
  DEFAULT_WORKSPACES,
  DEFAULT_COLLECTIONS,
  createSnapshotMetadata,
  buildWorkspaceExportPayload,
  validateWorkspaceExport,
} from '@/lib/workspace-storage-utils';

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

export interface DashboardWidgetConfig {
  showFavorites: boolean;
  showRecent: boolean;
  showCategories: boolean;
  showAllTools: boolean;
}

interface WorkspaceContextType {
  // Tabs & Navigation
  tabs: WorkspaceTab[];
  activeTabId: string | null;
  openTab: (
    tab: Omit<WorkspaceTab, 'isPinned' | 'isDirty'> & {
      isPinned?: boolean;
      isDirty?: boolean;
    }
  ) => void;
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

  // Workspaces Manager
  workspaces: WorkspaceProfile[];
  activeWorkspaceId: string;
  createWorkspace: (name: string, description: string, icon: string) => void;
  switchWorkspace: (workspaceId: string) => void;
  deleteWorkspace: (workspaceId: string) => void;

  // Collections Manager
  collections: ToolCollection[];
  createCollection: (name: string, description: string, icon: string) => void;
  deleteCollection: (id: string) => void;
  addToolToCollection: (collectionId: string, toolSlug: string) => void;
  removeToolFromCollection: (collectionId: string, toolSlug: string) => void;

  // Favorites Manager
  favorites: string[];
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;

  // Notes & Snippets
  notes: string;
  setNotes: (notes: string) => void;
  historyItems: WorkspaceHistoryItem[];
  addHistoryItem: (toolName: string, action: string, detail?: string) => void;
  removeHistoryItem: (id: string) => void;
  clearHistory: () => void;
  snippets: WorkspaceSnippet[];
  addSnippet: (title: string, language: string, code: string) => void;
  deleteSnippet: (id: string) => void;

  // Snapshots & Import/Export
  snapshots: WorkspaceSnapshot[];
  createSnapshot: (label: string) => void;
  restoreSnapshot: (snapshotId: string) => boolean;
  deleteSnapshot: (snapshotId: string) => void;
  exportWorkspaceJson: () => string;
  importWorkspaceJson: (jsonString: string) => {
    success: boolean;
    error?: string;
  };

  // Dashboard Widgets Configuration
  dashboardWidgets: DashboardWidgetConfig;
  setDashboardWidget: (
    key: keyof DashboardWidgetConfig,
    enabled: boolean
  ) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

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
    id: 's_json_1',
    title: 'Sample API Success Payload',
    language: 'json',
    code: '{\n  "status": "success",\n  "code": 200,\n  "data": {\n    "service": "DevForge AntiGravity",\n    "phase": 7\n  }\n}',
    createdAt: 'Just now',
  },
  {
    id: 's_regex_1',
    title: 'Email Address Strict Regex',
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
    toolName: 'JWT Security Auditor',
    action: 'Audited RS256 Token',
    detail: 'No alg=none vulnerabilities found',
  },
];

const DEFAULT_FAVORITES = [
  'json-formatter',
  'jwt-inspector',
  'docker-compose-builder',
  'rest-request-builder',
];

const DEFAULT_WIDGETS: DashboardWidgetConfig = {
  showFavorites: true,
  showRecent: true,
  showCategories: true,
  showAllTools: true,
};

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [tabs, setTabs] = useState<WorkspaceTab[]>(DEFAULT_TABS);
  const [activeTabId, setActiveTabId] = useState<string | null>(
    'json-formatter'
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeUtilityTab, setActiveUtilityTab] =
    useState<UtilityTabType>('history');

  const [workspaces, setWorkspaces] =
    useState<WorkspaceProfile[]>(DEFAULT_WORKSPACES);
  const [activeWorkspaceId, setActiveWorkspaceId] =
    useState<string>('ws-default');

  const [collections, setCollections] =
    useState<ToolCollection[]>(DEFAULT_COLLECTIONS);
  const [favorites, setFavorites] = useState<string[]>(DEFAULT_FAVORITES);

  const [notes, setNotesState] = useState<string>(
    '# DevForge Developer Studio — Workspace Notes\n\nUse this persistent markdown scratchpad across all tools to store payloads, credentials patterns, or notes.\n\n- [x] Complete Phase 1–6 (60 Tools Verified)\n- [x] Initialize Workspace Engine & Snapshot Storage\n- [ ] Export Workspace JSON Backup\n'
  );

  const [historyItems, setHistoryItems] =
    useState<WorkspaceHistoryItem[]>(DEFAULT_HISTORY);
  const [snippets, setSnippets] =
    useState<WorkspaceSnippet[]>(DEFAULT_SNIPPETS);
  const [snapshots, setSnapshots] = useState<WorkspaceSnapshot[]>([]);
  const [dashboardWidgets, setDashboardWidgetsState] =
    useState<DashboardWidgetConfig>(DEFAULT_WIDGETS);

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

  // Load state from localStorage on mount
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        const savedNotes = localStorage.getItem('devforge_notes');
        if (savedNotes !== null) setNotesState(savedNotes);

        const savedFavorites = localStorage.getItem('devforge_favorites');
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));

        const savedCollections = localStorage.getItem('devforge_collections');
        if (savedCollections) setCollections(JSON.parse(savedCollections));

        const savedSnippets = localStorage.getItem('devforge_snippets');
        if (savedSnippets) setSnippets(JSON.parse(savedSnippets));

        const savedSnapshots = localStorage.getItem('devforge_snapshots');
        if (savedSnapshots) setSnapshots(JSON.parse(savedSnapshots));

        const savedWorkspaces = localStorage.getItem('devforge_workspaces');
        if (savedWorkspaces) setWorkspaces(JSON.parse(savedWorkspaces));

        const savedActiveWs = localStorage.getItem('devforge_active_ws');
        if (savedActiveWs) setActiveWorkspaceId(savedActiveWs);

        const savedWidgets = localStorage.getItem('devforge_widgets');
        if (savedWidgets) setDashboardWidgetsState(JSON.parse(savedWidgets));
      } catch {
        // Fallback silently if localStorage fails
      }
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const setNotes = useCallback((newNotes: string) => {
    setNotesState(newNotes);
    try {
      localStorage.setItem('devforge_notes', newNotes);
    } catch {
      // Ignore storage limit
    }
  }, []);

  const setDashboardWidget = useCallback(
    (key: keyof DashboardWidgetConfig, enabled: boolean) => {
      setDashboardWidgetsState((prev) => {
        const next = { ...prev, [key]: enabled };
        try {
          localStorage.setItem('devforge_widgets', JSON.stringify(next));
        } catch {
          // Ignore
        }
        return next;
      });
    },
    []
  );

  const createWorkspace = useCallback(
    (name: string, description: string, icon: string) => {
      const newWs: WorkspaceProfile = {
        id: `ws_${Date.now()}`,
        name: name.trim() || 'New Workspace',
        description: description.trim() || 'Custom engineering workspace',
        icon: icon || 'Briefcase',
        createdAt: new Date().toISOString(),
      };
      setWorkspaces((prev) => {
        const next = [...prev, newWs];
        try {
          localStorage.setItem('devforge_workspaces', JSON.stringify(next));
        } catch {
          // Ignore
        }
        return next;
      });
      setActiveWorkspaceId(newWs.id);
      try {
        localStorage.setItem('devforge_active_ws', newWs.id);
      } catch {
        // Ignore
      }
    },
    []
  );

  const switchWorkspace = useCallback((workspaceId: string) => {
    setActiveWorkspaceId(workspaceId);
    try {
      localStorage.setItem('devforge_active_ws', workspaceId);
    } catch {
      // Ignore
    }
  }, []);

  const deleteWorkspace = useCallback(
    (workspaceId: string) => {
      setWorkspaces((prev) => {
        const filtered = prev.filter((w) => w.id !== workspaceId || w.isDefault);
        try {
          localStorage.setItem('devforge_workspaces', JSON.stringify(filtered));
        } catch {
          // Ignore
        }
        return filtered;
      });
      if (activeWorkspaceId === workspaceId) {
        setActiveWorkspaceId('ws-default');
      }
    },
    [activeWorkspaceId]
  );

  const createCollection = useCallback(
    (name: string, description: string, icon: string) => {
      const newCol: ToolCollection = {
        id: `col_${Date.now()}`,
        name: name.trim() || 'Custom Collection',
        description: description.trim(),
        icon: icon || 'Folder',
        toolSlugs: [],
        createdAt: new Date().toISOString(),
      };
      setCollections((prev) => {
        const next = [newCol, ...prev];
        try {
          localStorage.setItem('devforge_collections', JSON.stringify(next));
        } catch {
          // Ignore
        }
        return next;
      });
    },
    []
  );

  const deleteCollection = useCallback((id: string) => {
    setCollections((prev) => {
      const next = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem('devforge_collections', JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  const addToolToCollection = useCallback(
    (collectionId: string, toolSlug: string) => {
      setCollections((prev) => {
        const next = prev.map((col) =>
          col.id === collectionId && !col.toolSlugs.includes(toolSlug)
            ? { ...col, toolSlugs: [...col.toolSlugs, toolSlug] }
            : col
        );
        try {
          localStorage.setItem('devforge_collections', JSON.stringify(next));
        } catch {
          // Ignore
        }
        return next;
      });
    },
    []
  );

  const removeToolFromCollection = useCallback(
    (collectionId: string, toolSlug: string) => {
      setCollections((prev) => {
        const next = prev.map((col) =>
          col.id === collectionId
            ? {
                ...col,
                toolSlugs: col.toolSlugs.filter((s) => s !== toolSlug),
              }
            : col
        );
        try {
          localStorage.setItem('devforge_collections', JSON.stringify(next));
        } catch {
          // Ignore
        }
        return next;
      });
    },
    []
  );

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      try {
        localStorage.setItem('devforge_favorites', JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (slug: string) => favorites.includes(slug),
    [favorites]
  );

  const openTab = useCallback(
    (
      tab: Omit<WorkspaceTab, 'isPinned' | 'isDirty'> & {
        isPinned?: boolean;
        isDirty?: boolean;
      }
    ) => {
      setTabs((prev) => {
        const existingIndex = prev.findIndex((t) => t.id === tab.id);
        if (existingIndex >= 0) {
          return prev;
        }
        return [
          ...prev,
          {
            ...tab,
            isPinned: tab.isPinned ?? false,
            isDirty: tab.isDirty ?? false,
          },
        ];
      });
      setActiveTabId(tab.id);
      router.push(tab.href);
    },
    [router]
  );

  const closeTab = useCallback(
    (id: string) => {
      setTabs((prev) => {
        const tabToClose = prev.find((t) => t.id === id);
        if (tabToClose?.isPinned) return prev;

        const nextTabs = prev.filter((t) => t.id !== id);
        if (activeTabId === id) {
          const closedIdx = prev.findIndex((t) => t.id === id);
          const nextActive =
            nextTabs[closedIdx - 1] || nextTabs[0] || null;
          setActiveTabId(nextActive?.id ?? null);
          if (nextActive) {
            router.push(nextActive.href);
          } else {
            router.push('/dashboard');
          }
        }
        return nextTabs;
      });
    },
    [activeTabId, router]
  );

  const closeOtherTabs = useCallback(
    (id: string) => {
      setTabs((prev) => prev.filter((t) => t.id === id || t.isPinned));
      const kept = tabs.find((t) => t.id === id);
      if (kept) {
        setActiveTabId(kept.id);
        router.push(kept.href);
      }
    },
    [tabs, router]
  );

  const closeAllTabs = useCallback(() => {
    setTabs((prev) => prev.filter((t) => t.isPinned));
    setActiveTabId(null);
    router.push('/dashboard');
  }, [router]);

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
      const result = Array.from(prev);
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return result;
    });
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const addHistoryItem = useCallback(
    (toolName: string, action: string, detail?: string) => {
      const newItem: WorkspaceHistoryItem = {
        id: `h_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        toolName,
        action,
        detail,
      };
      setHistoryItems((prev) => [newItem, ...prev.slice(0, 49)]);
    },
    []
  );

  const removeHistoryItem = useCallback((id: string) => {
    setHistoryItems((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistoryItems([]);
  }, []);

  const addSnippet = useCallback(
    (title: string, language: string, code: string) => {
      const newSnippet: WorkspaceSnippet = {
        id: `s_${Date.now()}`,
        title,
        language,
        code,
        createdAt: 'Just now',
      };
      setSnippets((prev) => {
        const next = [newSnippet, ...prev];
        try {
          localStorage.setItem('devforge_snippets', JSON.stringify(next));
        } catch {
          // Ignore
        }
        return next;
      });
    },
    []
  );

  const deleteSnippet = useCallback((id: string) => {
    setSnippets((prev) => {
      const next = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem('devforge_snippets', JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  const createSnapshot = useCallback(
    (label: string) => {
      const snapData = {
        favorites,
        recentTools: historyItems.map((h) => h.toolName),
        notes,
        collections,
        snippets,
        historyItems,
      };
      const newSnapshot = createSnapshotMetadata(
        label,
        activeWorkspaceId,
        snapData
      );
      setSnapshots((prev) => {
        const next = [newSnapshot, ...prev];
        try {
          localStorage.setItem('devforge_snapshots', JSON.stringify(next));
        } catch {
          // Ignore
        }
        return next;
      });
    },
    [favorites, historyItems, notes, collections, snippets, activeWorkspaceId]
  );

  const restoreSnapshot = useCallback(
    (snapshotId: string): boolean => {
      const target = snapshots.find((s) => s.id === snapshotId);
      if (!target) return false;

      const { data } = target;
      if (data.favorites) setFavorites(data.favorites);
      if (data.notes !== undefined) setNotesState(data.notes);
      if (data.collections) setCollections(data.collections);
      if (data.snippets) setSnippets(data.snippets);
      if (data.historyItems) setHistoryItems(data.historyItems);

      try {
        localStorage.setItem(
          'devforge_favorites',
          JSON.stringify(data.favorites)
        );
        localStorage.setItem('devforge_notes', data.notes);
        localStorage.setItem(
          'devforge_collections',
          JSON.stringify(data.collections)
        );
        localStorage.setItem(
          'devforge_snippets',
          JSON.stringify(data.snippets)
        );
      } catch {
        // Ignore
      }
      return true;
    },
    [snapshots]
  );

  const deleteSnapshot = useCallback((snapshotId: string) => {
    setSnapshots((prev) => {
      const next = prev.filter((s) => s.id !== snapshotId);
      try {
        localStorage.setItem('devforge_snapshots', JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  const exportWorkspaceJson = useCallback((): string => {
    const payload = buildWorkspaceExportPayload(
      workspaces,
      activeWorkspaceId,
      collections,
      {
        favorites,
        recentTools: historyItems.map((h) => h.toolName),
        notes,
        collections,
        snippets,
        historyItems,
      }
    );
    return JSON.stringify(payload, null, 2);
  }, [workspaces, activeWorkspaceId, collections, favorites, historyItems, notes, snippets]);

  const importWorkspaceJson = useCallback(
    (jsonString: string): { success: boolean; error?: string } => {
      try {
        const parsed = JSON.parse(jsonString);
        const validation = validateWorkspaceExport(parsed);
        if (!validation.valid || !validation.data) {
          return {
            success: false,
            error: validation.error ?? 'Invalid workspace export file format.',
          };
        }

        const data = validation.data;
        if (data.workspaces) setWorkspaces(data.workspaces);
        if (data.activeWorkspaceId) setActiveWorkspaceId(data.activeWorkspaceId);
        if (data.collections) setCollections(data.collections);

        const snap = data.snapshot;
        if (snap.favorites) setFavorites(snap.favorites);
        if (snap.notes !== undefined) setNotesState(snap.notes);
        if (snap.snippets) setSnippets(snap.snippets);
        if (snap.historyItems) setHistoryItems(snap.historyItems);

        return { success: true };
      } catch (err: unknown) {
        return {
          success: false,
          error:
            err instanceof Error
              ? err.message
              : 'Failed to parse JSON export payload.',
        };
      }
    },
    []
  );

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
        workspaces,
        activeWorkspaceId,
        createWorkspace,
        switchWorkspace,
        deleteWorkspace,
        collections,
        createCollection,
        deleteCollection,
        addToolToCollection,
        removeToolFromCollection,
        favorites,
        toggleFavorite,
        isFavorite,
        notes,
        setNotes,
        historyItems,
        addHistoryItem,
        removeHistoryItem,
        clearHistory,
        snippets,
        addSnippet,
        deleteSnippet,
        snapshots,
        createSnapshot,
        restoreSnapshot,
        deleteSnapshot,
        exportWorkspaceJson,
        importWorkspaceJson,
        dashboardWidgets,
        setDashboardWidget,
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
