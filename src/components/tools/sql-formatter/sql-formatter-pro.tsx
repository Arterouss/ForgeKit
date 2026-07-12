'use client';

import { useState, useMemo } from 'react';
import {
  BookOpen,
  SlidersHorizontal,
  Database,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import {
  formatSql,
  minifySql,
  validateSql,
  analyzeSql,
  SQL_PRESETS,
  type SqlDialect,
} from '@/lib/sql-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  InputPanel,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export type SqlMode = 'format' | 'minify' | 'analyze' | 'validate';

export function SqlFormatterPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [mode, setMode] = useState<SqlMode>('format');
  const [input, setInput] = useState<string>(SQL_PRESETS[0].sampleSql);
  const [dialect, setDialect] = useState<SqlDialect>('postgresql');
  const [indentSize, setIndentSize] = useState<number>(2);
  const [uppercaseKeywords, setUppercaseKeywords] = useState<boolean>(true);

  const result = useMemo(() => {
    if (!input.trim()) {
      return {
        output: '',
        isValid: true,
        errorMessage: null as string | null,
        analysis: null,
      };
    }

    if (mode === 'format') {
      const formatted = formatSql(input, {
        dialect,
        indentSize,
        uppercaseKeywords,
      });
      return {
        output: formatted.output,
        isValid: formatted.isValid,
        errorMessage: formatted.error,
        analysis: null,
      };
    } else if (mode === 'minify') {
      const minified = minifySql(input);
      return {
        output: minified.output,
        isValid: minified.isValid,
        errorMessage: null,
        analysis: null,
      };
    } else if (mode === 'analyze') {
      const validation = validateSql(input);
      const metrics = analyzeSql(input);
      return {
        output: validation.isValid
          ? `SQL Query Analysis Generated for ${metrics.statementType} statement.`
          : validation.message,
        isValid: validation.isValid,
        errorMessage: validation.isValid ? null : validation.message,
        analysis: metrics,
      };
    } else {
      // validate
      const validation = validateSql(input);
      return {
        output: validation.isValid
          ? 'SQL Query syntax and parentheses are 100% valid.'
          : validation.message,
        isValid: validation.isValid,
        errorMessage: validation.isValid ? null : validation.message,
        analysis: null,
      };
    }
  }, [input, mode, dialect, indentSize, uppercaseKeywords]);

  const handleRun = () => {
    addHistoryItem(
      'SQL Formatter Pro',
      `${mode.toUpperCase()} SQL (${dialect.toUpperCase()})`
    );
  };

  const handleLoadSample = (presetName: string) => {
    const preset =
      SQL_PRESETS.find((p) => p.name === presetName) ?? SQL_PRESETS[0];
    setInput(preset.sampleSql);
    setMode('format');
    addHistoryItem('SQL Formatter Pro', `Loaded Preset: ${preset.name}`);
  };

  const handleClear = () => {
    setInput('');
  };

  return (
    <ToolPage
      title="SQL Formatter Pro"
      description="Beautify, minify, validate, and analyze SQL queries with multi-dialect support and query inspector"
      category="Formatting"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          {/* Mode Selector Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setMode('format')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  mode === 'format'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                Beautify SQL
              </button>
              <button
                onClick={() => setMode('minify')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  mode === 'minify'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                Minify SQL
              </button>
              <button
                onClick={() => setMode('analyze')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  mode === 'analyze'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                Query Analysis & Inspector
              </button>
              <button
                onClick={() => setMode('validate')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  mode === 'validate'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                Validate Only
              </button>
            </div>

            {/* Dialect & Preset Dropdown */}
            <div className="flex items-center gap-2">
              <Database className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={dialect}
                onChange={(e) => setDialect(e.target.value as SqlDialect)}
                className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
              >
                <option value="postgresql">PostgreSQL</option>
                <option value="mysql">MySQL</option>
                <option value="sqlite">SQLite</option>
                <option value="tsql">SQL Server (T-SQL)</option>
              </select>

              <div className="flex items-center gap-1.5 ml-2">
                <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  onChange={(e) => {
                    if (e.target.value) handleLoadSample(e.target.value);
                  }}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Load Preset...
                  </option>
                  {SQL_PRESETS.map((preset) => (
                    <option key={preset.name} value={preset.name}>
                      {preset.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Formatting Options Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 px-3 py-2 text-xs">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer text-foreground">
                <input
                  type="checkbox"
                  checked={uppercaseKeywords}
                  onChange={(e) => setUppercaseKeywords(e.target.checked)}
                  className="rounded border-border"
                />
                <span className="font-semibold">Uppercase Keywords (SELECT, FROM...)</span>
              </label>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Indent Size:</span>
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="rounded-md border border-border bg-background px-2 py-0.5 font-mono text-xs text-foreground focus:outline-none"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
              </select>
            </div>
          </div>

          <ToolToolbar
            onRun={handleRun}
            runLabel={
              mode === 'format'
                ? 'Beautify SQL'
                : mode === 'minify'
                  ? 'Minify SQL'
                  : mode === 'analyze'
                    ? 'Analyze Query Metrics'
                    : 'Validate Syntax'
            }
            onLoadSample={() => handleLoadSample('SELECT with JOINs')}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(result.output)}
            canCopy={result.isValid && Boolean(result.output)}
            onDownloadOutput={() => downloadFile(result.output, `devforge-${mode}.sql`)}
            canDownload={result.isValid && Boolean(result.output)}
          />
        </div>
      }
      statusArea={
        result.isValid ? (
          <StatusArea
            status="success"
            message={
              mode === 'format'
                ? 'SQL Formatted Cleanly'
                : mode === 'minify'
                  ? 'SQL Minified onto Single Line'
                  : mode === 'analyze'
                    ? 'SQL Query Inspected successfully'
                    : 'Valid SQL Syntax'
            }
          />
        ) : (
          <StatusArea
            status="error"
            message="SQL Validation Error"
            detail={result.errorMessage ?? 'Unbalanced parentheses or syntax error'}
          />
        )
      }
      inputPanel={
        <InputPanel
          title="SQL Query Input"
          value={input}
          onChange={setInput}
          language="sql"
          onClear={handleClear}
        />
      }
      outputPanel={
        mode === 'analyze' && result.analysis ? (
          <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card/60">
            <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
              <span className="text-xs font-semibold text-foreground">
                SQL Query Analysis Dashboard
              </span>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                {result.analysis.statementType} Statement
              </span>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg border border-border bg-background p-3 text-center">
                  <div className="text-[11px] text-muted-foreground font-semibold">
                    JOIN Count
                  </div>
                  <div className="mt-1 font-mono text-xl font-bold text-foreground">
                    {result.analysis.joinCount}
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-background p-3 text-center">
                  <div className="text-[11px] text-muted-foreground font-semibold">
                    Tables Detected
                  </div>
                  <div className="mt-1 font-mono text-xl font-bold text-foreground">
                    {result.analysis.detectedTables.length}
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-background p-3 text-center">
                  <div className="text-[11px] text-muted-foreground font-semibold">
                    Statement Type
                  </div>
                  <div className="mt-1 font-mono text-sm font-bold text-primary">
                    {result.analysis.statementType}
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-background p-3 text-center">
                  <div className="text-[11px] text-muted-foreground font-semibold">
                    Dialect Target
                  </div>
                  <div className="mt-1 font-mono text-sm font-bold uppercase text-foreground">
                    {dialect}
                  </div>
                </div>
              </div>

              {/* Detected Tables List */}
              <div className="rounded-lg border border-border bg-background p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Layers className="h-4 w-4 text-primary" />
                  <span>Referenced Tables</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.analysis.detectedTables.length === 0 ? (
                    <span className="text-xs italic text-muted-foreground">
                      No external tables detected
                    </span>
                  ) : (
                    result.analysis.detectedTables.map((tbl) => (
                      <span
                        key={tbl}
                        className="rounded-md bg-primary/10 px-2.5 py-1 font-mono text-xs font-bold text-primary"
                      >
                        {tbl}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Query Clauses Present */}
              <div className="rounded-lg border border-border bg-background p-3 space-y-2">
                <div className="text-xs font-semibold text-foreground">
                  Detected Clauses & Features
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <div
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold ${
                      result.analysis.hasWhere
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    WHERE Clause
                  </div>
                  <div
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold ${
                      result.analysis.hasGroupBy
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    GROUP BY
                  </div>
                  <div
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold ${
                      result.analysis.hasOrderBy
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    ORDER BY
                  </div>
                  <div
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold ${
                      result.analysis.hasLimit
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    LIMIT Clause
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <OutputPanel
            title={
              mode === 'format'
                ? 'Beautified SQL'
                : mode === 'minify'
                  ? 'Minified SQL'
                  : 'Validation Output'
            }
            value={result.output}
            language="sql"
            errorMessage={result.errorMessage ?? undefined}
          />
        )
      }
    />
  );
}
