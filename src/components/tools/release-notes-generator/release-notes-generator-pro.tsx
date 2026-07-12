'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, AlertCircle, FileText, Upload } from 'lucide-react';
import {
  generateReleaseNotesMarkdown,
  validateReleaseNotesConfig,
  parseRawCommitLog,
  RELEASE_NOTES_PRESETS,
  generateCommitEntryId,
  type ReleaseNotesConfig,
  type ParsedCommitEntry,
} from '@/lib/release-notes-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function ReleaseNotesGeneratorPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [config, setConfig] = useState<ReleaseNotesConfig>(
    RELEASE_NOTES_PRESETS[0].config
  );

  const [rawLogInput, setRawLogInput] = useState('');
  const [showLogParser, setShowLogParser] = useState(false);

  const output = useMemo(() => {
    return generateReleaseNotesMarkdown(config);
  }, [config]);

  const validation = useMemo(() => {
    return validateReleaseNotesConfig(config);
  }, [config]);

  const handleRun = () => {
    addHistoryItem(
      'Release Notes Generator',
      `Generated Changelog (${config.version})`
    );
  };

  const handleClear = () => {
    setConfig({
      version: 'v1.0.0',
      dateString: new Date().toISOString().split('T')[0],
      githubRepo: 'owner/repo',
      previousVersion: '',
      commits: [],
      includeContributors: true,
    });
  };

  const handleParseRawLog = () => {
    if (!rawLogInput.trim()) return;
    const parsed = parseRawCommitLog(rawLogInput);
    setConfig((prev) => ({
      ...prev,
      commits: [...prev.commits, ...parsed],
    }));
    setRawLogInput('');
    setShowLogParser(false);
  };

  const addCommitEntry = () => {
    setConfig((prev) => ({
      ...prev,
      commits: [
        ...prev.commits,
        {
          id: generateCommitEntryId(),
          type: 'feat',
          scope: '',
          subject: 'New feature change description',
          author: '@User',
        },
      ],
    }));
  };

  const removeCommitEntry = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      commits: prev.commits.filter((c) => c.id !== id),
    }));
  };

  return (
    <ToolPage
      title="Release Notes Generator"
      description="Automated changelog builder that parses git log --oneline output and groups commits into semantic categories with GitHub comparison links"
      category="Git"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const p = RELEASE_NOTES_PRESETS.find(
                  (x) => x.name === e.target.value
                );
                if (p) setConfig(p.config);
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Release Notes Preset...
              </option>
              {RELEASE_NOTES_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLogParser(!showLogParser)}
                className="flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary hover:bg-primary/20"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Parse Raw Git Log</span>
              </button>

              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeContributors}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      includeContributors: e.target.checked,
                    })
                  }
                  className="rounded border-border"
                />
                Contributors Section
              </label>
            </div>
          </div>

          {showLogParser && (
            <div className="rounded-xl border border-border bg-card p-3 space-y-2">
              <span className="text-xs font-bold text-foreground">
                Paste raw `git log --oneline` output below:
              </span>
              <textarea
                rows={4}
                value={rawLogInput}
                onChange={(e) => setRawLogInput(e.target.value)}
                placeholder="a1b2c3d feat(api): add user endpoint&#10;e4f5g6h fix(auth): resolve token refresh"
                className="w-full rounded border border-border bg-background p-2 font-mono text-xs text-foreground"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowLogParser(false)}
                  className="rounded px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={handleParseRawLog}
                  className="rounded bg-primary px-3 py-1 text-xs font-bold text-primary-foreground hover:bg-primary/90"
                >
                  Parse & Import Commits
                </button>
              </div>
            </div>
          )}

          {validation.warnings.length > 0 && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 space-y-1">
              {validation.warnings.map((warn, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{warn}</span>
                </div>
              ))}
            </div>
          )}

          <ToolToolbar
            onRun={handleRun}
            runLabel="Generate Changelog"
            onLoadSample={() => setConfig(RELEASE_NOTES_PRESETS[0].config)}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(output)}
            canCopy={Boolean(output)}
            onDownloadOutput={() => downloadFile(output, 'CHANGELOG.md')}
            canDownload={Boolean(output)}
          />
        </div>
      }
      statusArea={
        validation.isValid ? (
          <StatusArea
            status="success"
            message={`Version ${config.version} (${config.commits.length} commits)`}
            detail={`Compared against ${config.previousVersion || 'initial release'}`}
          />
        ) : (
          <StatusArea
            status="error"
            message="Configuration Error"
            detail={validation.errors[0] ?? 'Check release version tag'}
          />
        )
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* Metadata */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="flex items-center gap-2 border-b border-border pb-2 text-xs font-bold text-foreground">
              <FileText className="h-4 w-4 text-primary" />
              <span>Release Identity & Metadata</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Release Version Tag
                </label>
                <input
                  type="text"
                  value={config.version}
                  onChange={(e) =>
                    setConfig({ ...config, version: e.target.value })
                  }
                  placeholder="v2.0.0"
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs font-bold text-primary"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Release Date
                </label>
                <input
                  type="text"
                  value={config.dateString}
                  onChange={(e) =>
                    setConfig({ ...config, dateString: e.target.value })
                  }
                  placeholder="2026-07-12"
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  GitHub Repository (owner/repo)
                </label>
                <input
                  type="text"
                  value={config.githubRepo}
                  onChange={(e) =>
                    setConfig({ ...config, githubRepo: e.target.value })
                  }
                  placeholder="Arterouss/ForgeKit"
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground">
                  Previous Release Version Tag
                </label>
                <input
                  type="text"
                  value={config.previousVersion ?? ''}
                  onChange={(e) =>
                    setConfig({ ...config, previousVersion: e.target.value })
                  }
                  placeholder="v1.9.0"
                  className="w-full rounded border border-border bg-card px-2 py-1 font-mono text-xs text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Commit List */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-2">
            <div className="flex items-center justify-between border-b border-border pb-1.5">
              <span className="text-xs font-bold text-foreground">
                Commit Entries ({config.commits.length})
              </span>
              <button
                onClick={addCommitEntry}
                className="flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary"
              >
                <Plus className="h-3 w-3" /> Add Commit
              </button>
            </div>

            {config.commits.map((commit, idx) => (
              <div
                key={commit.id}
                className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-lg border border-border bg-card p-2.5"
              >
                <select
                  value={commit.type}
                  onChange={(e) => {
                    const next = [...config.commits];
                    next[idx] = {
                      ...commit,
                      type: e.target.value as ParsedCommitEntry['type'],
                    };
                    setConfig({ ...config, commits: next });
                  }}
                  className="rounded border border-border bg-background px-2 py-1 text-xs font-bold text-foreground"
                >
                  <option value="feat">✨ feat</option>
                  <option value="fix">🐛 fix</option>
                  <option value="perf">⚡ perf</option>
                  <option value="docs">📚 docs</option>
                  <option value="other">♻️ other</option>
                </select>

                <input
                  type="text"
                  value={commit.scope ?? ''}
                  onChange={(e) => {
                    const next = [...config.commits];
                    next[idx] = { ...commit, scope: e.target.value };
                    setConfig({ ...config, commits: next });
                  }}
                  placeholder="Scope"
                  className="w-24 rounded border border-border bg-background px-2 py-1 font-mono text-xs text-foreground"
                />

                <input
                  type="text"
                  value={commit.subject}
                  onChange={(e) => {
                    const next = [...config.commits];
                    next[idx] = { ...commit, subject: e.target.value };
                    setConfig({ ...config, commits: next });
                  }}
                  placeholder="Commit message summary..."
                  className="flex-1 rounded border border-border bg-background px-2 py-1 text-xs text-foreground"
                />

                <input
                  type="text"
                  value={commit.author ?? ''}
                  onChange={(e) => {
                    const next = [...config.commits];
                    next[idx] = { ...commit, author: e.target.value };
                    setConfig({ ...config, commits: next });
                  }}
                  placeholder="@author"
                  className="w-24 rounded border border-border bg-background px-2 py-1 font-mono text-xs text-muted-foreground"
                />

                <button
                  onClick={() => removeCommitEntry(commit.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title="Generated Release Notes Markdown"
          value={output}
          language="markdown"
        />
      }
    />
  );
}
