'use client';

import { useState, useMemo } from 'react';
import { BookOpen } from 'lucide-react';
import {
  testRegex,
  replaceRegex,
  REGEX_EXAMPLES,
  type RegexPreset,
} from '@/lib/regex-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  InputPanel,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export type RegexStudioMode = 'test' | 'replace';

export function RegexStudioPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [mode, setMode] = useState<RegexStudioMode>('test');
  const [pattern, setPattern] = useState<string>(REGEX_EXAMPLES[0].pattern);
  const [flags, setFlags] = useState<string>(REGEX_EXAMPLES[0].flags);
  const [testString, setTestString] = useState<string>(
    REGEX_EXAMPLES[0].sampleText
  );
  const [replacement, setReplacement] = useState<string>('[REDACTED]');

  const availableFlags = [
    { flag: 'g', label: 'Global (g)', desc: 'Match all occurrences' },
    { flag: 'i', label: 'Case Insensitive (i)', desc: 'Ignore uppercase/lowercase' },
    { flag: 'm', label: 'Multiline (m)', desc: '^ and $ match each line' },
    { flag: 's', label: 'DotAll (s)', desc: '. matches newlines' },
    { flag: 'u', label: 'Unicode (u)', desc: 'Full Unicode support' },
  ];

  const toggleFlag = (char: string) => {
    setFlags((prev) =>
      prev.includes(char)
        ? prev.replace(char, '')
        : prev + char
    );
  };

  const matchResult = useMemo(() => {
    return testRegex(pattern, flags, testString);
  }, [pattern, flags, testString]);

  const replaceResult = useMemo(() => {
    if (mode !== 'replace') return { isValid: true, output: '', error: null };
    return replaceRegex(pattern, flags, testString, replacement);
  }, [mode, pattern, flags, testString, replacement]);

  const handleRun = () => {
    if (mode === 'test') {
      addHistoryItem(
        'Regex Studio Pro',
        `Tested Regex: /${pattern}/${flags} (${matchResult.totalMatches} matches)`
      );
    } else {
      addHistoryItem(
        'Regex Studio Pro',
        `Replaced Regex: /${pattern}/${flags}`
      );
    }
  };

  const handleLoadSample = () => {
    const nextPreset =
      REGEX_EXAMPLES.find((p) => p.pattern !== pattern) ?? REGEX_EXAMPLES[0];
    handleLoadPreset(nextPreset);
  };

  const handleLoadPreset = (preset: RegexPreset) => {
    setPattern(preset.pattern);
    setFlags(preset.flags);
    setTestString(preset.sampleText);
    addHistoryItem('Regex Studio Pro', `Loaded Preset: ${preset.name}`);
  };

  const handleClear = () => {
    setPattern('');
    setTestString('');
  };

  return (
    <ToolPage
      title="Regex Studio Pro"
      description="Design, test, and debug regular expressions with live group captures, flag toggles, and preset library"
      category="Text"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          {/* Pattern Input & Flag Badges */}
          <div className="space-y-2 rounded-xl border border-border bg-card/60 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-foreground">
                Regular Expression Pattern
              </span>
              <div className="flex items-center gap-1">
                {availableFlags.map((item) => {
                  const isActive = flags.includes(item.flag);
                  return (
                    <button
                      key={item.flag}
                      onClick={() => toggleFlag(item.flag)}
                      title={`${item.label} — ${item.desc}`}
                      className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-bold transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {item.flag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-muted-foreground">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter regex pattern (e.g. \d+ or [a-z]+)"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
              />
              <span className="font-mono text-sm font-bold text-muted-foreground">
                /{flags}
              </span>
            </div>
          </div>

          {/* Mode & Preset Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card/60 p-2.5">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setMode('test')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  mode === 'test'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                Match & Inspect Groups
              </button>
              <button
                onClick={() => setMode('replace')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  mode === 'replace'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                Replace Mode
              </button>
            </div>

            {/* Quick Preset Selector */}
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                onChange={(e) => {
                  const preset = REGEX_EXAMPLES.find((p) => p.name === e.target.value);
                  if (preset) handleLoadPreset(preset);
                }}
                className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none"
                defaultValue=""
              >
                <option value="" disabled>
                  Load Preset...
                </option>
                {REGEX_EXAMPLES.map((preset) => (
                  <option key={preset.name} value={preset.name}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Replace Input Row (when in replace mode) */}
          {mode === 'replace' && (
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card/60 p-3">
              <span className="text-xs font-semibold text-muted-foreground w-28">
                Replacement:
              </span>
              <input
                type="text"
                value={replacement}
                onChange={(e) => setReplacement(e.target.value)}
                placeholder="Replacement string (e.g. $1 or redacted)"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          )}

          <ToolToolbar
            onRun={handleRun}
            runLabel={mode === 'test' ? 'Run Regex Match' : 'Run Replace'}
            onLoadSample={handleLoadSample}
            onClear={handleClear}
            onCopyOutput={() =>
              copyOutput(
                mode === 'test'
                  ? JSON.stringify(matchResult.matches, null, 2)
                  : replaceResult.output
              )
            }
            canCopy={
              mode === 'test'
                ? matchResult.matches.length > 0
                : Boolean(replaceResult.output)
            }
            onDownloadOutput={() =>
              downloadFile(
                mode === 'test'
                  ? JSON.stringify(matchResult.matches, null, 2)
                  : replaceResult.output,
                'devforge-regex-result.txt'
              )
            }
            canDownload={
              mode === 'test'
                ? matchResult.matches.length > 0
                : Boolean(replaceResult.output)
            }
          />
        </div>
      }
      statusArea={
        matchResult.isValid ? (
          <StatusArea
            status="success"
            message={`Valid Pattern (/${pattern}/${flags})`}
            detail={`Found ${matchResult.totalMatches} match${matchResult.totalMatches === 1 ? '' : 'es'}`}
          />
        ) : (
          <StatusArea
            status="error"
            message="Invalid Regular Expression"
            detail={matchResult.error ?? 'Syntax error in regex pattern'}
          />
        )
      }
      inputPanel={
        <InputPanel
          title="Test Target String"
          value={testString}
          onChange={setTestString}
          language="text"
          onClear={() => setTestString('')}
        />
      }
      outputPanel={
        mode === 'replace' ? (
          <OutputPanel
            title="Replacement Output"
            value={replaceResult.output}
            language="text"
            errorMessage={replaceResult.error ?? undefined}
          />
        ) : (
          <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card/60">
            <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
              <span className="text-xs font-semibold text-foreground">
                Match Results & Captured Groups
              </span>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                {matchResult.totalMatches} Matches
              </span>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-3 font-mono text-xs">
              {matchResult.matches.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground italic">
                  No matches found for /{pattern}/{flags} in test string.
                </div>
              ) : (
                matchResult.matches.map((item) => (
                  <div
                    key={item.index}
                    className="rounded-lg border border-border bg-background p-3 space-y-1.5"
                  >
                    <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                      <span className="font-bold text-primary">
                        Match #{item.index + 1}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Pos: {item.start} – {item.end}
                      </span>
                    </div>
                    <div className="break-all font-semibold text-foreground">
                      &quot;{item.match}&quot;
                    </div>
                    {item.groups && item.groups.length > 0 && (
                      <div className="mt-2 space-y-1 pt-1 border-t border-border/40 text-[11px]">
                        <span className="font-sans font-semibold text-muted-foreground">
                          Captured Groups:
                        </span>
                        <div className="grid gap-1">
                          {item.groups.map((group, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between rounded bg-muted/40 px-2 py-0.5"
                            >
                              <span className="text-muted-foreground">Group ${idx + 1}:</span>
                              <span className="font-semibold text-foreground">{group}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )
      }
    />
  );
}
