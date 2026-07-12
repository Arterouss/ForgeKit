'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, AlertCircle, CheckSquare } from 'lucide-react';
import {
  generatePrTemplateMarkdown,
  validatePrTemplateConfig,
  PR_TEMPLATE_PRESETS,
  generatePrTemplateSectionId,
  type PrTemplateConfig,
} from '@/lib/pr-template-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function PrTemplateBuilderPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [config, setConfig] = useState<PrTemplateConfig>(
    PR_TEMPLATE_PRESETS[0].config
  );
  const [newChecklistInput, setNewChecklistInput] = useState('');

  const output = useMemo(() => {
    return generatePrTemplateMarkdown(config);
  }, [config]);

  const validation = useMemo(() => {
    return validatePrTemplateConfig(config);
  }, [config]);

  const handleRun = () => {
    addHistoryItem(
      'Pull Request Template Builder',
      `Generated PULL_REQUEST_TEMPLATE.md (${config.checklistItems.length} checklist steps)`
    );
  };

  const handleClear = () => {
    setConfig({
      includeIssueLink: true,
      includeChangeTypes: true,
      changeTypes: ['🐛 Bug fix', '✨ New feature'],
      includeChecklist: true,
      checklistItems: ['Code self-reviewed', 'Tests pass'],
      customSections: [],
    });
  };

  const addChecklistItem = () => {
    if (!newChecklistInput.trim()) return;
    setConfig((prev) => ({
      ...prev,
      checklistItems: [...prev.checklistItems, newChecklistInput.trim()],
    }));
    setNewChecklistInput('');
  };

  const removeChecklistItem = (idx: number) => {
    setConfig((prev) => ({
      ...prev,
      checklistItems: prev.checklistItems.filter((_, i) => i !== idx),
    }));
  };

  const addCustomSection = () => {
    setConfig((prev) => ({
      ...prev,
      customSections: [
        ...prev.customSections,
        {
          id: generatePrTemplateSectionId(),
          title: 'Deployment / Post-Merge Notes',
          enabled: true,
          content: '<!-- Note any environment variable or database migration requirements -->',
          items: [],
        },
      ],
    }));
  };

  const removeCustomSection = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      customSections: prev.customSections.filter((s) => s.id !== id),
    }));
  };

  return (
    <ToolPage
      title="Pull Request Template Builder"
      description="Interactive generator for .github/PULL_REQUEST_TEMPLATE.md with structured review checklists, issue linkage, change type categories, and quality verification steps"
      category="Git"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const p = PR_TEMPLATE_PRESETS.find(
                  (x) => x.name === e.target.value
                );
                if (p) setConfig(p.config);
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load PR Template Preset...
              </option>
              {PR_TEMPLATE_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeIssueLink}
                  onChange={(e) =>
                    setConfig({ ...config, includeIssueLink: e.target.checked })
                  }
                  className="rounded border-border"
                />
                Issue Linkage
              </label>

              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeChangeTypes}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      includeChangeTypes: e.target.checked,
                    })
                  }
                  className="rounded border-border"
                />
                Change Types
              </label>
            </div>
          </div>

          {validation.errors.length > 0 && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-2.5 space-y-1">
              {validation.errors.map((err, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 text-xs text-destructive font-medium"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{err}</span>
                </div>
              ))}
            </div>
          )}

          <ToolToolbar
            onRun={handleRun}
            runLabel="Generate PR Template"
            onLoadSample={() => setConfig(PR_TEMPLATE_PRESETS[0].config)}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(output)}
            canCopy={Boolean(output)}
            onDownloadOutput={() =>
              downloadFile(output, 'PULL_REQUEST_TEMPLATE.md')
            }
            canDownload={Boolean(output)}
          />
        </div>
      }
      statusArea={
        validation.isValid ? (
          <StatusArea
            status="success"
            message="Ready to Export"
            detail={`Sections Enabled: ${
              (config.includeIssueLink ? 1 : 0) +
              (config.includeChangeTypes ? 1 : 0) +
              (config.includeChecklist ? 1 : 0) +
              config.customSections.filter((s) => s.enabled).length +
              1
            } | Checklist Steps: ${config.checklistItems.length}`}
          />
        ) : (
          <StatusArea
            status="error"
            message="Configuration Error"
            detail={validation.errors[0] ?? 'Check section settings'}
          />
        )
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* Quality Checklist Editor */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <CheckSquare className="h-4 w-4 text-primary" />
                <span>Verification & Quality Checklist Steps</span>
              </div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeChecklist}
                  onChange={(e) =>
                    setConfig({ ...config, includeChecklist: e.target.checked })
                  }
                  className="rounded border-border"
                />
                Include Checklist
              </label>
            </div>

            {config.includeChecklist && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newChecklistInput}
                    onChange={(e) => setNewChecklistInput(e.target.value)}
                    placeholder="Add step (e.g. Added Vitest unit tests for new utils)"
                    className="flex-1 rounded border border-border bg-card px-2.5 py-1 text-xs text-foreground"
                    onKeyDown={(e) =>
                      e.key === 'Enter' && addChecklistItem()
                    }
                  />
                  <button
                    onClick={addChecklistItem}
                    className="rounded bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary hover:bg-primary/20"
                  >
                    Add Step
                  </button>
                </div>

                <div className="space-y-1.5">
                  {config.checklistItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-foreground"
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-primary font-bold">
                          [ ]
                        </span>
                        <span>{item}</span>
                      </span>
                      <button
                        onClick={() => removeChecklistItem(idx)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Custom Sections */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs font-bold text-foreground">
                Custom Sections ({config.customSections.length})
              </span>
              <button
                onClick={addCustomSection}
                className="flex items-center gap-1 rounded bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary hover:bg-primary/20"
              >
                <Plus className="h-3.5 w-3.5" /> Add Section
              </button>
            </div>

            {config.customSections.map((sec, idx) => (
              <div
                key={sec.id}
                className="rounded-lg border border-border bg-card p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={sec.title}
                    onChange={(e) => {
                      const next = [...config.customSections];
                      next[idx] = { ...sec, title: e.target.value };
                      setConfig({ ...config, customSections: next });
                    }}
                    placeholder="Section Title..."
                    className="w-64 rounded border border-border bg-background px-2 py-1 text-xs font-bold text-foreground"
                  />
                  <button
                    onClick={() => removeCustomSection(sec.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  value={sec.content ?? ''}
                  onChange={(e) => {
                    const next = [...config.customSections];
                    next[idx] = { ...sec, content: e.target.value };
                    setConfig({ ...config, customSections: next });
                  }}
                  rows={2}
                  placeholder="Markdown instruction comments or tables..."
                  className="w-full rounded border border-border bg-background px-2.5 py-1.5 font-mono text-xs text-muted-foreground"
                />
              </div>
            ))}
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title="Generated PULL_REQUEST_TEMPLATE.md"
          value={output}
          language="markdown"
        />
      }
    />
  );
}
