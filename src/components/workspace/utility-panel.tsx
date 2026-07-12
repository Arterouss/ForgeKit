'use client';

import React, { useState } from 'react';
import {
  History,
  Code2,
  BookOpen,
  FileText,
  Copy,
  Check,
  Trash2,
  Plus,
  Clock,
} from 'lucide-react';
import { useWorkspace } from './workspace-context';
import { cn } from '@/lib/utils';

export function UtilityPanel() {
  const {
    activeUtilityTab,
    setActiveUtilityTab,
    notes,
    setNotes,
    historyItems,
    clearHistory,
    snippets,
    addSnippet,
    deleteSnippet,
  } = useWorkspace();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newLang, setNewLang] = useState('json');
  const [newCode, setNewCode] = useState('');
  const [showAddSnippet, setShowAddSnippet] = useState(false);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCode.trim()) return;
    addSnippet(newTitle.trim(), newLang, newCode);
    setNewTitle('');
    setNewCode('');
    setShowAddSnippet(false);
  };

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;
  const charCount = notes.length;

  return (
    <div className="flex h-full w-full flex-col bg-card/20 select-none">
      {/* Top Utility Tabs Bar */}
      <div className="flex h-11 shrink-0 items-center border-b border-border bg-card/50 px-2">
        {(
          [
            { id: 'history', label: 'History', icon: History },
            { id: 'snippets', label: 'Snippets', icon: Code2 },
            { id: 'cheatsheet', label: 'Cheat Sheet', icon: BookOpen },
            { id: 'notes', label: 'Notes', icon: FileText },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeUtilityTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveUtilityTab(tab.id)}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition-all',
                isActive
                  ? 'bg-background text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 1. HISTORY TAB */}
        {activeUtilityTab === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                Recent Activities
              </span>
              {historyItems.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-[11px] text-muted-foreground hover:text-destructive transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {historyItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <History className="h-8 w-8 opacity-40 mb-2" />
                <p className="text-xs">No activity recorded yet</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {historyItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col rounded-xl border border-border/70 bg-card/50 p-3 text-xs transition-colors hover:border-border"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-foreground">{item.toolName}</span>
                      <span className="text-[10px] text-muted-foreground">{item.timestamp}</span>
                    </div>
                    <p className="text-muted-foreground text-[11px]">{item.action}</p>
                    {item.detail && (
                      <span className="mt-1 font-mono text-[10px] text-primary/90 bg-primary/10 px-1.5 py-0.5 rounded w-fit">
                        {item.detail}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. SNIPPETS TAB */}
        {activeUtilityTab === 'snippets' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5 text-primary" />
                Saved Snippets
              </span>
              <button
                onClick={() => setShowAddSnippet(!showAddSnippet)}
                className="flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-[11px] font-medium text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Plus className="h-3 w-3" />
                <span>Add</span>
              </button>
            </div>

            {showAddSnippet && (
              <form onSubmit={handleCreateSnippet} className="space-y-2.5 rounded-xl border border-border bg-card p-3">
                <input
                  type="text"
                  placeholder="Snippet Title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
                <select
                  value={newLang}
                  onChange={(e) => setNewLang(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="json">JSON</option>
                  <option value="regex">Regex</option>
                  <option value="sql">SQL</option>
                  <option value="text">Text / Other</option>
                </select>
                <textarea
                  rows={3}
                  placeholder="Code snippet..."
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full font-mono rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddSnippet(false)}
                    className="rounded-md px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {snippets.map((snip) => (
                <div
                  key={snip.id}
                  className="group rounded-xl border border-border/70 bg-card/60 p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-foreground">{snip.title}</span>
                    <div className="flex items-center gap-1">
                      <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] uppercase text-muted-foreground">
                        {snip.language}
                      </span>
                      <button
                        onClick={() => handleCopy(snip.id, snip.code)}
                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        title="Copy snippet"
                      >
                        {copiedId === snip.id ? (
                          <Check className="h-3 w-3 text-success" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteSnippet(snip.id)}
                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete snippet"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <pre className="overflow-x-auto rounded-lg bg-muted/40 p-2 font-mono text-[11px] text-muted-foreground">
                    <code>{snip.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. CHEAT SHEET TAB */}
        {activeUtilityTab === 'cheatsheet' && (
          <div className="space-y-4 text-xs">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              Quick Syntax Guide
            </span>

            <div className="space-y-3">
              <div className="rounded-xl border border-border/70 bg-card/50 p-3 space-y-2">
                <span className="font-semibold text-foreground">Regex Quantifiers</span>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px] text-muted-foreground">
                  <div>* : 0 or more</div>
                  <div>+ : 1 or more</div>
                  <div>? : 0 or 1</div>
                  <div>{"{n}"} : exact n</div>
                  <div>^ : start of line</div>
                  <div>$ : end of line</div>
                </div>
              </div>

              <div className="rounded-xl border border-border/70 bg-card/50 p-3 space-y-2">
                <span className="font-semibold text-foreground">JSON Rules</span>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 text-[11px]">
                  <li>Keys must be double-quoted strings</li>
                  <li>No trailing commas allowed</li>
                  <li>Boolean tokens are lowercase: true / false</li>
                </ul>
              </div>

              <div className="rounded-xl border border-border/70 bg-card/50 p-3 space-y-2">
                <span className="font-semibold text-foreground">JWT Structure</span>
                <p className="text-[11px] text-muted-foreground">
                  Base64URL encoded header, payload, and signature separated by periods <code className="font-mono text-primary">.</code>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. NOTES TAB */}
        {activeUtilityTab === 'notes' && (
          <div className="flex flex-col h-full space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-primary" />
                Persistent Scratchpad
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {wordCount} words • {charCount} chars
              </span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Jot down quick payloads, regex patterns, or scratch notes..."
              className="w-full flex-1 min-h-[360px] rounded-xl border border-border/80 bg-background/60 p-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
