'use client';

import { useState, useMemo } from 'react';
import { Search, Copy, Check, Terminal } from 'lucide-react';
import {
  searchGitCheatSheet,
  customizeCommandString,
  generateCheatSheetMarkdown,
  GIT_CHEAT_CATEGORIES,
  GIT_CHEAT_ENTRIES,
  type GitCheatCategory,
} from '@/lib/git-cheat-sheet-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function GitCheatSheetPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    GitCheatCategory | 'all'
  >('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [params, setParams] = useState<Record<string, string>>({
    branch_name: 'feature/auth-jwt',
    remote: 'origin',
    number_of_commits: '3',
    stash_message: 'wip: saving layout adjustments',
    limit: '10',
    bad_commit: 'HEAD',
    good_commit: 'v1.9.0',
    start_line: '1',
    end_line: '50',
    file_path: 'src/app/page.tsx',
  });

  const filteredEntries = useMemo(() => {
    return searchGitCheatSheet(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  const fullMarkdownOutput = useMemo(() => {
    return generateCheatSheetMarkdown(GIT_CHEAT_ENTRIES);
  }, []);

  const handleRun = () => {
    addHistoryItem(
      'Interactive Git Cheat Sheet',
      `Browsed ${filteredEntries.length} Git commands`
    );
  };

  const handleClear = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setParams({
      branch_name: 'feature/new-branch',
      remote: 'origin',
      number_of_commits: '3',
      stash_message: 'wip',
      limit: '10',
      bad_commit: 'HEAD',
      good_commit: 'v1.0.0',
      start_line: '1',
      end_line: '25',
      file_path: 'README.md',
    });
  };

  const handleCopySingle = (id: string, cmd: string) => {
    copyOutput(cmd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <ToolPage
      title="Interactive Git Cheat Sheet"
      description="Searchable reference guide for Git workflows with live parameter substitution, safety risk indicators, and one-click terminal commands"
      category="Git"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <div className="flex items-center gap-2 flex-1 min-w-[220px]">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search commands (e.g., reset, rebase, stash)..."
                className="w-full rounded border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                All ({GIT_CHEAT_ENTRIES.length})
              </button>
              {GIT_CHEAT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <ToolToolbar
            onRun={handleRun}
            runLabel="Export Guide"
            onLoadSample={() => setSearchQuery('')}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(fullMarkdownOutput)}
            canCopy={Boolean(fullMarkdownOutput)}
            onDownloadOutput={() =>
              downloadFile(fullMarkdownOutput, 'GIT-CHEAT-SHEET.md')
            }
            canDownload={Boolean(fullMarkdownOutput)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status="success"
          message={`Showing ${filteredEntries.length} Git Commands`}
          detail={`Category: ${selectedCategory.toUpperCase()}`}
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* Custom variable placeholders */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-2">
            <div className="flex items-center gap-2 border-b border-border pb-2 text-xs font-bold text-foreground">
              <Terminal className="h-4 w-4 text-primary" />
              <span>Interactive Parameter Substitution</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  &lt;branch_name&gt;
                </label>
                <input
                  type="text"
                  value={params.branch_name ?? ''}
                  onChange={(e) =>
                    setParams({ ...params, branch_name: e.target.value })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  &lt;remote&gt;
                </label>
                <input
                  type="text"
                  value={params.remote ?? ''}
                  onChange={(e) =>
                    setParams({ ...params, remote: e.target.value })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  &lt;number_of_commits&gt;
                </label>
                <input
                  type="text"
                  value={params.number_of_commits ?? ''}
                  onChange={(e) =>
                    setParams({ ...params, number_of_commits: e.target.value })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  &lt;stash_message&gt;
                </label>
                <input
                  type="text"
                  value={params.stash_message ?? ''}
                  onChange={(e) =>
                    setParams({ ...params, stash_message: e.target.value })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Command Cards */}
          <div className="grid grid-cols-1 gap-2.5">
            {filteredEntries.map((entry) => {
              const customized = customizeCommandString(
                entry.commandTemplate,
                params
              );
              return (
                <div
                  key={entry.id}
                  className="rounded-xl border border-border bg-background p-3.5 space-y-2 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      {entry.title}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                        entry.dangerLevel === 'safe'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : entry.dangerLevel === 'caution'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {entry.dangerLevel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2">
                    <code className="font-mono text-xs text-foreground overflow-x-auto">
                      {customized}
                    </code>
                    <button
                      onClick={() => handleCopySingle(entry.id, customized)}
                      className="rounded p-1.5 text-muted-foreground hover:bg-background hover:text-foreground shrink-0"
                    >
                      {copiedId === entry.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    {entry.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title="Complete Markdown Cheat Sheet Guide"
          value={fullMarkdownOutput}
          language="markdown"
        />
      }
    />
  );
}
