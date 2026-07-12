'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, AlertCircle, FileSpreadsheet } from 'lucide-react';
import {
  generateIssueTemplateOutput,
  validateIssueTemplateConfig,
  ISSUE_TEMPLATE_PRESETS,
  generateIssueFormFieldId,
  type IssueTemplateConfig,
  type IssueTemplateFormat,
  type IssueFieldType,
} from '@/lib/issue-template-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function IssueTemplateBuilderPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [config, setConfig] = useState<IssueTemplateConfig>(
    ISSUE_TEMPLATE_PRESETS[0].config
  );
  const [newLabelTag, setNewLabelTag] = useState('');

  const output = useMemo(() => {
    return generateIssueTemplateOutput(config);
  }, [config]);

  const validation = useMemo(() => {
    return validateIssueTemplateConfig(config);
  }, [config]);

  const handleRun = () => {
    addHistoryItem(
      'GitHub Issue Template Builder',
      `Generated ${config.format} (${config.fields.length} fields)`
    );
  };

  const handleClear = () => {
    setConfig({
      name: 'Custom Template',
      description: 'Template description',
      titlePrefix: '[PREFIX]',
      labels: [],
      assignees: [],
      format: 'yaml-form',
      fields: [
        {
          id: generateIssueFormFieldId(),
          type: 'input',
          label: 'Issue Title / Subject',
          placeholder: 'Summary of the request',
          required: true,
        },
      ],
    });
  };

  const addField = () => {
    setConfig((prev) => ({
      ...prev,
      fields: [
        ...prev.fields,
        {
          id: generateIssueFormFieldId(),
          type: 'textarea',
          label: 'Details',
          description: 'Provide full details below',
          required: true,
        },
      ],
    }));
  };

  const removeField = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      fields: prev.fields.filter((f) => f.id !== id),
    }));
  };

  const addLabelTag = () => {
    if (!newLabelTag.trim()) return;
    const clean = newLabelTag.trim();
    if (!config.labels.includes(clean)) {
      setConfig((prev) => ({ ...prev, labels: [...prev.labels, clean] }));
    }
    setNewLabelTag('');
  };

  const removeLabelTag = (l: string) => {
    setConfig((prev) => ({
      ...prev,
      labels: prev.labels.filter((x) => x !== l),
    }));
  };

  return (
    <ToolPage
      title="GitHub Issue Template Builder"
      description="Visual builder for GitHub YAML Issue Forms (.yml) and Markdown templates (.md) with structured fields, dropdown selectors, checkboxes, and required validation rules"
      category="Git"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const p = ISSUE_TEMPLATE_PRESETS.find(
                  (x) => x.name === e.target.value
                );
                if (p) setConfig(p.config);
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Issue Template Preset...
              </option>
              {ISSUE_TEMPLATE_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground">
                Format:
              </span>
              {(
                [
                  'yaml-form',
                  'markdown-template',
                ] as IssueTemplateFormat[]
              ).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setConfig({ ...config, format: fmt })}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    config.format === fmt
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {fmt === 'yaml-form'
                    ? 'YAML Issue Form (.yml)'
                    : 'Markdown Template (.md)'}
                </button>
              ))}
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
            runLabel="Generate Template"
            onLoadSample={() => setConfig(ISSUE_TEMPLATE_PRESETS[0].config)}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(output)}
            canCopy={Boolean(output)}
            onDownloadOutput={() =>
              downloadFile(
                output,
                config.format === 'yaml-form'
                  ? 'bug_report.yml'
                  : 'issue_template.md'
              )
            }
            canDownload={Boolean(output)}
          />
        </div>
      }
      statusArea={
        validation.isValid ? (
          <StatusArea
            status="success"
            message={`Template: "${config.name}" (${config.format})`}
            detail={`Form Fields: ${config.fields.length} | Labels: ${config.labels.length}`}
          />
        ) : (
          <StatusArea
            status="error"
            message="Configuration Error"
            detail={validation.errors[0] ?? 'Check form fields'}
          />
        )
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* Metadata Header */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b border-border pb-2">
              <FileSpreadsheet className="h-4 w-4 text-primary" />
              <span>Template Metadata</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  Template Name
                </label>
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) =>
                    setConfig({ ...config, name: e.target.value })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 text-xs font-bold text-foreground"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  Title Prefix
                </label>
                <input
                  type="text"
                  value={config.titlePrefix}
                  onChange={(e) =>
                    setConfig({ ...config, titlePrefix: e.target.value })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-muted-foreground">
                  Description
                </label>
                <input
                  type="text"
                  value={config.description}
                  onChange={(e) =>
                    setConfig({ ...config, description: e.target.value })
                  }
                  className="w-full rounded border border-border bg-card px-2 py-1 text-xs text-foreground"
                />
              </div>
            </div>

            {/* Labels */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newLabelTag}
                onChange={(e) => setNewLabelTag(e.target.value)}
                placeholder="Add default label (e.g. bug)"
                className="w-44 rounded border border-border bg-card px-2 py-1 text-xs text-foreground"
                onKeyDown={(e) => e.key === 'Enter' && addLabelTag()}
              />
              <button
                onClick={addLabelTag}
                className="rounded bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary"
              >
                Add Label
              </button>

              <div className="flex flex-wrap gap-1">
                {config.labels.map((l) => (
                  <span
                    key={l}
                    className="flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-[11px] font-bold text-foreground"
                  >
                    <span>{l}</span>
                    <button
                      onClick={() => removeLabelTag(l)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">
                Issue Form Fields ({config.fields.length})
              </span>
              <button
                onClick={addField}
                className="flex items-center gap-1 rounded bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary hover:bg-primary/20"
              >
                <Plus className="h-3.5 w-3.5" /> Add Field
              </button>
            </div>

            {config.fields.map((field, idx) => (
              <div
                key={field.id}
                className="rounded-xl border border-border bg-background p-3 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <select
                      value={field.type}
                      onChange={(e) => {
                        const next = [...config.fields];
                        next[idx] = {
                          ...field,
                          type: e.target.value as IssueFieldType,
                        };
                        setConfig({ ...config, fields: next });
                      }}
                      className="rounded border border-border bg-card px-2 py-1 text-xs font-bold text-primary"
                    >
                      <option value="input">Text Input</option>
                      <option value="textarea">Textarea</option>
                      <option value="dropdown">Dropdown Options</option>
                      <option value="checkboxes">Checkboxes</option>
                      <option value="markdown">Markdown Instructions</option>
                    </select>

                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => {
                        const next = [...config.fields];
                        next[idx] = { ...field, label: e.target.value };
                        setConfig({ ...config, fields: next });
                      }}
                      placeholder="Field label..."
                      className="w-48 rounded border border-border bg-card px-2 py-1 text-xs font-bold text-foreground"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    {field.type !== 'markdown' && (
                      <label className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.required ?? false}
                          onChange={(e) => {
                            const next = [...config.fields];
                            next[idx] = {
                              ...field,
                              required: e.target.checked,
                            };
                            setConfig({ ...config, fields: next });
                          }}
                          className="rounded border-border"
                        />
                        Required
                      </label>
                    )}

                    <button
                      onClick={() => removeField(field.id)}
                      className="text-muted-foreground hover:text-destructive p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={field.description ?? ''}
                  onChange={(e) => {
                    const next = [...config.fields];
                    next[idx] = { ...field, description: e.target.value };
                    setConfig({ ...config, fields: next });
                  }}
                  placeholder="Helper description / guidance..."
                  className="w-full rounded border border-border bg-card px-2 py-1 text-xs text-muted-foreground"
                />

                {(field.type === 'dropdown' || field.type === 'checkboxes') && (
                  <input
                    type="text"
                    value={(field.options || []).join(', ')}
                    onChange={(e) => {
                      const opts = e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean);
                      const next = [...config.fields];
                      next[idx] = { ...field, options: opts };
                      setConfig({ ...config, fields: next });
                    }}
                    placeholder="Options separated by commas (e.g. Chrome, Firefox, Safari)"
                    className="w-full rounded border border-border bg-muted px-2 py-1 font-mono text-xs text-foreground"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title={`Generated Issue Template (${config.format})`}
          value={output}
          language={config.format === 'yaml-form' ? 'yaml' : 'markdown'}
        />
      }
    />
  );
}
