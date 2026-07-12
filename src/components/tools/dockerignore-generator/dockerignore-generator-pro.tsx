'use client';

import { useState, useMemo } from 'react';
import { ShieldCheck } from 'lucide-react';
import {
  mergeDockerignoreRules,
  DOCKERIGNORE_STACKS,
  type DockerignoreStack,
} from '@/lib/dockerignore-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function DockerignoreGeneratorPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [selectedNames, setSelectedNames] = useState<Set<string>>(
    new Set([
      'Security & Secrets (MUST HAVE)',
      'IDEs & OS Files',
      'Node.js & Next.js',
    ])
  );

  const selectedStacks: DockerignoreStack[] = useMemo(
    () => DOCKERIGNORE_STACKS.filter((s) => selectedNames.has(s.name)),
    [selectedNames]
  );

  const output = useMemo(
    () => mergeDockerignoreRules(selectedStacks),
    [selectedStacks]
  );

  const toggleStack = (name: string) => {
    setSelectedNames((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleRun = () => {
    addHistoryItem(
      '.dockerignore Generator Pro',
      `Generated .dockerignore (${selectedNames.size} stacks)`
    );
  };

  const handleClear = () => {
    setSelectedNames(new Set(['Security & Secrets (MUST HAVE)']));
  };

  return (
    <ToolPage
      title=".dockerignore Generator Pro"
      description="Generate comprehensive, highly-secure .dockerignore files to prevent secret leakage and optimize build cache"
      category="Docker"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card/60 p-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-semibold text-foreground">
              Always includes Security & Secrets prevention rules
            </span>
          </div>

          <ToolToolbar
            onRun={handleRun}
            runLabel="Generate .dockerignore"
            onLoadSample={() =>
              setSelectedNames(
                new Set([
                  'Security & Secrets (MUST HAVE)',
                  'IDEs & OS Files',
                  'Node.js & Next.js',
                ])
              )
            }
            onClear={handleClear}
            onCopyOutput={() => copyOutput(output)}
            canCopy={Boolean(output)}
            onDownloadOutput={() => downloadFile(output, '.dockerignore')}
            canDownload={Boolean(output)}
          />
        </div>
      }
      statusArea={
        selectedNames.size > 0 ? (
          <StatusArea
            status="success"
            message={`${selectedNames.size} Dockerignore Stacks Active`}
            detail={`${output.split('\n').filter((l) => l.trim() && !l.startsWith('#')).length} rules generated`}
          />
        ) : (
          <StatusArea
            status="info"
            message="Select Tech Stacks"
            detail="Choose technologies from the left panel"
          />
        )
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card/60">
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
            <span className="text-xs font-semibold text-foreground">
              Technology Stacks
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
              {selectedNames.size} Selected
            </span>
          </div>

          <div className="flex-1 overflow-auto p-3 space-y-3">
            {DOCKERIGNORE_STACKS.map((stack) => {
              const isSelected = selectedNames.has(stack.name);
              return (
                <button
                  key={stack.name}
                  onClick={() => toggleStack(stack.name)}
                  className={`w-full flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-sm'
                      : 'border-border bg-background hover:bg-muted/50'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-foreground">
                      {stack.name}
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground font-mono">
                      {stack.rules.slice(0, 4).join(', ')}...
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {stack.rules.length} rules
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title="Generated .dockerignore"
          value={output}
          language="text"
        />
      }
    />
  );
}
