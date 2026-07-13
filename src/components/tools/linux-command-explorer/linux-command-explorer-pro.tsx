'use client';

import { useState, useMemo } from 'react';
import {
  Terminal,
  Search,
  Tag,
  Copy,
  Check,
  Info,
} from 'lucide-react';
import {
  filterLinuxCommands,
  LINUX_COMMAND_DATABASE,
  type LinuxCommandEntry,
} from '@/lib/linux-command-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

const CATEGORIES = [
  { id: 'all', name: 'All Linux Commands' },
  { id: 'system_processes', name: 'Process & System Monitoring' },
  { id: 'network_ports', name: 'Network & Troubleshooting' },
  { id: 'file_permissions', name: 'File Permissions & Ownership' },
  { id: 'disk_memory', name: 'Disk & Memory' },
  { id: 'archive_compression', name: 'Archive & Compression' },
];

export function LinuxCommandExplorerPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCommand, setSelectedCommand] = useState<LinuxCommandEntry>(
    LINUX_COMMAND_DATABASE[0]
  );
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const filtered = useMemo(
    () => filterLinuxCommands(query, selectedCategory),
    [query, selectedCategory]
  );

  const markdownSheet = useMemo(() => {
    return [
      '# DevForge Linux & Server DevOps Command Reference Sheet',
      '',
      ...filtered.map((cmd) => {
        return [
          `## ${cmd.name}`,
          `**Category:** ${cmd.categoryLabel}`,
          `**Syntax:** \`${cmd.syntax}\``,
          '',
          cmd.description,
          '',
          '### Flags & Options',
          ...cmd.flags.map((f) => `- \`${f.flag}\`: ${f.description}`),
          '',
          '### Example Usage',
          '```bash',
          cmd.example,
          '```',
        ].join('\n');
      }),
    ].join('\n\n---\n\n');
  }, [filtered]);

  const handleRun = () => {
    addHistoryItem(
      'Linux Command Explorer',
      `Explored command: ${selectedCommand.name}`
    );
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(code);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <ToolPage
      title="Linux Command Explorer"
      description="Interactive Linux server administration and DevOps CLI database with flag reference breakdowns, syntax templates, and real-world production examples"
      category="Linux"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-md px-2.5 py-1 text-xs font-bold transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <ToolToolbar
            onRun={handleRun}
            runLabel="Save Cheat Sheet"
            onLoadSample={() => {
              setQuery('');
              setSelectedCategory('all');
              setSelectedCommand(LINUX_COMMAND_DATABASE[0]);
            }}
            onClear={() => setQuery('')}
            onCopyOutput={() => copyOutput(markdownSheet)}
            canCopy={Boolean(markdownSheet)}
            onDownloadOutput={() =>
              downloadFile(markdownSheet, 'linux-devops-commands.md')
            }
            canDownload={Boolean(markdownSheet)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status="success"
          message={`Selected: ${selectedCommand.name}`}
          detail={`${filtered.length} matching commands found`}
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Linux commands (ps, lsof, chmod, tar, port...)"
              className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-4 text-xs font-semibold text-foreground focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
            {/* Command List Selector Column */}
            <div className="space-y-2 lg:col-span-1 border-r border-border pr-2 max-h-[520px] overflow-y-auto">
              {filtered.map((cmd) => (
                <button
                  key={cmd.id}
                  type="button"
                  onClick={() => setSelectedCommand(cmd)}
                  className={`w-full rounded-xl border p-3 text-left transition-all ${
                    selectedCommand.id === cmd.id
                      ? 'border-primary bg-primary/10 shadow-sm'
                      : 'border-border bg-background hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      {cmd.name}
                    </span>
                  </div>
                  <div className="mt-1 text-[10px] font-semibold text-primary">
                    {cmd.categoryLabel}
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-muted-foreground truncate">
                    {cmd.syntax}
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  No Linux commands match your search query.
                </div>
              )}
            </div>

            {/* Selected Command Deep Dive Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-xl border border-border bg-background p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="text-sm font-bold text-foreground">
                        {selectedCommand.name}
                      </h3>
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        {selectedCommand.categoryLabel}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-foreground/90 leading-relaxed">
                  {selectedCommand.description}
                </p>

                {/* Syntax Box */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">
                    Syntax Template
                  </span>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-card p-2.5 font-mono text-xs font-bold text-primary">
                    <span>{selectedCommand.syntax}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(selectedCommand.syntax)}
                      className="rounded p-1 hover:bg-background"
                      title="Copy Syntax"
                    >
                      {copiedSnippet === selectedCommand.syntax ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Flags Breakdown Table */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <Info className="h-4 w-4 text-primary" />
                    <span>Flag & Option Breakdown</span>
                  </div>

                  <div className="divide-y divide-border rounded-lg border border-border bg-card">
                    {selectedCommand.flags.map((flag) => (
                      <div
                        key={flag.flag}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 text-xs"
                      >
                        <code className="font-mono font-bold text-primary sm:w-1/3">
                          {flag.flag}
                        </code>
                        <span className="text-foreground/90 sm:w-2/3 mt-1 sm:mt-0">
                          {flag.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Example Command Box */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">
                    Production Example
                  </span>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-card p-2.5 font-mono text-xs text-foreground">
                    <span>{selectedCommand.example}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(selectedCommand.example)}
                      className="rounded p-1 hover:bg-background"
                      title="Copy Example"
                    >
                      {copiedSnippet === selectedCommand.example ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  {selectedCommand.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
                    >
                      <Tag className="h-3 w-3" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title="Linux & DevOps Command Cheat Sheet (Markdown)"
          value={markdownSheet}
          language="markdown"
        />
      }
    />
  );
}
