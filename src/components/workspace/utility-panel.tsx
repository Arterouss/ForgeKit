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
  Terminal,
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
    <div className="flex h-full w-full flex-col bg-[#070512] border-l-2 border-cyan-500/30 select-none font-mono text-xs">
      {/* Top Utility Tabs Bar */}
      <div className="flex h-11 shrink-0 items-center border-b border-cyan-500/30 bg-[#0c091f] px-2">
        {(
          [
            { id: 'history', label: 'HISTORY', icon: History },
            { id: 'snippets', label: 'SNIPPETS', icon: Code2 },
            { id: 'cheatsheet', label: 'CHEATS', icon: BookOpen },
            { id: 'notes', label: 'SCRATCH', icon: FileText },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeUtilityTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveUtilityTab(tab.id)}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-extrabold transition-all',
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'text-cyan-400/60 hover:text-white'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#070512]">
        {/* 1. HISTORY TAB */}
        {activeUtilityTab === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <span className="text-xs font-extrabold text-cyan-300 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-fuchsia-400" />
                // RECENT_TELEMETRY
              </span>
              {historyItems.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-bold"
                >
                  CLEAR_BUFFER [X]
                </button>
              )}
            </div>

            {historyItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-cyan-400/60">
                <Terminal className="h-8 w-8 text-fuchsia-400 opacity-60 mb-2" />
                <p className="text-xs text-cyan-200">NO TELEMETRY RECORDED</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {historyItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col rounded-xl border border-cyan-500/20 bg-[#0c091f]/80 p-3 text-xs transition-all hover:border-cyan-400"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white uppercase">{item.toolName}</span>
                      <span className="text-[10px] text-cyan-400/70">{item.timestamp}</span>
                    </div>
                    <p className="text-cyan-200/80 text-[11px]">{item.action}</p>
                    {item.detail && (
                      <span className="mt-1.5 font-mono text-[10px] text-lime-400 bg-lime-400/10 border border-lime-400/30 px-1.5 py-0.5 rounded w-fit">
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
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <span className="text-xs font-extrabold text-cyan-300 flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5 text-fuchsia-400" />
                // SAVED_PAYLOAD_VAULT
              </span>
              <button
                onClick={() => setShowAddSnippet(!showAddSnippet)}
                className="flex items-center gap-1 rounded-lg border border-cyan-400 bg-cyan-500/20 px-2.5 py-1 text-[11px] font-bold text-cyan-300 hover:bg-cyan-500/40 transition-all shadow-sm"
              >
                <Plus className="h-3 w-3" />
                <span>ADD_SNIPPET</span>
              </button>
            </div>

            {showAddSnippet && (
              <form onSubmit={handleCreateSnippet} className="space-y-2.5 rounded-xl border-2 border-cyan-400 bg-[#0c091f] p-3 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <input
                  type="text"
                  placeholder="Snippet Title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-lg border border-cyan-500/40 bg-[#070512] px-2.5 py-1.5 text-xs text-white placeholder:text-cyan-400/50 focus:outline-none focus:border-cyan-300 font-mono"
                  required
                />
                <select
                  value={newLang}
                  onChange={(e) => setNewLang(e.target.value)}
                  className="w-full rounded-lg border border-cyan-500/40 bg-[#070512] px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-300 font-mono"
                >
                  <option value="json">JSON</option>
                  <option value="regex">REGEX</option>
                  <option value="sql">SQL</option>
                  <option value="text">TEXT / RAW</option>
                </select>
                <textarea
                  rows={3}
                  placeholder="Paste payload..."
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full rounded-lg border border-cyan-500/40 bg-[#070512] px-2.5 py-1.5 text-xs text-white placeholder:text-cyan-400/50 focus:outline-none focus:border-cyan-300 font-mono"
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddSnippet(false)}
                    className="rounded-lg px-2.5 py-1 text-xs text-cyan-400/80 hover:text-white"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg border border-lime-400 bg-lime-500/20 px-3 py-1 text-xs font-bold text-lime-400 hover:bg-lime-500/30"
                  >
                    SAVE_PAYLOAD
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {snippets.map((snip) => (
                <div
                  key={snip.id}
                  className="group rounded-xl border border-cyan-500/20 bg-[#0c091f]/80 p-3 space-y-2 hover:border-cyan-400 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white uppercase">{snip.title}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded bg-cyan-500/15 border border-cyan-500/30 px-1.5 py-0.5 font-mono text-[9px] uppercase text-cyan-300">
                        {snip.language}
                      </span>
                      <button
                        onClick={() => handleCopy(snip.id, snip.code)}
                        className="rounded p-1 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                        title="Copy snippet"
                      >
                        {copiedId === snip.id ? (
                          <Check className="h-3.5 w-3.5 text-lime-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteSnippet(snip.id)}
                        className="rounded p-1 text-rose-400 hover:bg-rose-500/20 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete snippet"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <pre className="overflow-x-auto rounded-lg bg-[#070512] p-2.5 font-mono text-[11px] text-lime-300 border border-cyan-500/20">
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
            <span className="font-extrabold text-cyan-300 flex items-center gap-1.5 border-b border-cyan-500/20 pb-2">
              <BookOpen className="h-3.5 w-3.5 text-fuchsia-400" />
              // SYNTAX_CHEAT_SHEET
            </span>

            <div className="space-y-3">
              <div className="rounded-xl border border-cyan-500/20 bg-[#0c091f]/80 p-3 space-y-2">
                <span className="font-extrabold text-white uppercase">REGEX QUANTIFIERS</span>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px] text-cyan-200">
                  <div>* : 0 OR MORE</div>
                  <div>+ : 1 OR MORE</div>
                  <div>? : 0 OR 1</div>
                  <div>{"{n}"} : EXACT N</div>
                  <div>^ : START OF LINE</div>
                  <div>$ : END OF LINE</div>
                </div>
              </div>

              <div className="rounded-xl border border-cyan-500/20 bg-[#0c091f]/80 p-3 space-y-2">
                <span className="font-extrabold text-white uppercase">JSON SPECIFICATIONS</span>
                <ul className="list-disc list-inside text-cyan-200 space-y-1 text-[11px] font-sans">
                  <li>Keys must be double-quoted strings</li>
                  <li>No trailing commas inside arrays or objects</li>
                  <li>Boolean tokens lowercase: true / false</li>
                </ul>
              </div>

              <div className="rounded-xl border border-cyan-500/20 bg-[#0c091f]/80 p-3 space-y-2">
                <span className="font-extrabold text-white uppercase">JWT CRYPTO STRUCTURE</span>
                <p className="text-[11px] text-cyan-200 font-sans">
                  Base64URL encoded header, payload, and signature separated by periods <code className="font-mono text-fuchsia-400 font-bold">.</code>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. NOTES TAB */}
        {activeUtilityTab === 'notes' && (
          <div className="flex flex-col h-full space-y-2">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <span className="text-xs font-extrabold text-cyan-300 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-fuchsia-400" />
                // PERSISTENT_SCRATCHPAD
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">
                {wordCount} W // {charCount} C
              </span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="> Type scratch payloads, regex targets, or temporary notes..."
              className="w-full flex-1 min-h-[360px] rounded-xl border-2 border-cyan-500/30 bg-[#0c091f]/90 p-3 font-mono text-xs text-lime-300 placeholder:text-cyan-400/50 focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
            />
          </div>
        )}
      </div>
    </div>
  );
}
