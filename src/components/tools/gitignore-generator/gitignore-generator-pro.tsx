'use client';

import { useState, useMemo } from 'react';
import { Search, Sparkles } from 'lucide-react';
import {
  mergeGitignoreRules,
  searchStacks,
  GITIGNORE_STACKS,
  SUGGESTED_COMBOS,
  type GitIgnoreStack,
} from '@/lib/gitignore-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function GitIgnoreGeneratorPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [selectedNames, setSelectedNames] = useState<Set<string>>(
    new Set(['TypeScript', 'Next.js', 'pnpm', 'VSCode', 'macOS'])
  );
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStacks = useMemo(
    () => searchStacks(GITIGNORE_STACKS, searchQuery),
    [searchQuery]
  );

  const selectedStacks: GitIgnoreStack[] = useMemo(
    () => GITIGNORE_STACKS.filter((s) => selectedNames.has(s.name)),
    [selectedNames]
  );

  const gitignoreOutput = useMemo(
    () => mergeGitignoreRules(selectedStacks),
    [selectedStacks]
  );

  const toggleStack = (name: string) => {
    setSelectedNames((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const handleLoadCombo = (comboName: string) => {
    const combo = SUGGESTED_COMBOS.find((c) => c.name === comboName);
    if (combo) {
      setSelectedNames(new Set(combo.stacks));
      addHistoryItem('GitIgnore Generator', `Loaded Combo: ${combo.name}`);
    }
  };

  const handleRun = () => {
    addHistoryItem(
      'GitIgnore Generator',
      `Generated .gitignore (${selectedNames.size} stacks)`
    );
  };

  const handleClear = () => {
    setSelectedNames(new Set());
    setSearchQuery('');
  };

  const categorized = useMemo(() => {
    const groups: Record<string, GitIgnoreStack[]> = {
      language: [],
      framework: [],
      tool: [],
    };
    for (const stack of filteredStacks) {
      groups[stack.category].push(stack);
    }
    return groups;
  }, [filteredStacks]);

  const categoryLabels: Record<string, string> = {
    language: 'Languages',
    framework: 'Frameworks',
    tool: 'Tools & Editors',
  };

  return (
    <ToolPage
      title="GitIgnore Generator Pro"
      description="Generate production-ready .gitignore files for any technology stack with smart deduplication and preset combos"
      category="Git"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          {/* Search Bar */}
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card/60 p-2.5">
            <Search className="h-3.5 w-3.5 text-muted-foreground ml-1" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search technologies (e.g. Next.js, Python, Docker...)"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          {/* Quick Combos */}
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card/60 p-2.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-muted-foreground">
              Quick Stacks:
            </span>
            {SUGGESTED_COMBOS.map((combo) => (
              <button
                key={combo.name}
                onClick={() => handleLoadCombo(combo.name)}
                className="rounded-md bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary transition-all hover:bg-primary/20"
              >
                {combo.name}
              </button>
            ))}
          </div>

          <ToolToolbar
            onRun={handleRun}
            runLabel="Generate .gitignore"
            onLoadSample={() => handleLoadCombo('Next.js Fullstack')}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(gitignoreOutput)}
            canCopy={selectedNames.size > 0}
            onDownloadOutput={() =>
              downloadFile(gitignoreOutput, '.gitignore')
            }
            canDownload={selectedNames.size > 0}
          />
        </div>
      }
      statusArea={
        selectedNames.size > 0 ? (
          <StatusArea
            status="success"
            message={`${selectedNames.size} stacks selected`}
            detail={`${gitignoreOutput.split('\n').filter((l) => l.trim() && !l.startsWith('#')).length} unique rules generated`}
          />
        ) : (
          <StatusArea
            status="info"
            message="Select Technologies"
            detail="Choose languages, frameworks, and tools from the left panel"
          />
        )
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card/60">
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
            <span className="text-xs font-semibold text-foreground">
              Technology Stack Selector
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
              {selectedNames.size} Selected
            </span>
          </div>

          <div className="flex-1 overflow-auto p-3 space-y-4">
            {Object.entries(categorized).map(([category, stacks]) => {
              if (stacks.length === 0) return null;
              return (
                <div key={category} className="space-y-2">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    {categoryLabels[category] ?? category}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {stacks.map((stack) => {
                      const isSelected = selectedNames.has(stack.name);
                      return (
                        <button
                          key={stack.name}
                          onClick={() => toggleStack(stack.name)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-primary text-primary-foreground shadow-sm'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                          }`}
                        >
                          {stack.name}
                          {isSelected && (
                            <span className="ml-1.5 text-[10px] opacity-70">
                              ({stack.rules.length})
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title="Generated .gitignore"
          value={gitignoreOutput}
          language="text"
        />
      }
    />
  );
}
