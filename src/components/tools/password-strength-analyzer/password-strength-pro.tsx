'use client';

import { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  AlertTriangle,
  Lightbulb,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  analyzePasswordStrength,
  SAMPLE_PASSWORDS_TO_ANALYZE,
} from '@/lib/password-strength-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function PasswordStrengthPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [password, setPassword] = useState<string>(
    SAMPLE_PASSWORDS_TO_ANALYZE[0].password
  );
  const [showPassword, setShowPassword] = useState<boolean>(true);

  const analysis = useMemo(() => analyzePasswordStrength(password), [password]);

  const outputSummary = useMemo(() => {
    return [
      `Password Strength Analysis Report`,
      `=================================`,
      `Password: ${showPassword ? password : '********'}`,
      `Overall Score: ${analysis.score}/100 (${analysis.label})`,
      `Entropy Estimate: ~${analysis.entropyBits} bits`,
      `Estimated Crack Time: ${analysis.estimatedCrackTime}`,
      ``,
      `Composition:`,
      ` - Length: ${analysis.composition.length}`,
      ` - Uppercase: ${analysis.composition.uppercaseCount}`,
      ` - Lowercase: ${analysis.composition.lowercaseCount}`,
      ` - Numbers: ${analysis.composition.numberCount}`,
      ` - Symbols: ${analysis.composition.symbolCount}`,
      ` - Unique Chars: ${analysis.composition.uniqueCharCount}`,
      ``,
      `Detected Flaws (${analysis.flaws.length}):`,
      ...analysis.flaws.map((f) => ` [${f.severity.toUpperCase()}] ${f.title}: ${f.description}`),
      ``,
      `Recommendations:`,
      ...analysis.suggestions.map((s) => ` * ${s}`),
    ].join('\n');
  }, [analysis, password, showPassword]);

  const handleRunAudit = () => {
    addHistoryItem('Password Strength Analyzer', `Audited strength: ${analysis.label}`);
  };

  const getBadgeColor = (label: string) => {
    switch (label) {
      case 'Uncrackable':
      case 'Strong':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Moderate':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Weak':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <ToolPage
      title="Password Strength Analyzer & Entropy Auditor"
      description="Evaluate password cryptographic entropy, detect dictionary flaws, check character composition, and estimate offline GPU crack time locally"
      category="Security"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const sample = SAMPLE_PASSWORDS_TO_ANALYZE.find(
                  (s) => s.name === e.target.value
                );
                if (sample) setPassword(sample.password);
              }}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Sample Password...
              </option>
              {SAMPLE_PASSWORDS_TO_ANALYZE.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-bold text-foreground hover:bg-secondary/20 transition-colors"
            >
              {showPassword ? (
                <>
                  <EyeOff className="h-3.5 w-3.5" />
                  <span>Hide Password</span>
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  <span>Show Password</span>
                </>
              )}
            </button>
          </div>

          <ToolToolbar
            onRun={handleRunAudit}
            runLabel="Audit Strength"
            onLoadSample={() => {
              setPassword(SAMPLE_PASSWORDS_TO_ANALYZE[2].password);
            }}
            onClear={() => {
              setPassword('');
            }}
            onCopyOutput={() => copyOutput(outputSummary)}
            canCopy={Boolean(outputSummary)}
            onDownloadOutput={() =>
              downloadFile(outputSummary, `password-strength-audit.txt`)
            }
            canDownload={Boolean(outputSummary)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status={analysis.score >= 50 ? 'success' : 'error'}
          message={`${analysis.label} (${analysis.score}/100)`}
          detail={`Entropy: ~${analysis.entropyBits} bits`}
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* Password Input Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Password to Analyze (Evaluated 100% Offline in Browser)
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password or passphrase..."
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 font-mono text-sm text-foreground focus:outline-none"
            />
          </div>

          {/* Strength Score Card */}
          <div className="rounded-xl border border-border bg-background p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase">
                Overall Strength Rating
              </span>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${getBadgeColor(
                  analysis.label
                )}`}
              >
                {analysis.label}
              </span>
            </div>

            <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full transition-all duration-300 ${
                  analysis.score >= 70
                    ? 'bg-emerald-500'
                    : analysis.score >= 50
                      ? 'bg-blue-500'
                      : 'bg-rose-500'
                }`}
                style={{ width: `${Math.max(5, analysis.score)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Score: {analysis.score} / 100</span>
              <span>Entropy: {analysis.entropyBits} bits</span>
            </div>
          </div>

          {/* Character Composition Breakdown */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-foreground">
              Character Composition Breakdown
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { label: 'Length', value: analysis.composition.length },
                {
                  label: 'Uppercase',
                  value: analysis.composition.uppercaseCount,
                },
                {
                  label: 'Lowercase',
                  value: analysis.composition.lowercaseCount,
                },
                { label: 'Numbers', value: analysis.composition.numberCount },
                { label: 'Symbols', value: analysis.composition.symbolCount },
                {
                  label: 'Unique Chars',
                  value: analysis.composition.uniqueCharCount,
                },
              ].map((c) => (
                <div
                  key={c.label}
                  className="rounded-lg border border-border bg-background p-2 flex flex-col items-center"
                >
                  <span className="text-[10px] uppercase text-muted-foreground">
                    {c.label}
                  </span>
                  <span className="font-mono font-bold text-foreground text-sm">
                    {c.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Crack Time Box */}
          <div className="rounded-xl border border-border bg-card p-3 flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">
                Estimated Crack Time (100 Billion Guesses / sec)
              </span>
              <span className="text-xs font-bold text-foreground">
                {analysis.estimatedCrackTime}
              </span>
            </div>
          </div>
        </div>
      }
      outputPanel={
        <div className="flex h-full flex-col space-y-4 overflow-y-auto">
          {/* Detected Flaws */}
          <div className="rounded-xl border border-border bg-card/60 p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span>Detected Vulnerabilities & Flaws ({analysis.flaws.length})</span>
            </div>

            {analysis.flaws.length === 0 ? (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-xs text-emerald-400 font-semibold">
                <ShieldCheck className="h-4 w-4" />
                <span>No obvious dictionary patterns or flaws detected.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {analysis.flaws.map((f) => (
                  <div
                    key={f.id}
                    className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                      <span>{f.title}</span>
                      <span className="uppercase text-[10px]">{f.severity}</span>
                    </div>
                    <p className="text-xs text-amber-200/80">{f.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actionable Recommendations */}
          <div className="rounded-xl border border-border bg-card/60 p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Lightbulb className="h-4 w-4 text-primary" />
              <span>Security Recommendations ({analysis.suggestions.length})</span>
            </div>

            <div className="space-y-1.5">
              {analysis.suggestions.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 rounded-lg border border-border bg-background p-2.5 text-xs text-foreground"
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden">
            <OutputPanel
              title="Audit Text Report"
              value={outputSummary}
              language="text"
            />
          </div>
        </div>
      }
    />
  );
}
