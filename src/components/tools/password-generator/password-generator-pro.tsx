'use client';

import { useState, useMemo } from 'react';
import {
  KeyRound,
  ShieldCheck,
  Copy,
  RefreshCw,
  Check,
  Sliders,
} from 'lucide-react';
import {
  generatePasswordBatch,
  type PasswordGeneratorOptions,
} from '@/lib/password-generator-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function PasswordGeneratorPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [mode, setMode] = useState<'random' | 'passphrase'>('random');
  const [length, setLength] = useState<number>(16);
  const [passphraseWords, setPassphraseWords] = useState<number>(4);
  const [passphraseSeparator, setPassphraseSeparator] = useState<string>('-');
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false);
  const [count, setCount] = useState<number>(5);
  const [seed, setSeed] = useState<number>(1);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const options: PasswordGeneratorOptions = useMemo(
    () => ({
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
      excludeAmbiguous,
      count,
      mode,
      passphraseWords,
      passphraseSeparator,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
      excludeAmbiguous,
      count,
      mode,
      passphraseWords,
      passphraseSeparator,
      seed,
    ]
  );

  const generatedList = useMemo(
    () => generatePasswordBatch(options),
    [options]
  );

  const outputText = useMemo(
    () => generatedList.map((g) => g.password).join('\n'),
    [generatedList]
  );

  const primaryResult = generatedList[0] || {
    password: '',
    entropyBits: 0,
    strengthLabel: 'Very Weak',
  };

  const handleRegenerate = () => {
    setSeed((prev) => prev + 1);
    addHistoryItem('Password Generator', `Generated ${count} password(s)`);
  };

  const handleCopyItem = (pwd: string, idx: number) => {
    copyOutput(pwd);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <ToolPage
      title="Password & Passphrase Generator Pro"
      description="Generate cryptographically secure random passwords and word passphrases locally with entropy bits calculation and crack resistance scoring"
      category="Security"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <div className="flex items-center gap-1.5">
              {[
                { id: 'random', label: 'Random Characters' },
                { id: 'passphrase', label: 'Word Passphrase' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id as 'random' | 'passphrase')}
                  className={`rounded px-3 py-1 text-xs font-bold transition-colors ${
                    mode === m.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleRegenerate}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Generate New</span>
            </button>
          </div>

          <ToolToolbar
            onRun={handleRegenerate}
            runLabel="Generate Passwords"
            onLoadSample={() => {
              setMode('random');
              setLength(24);
              setIncludeSymbols(true);
            }}
            onClear={() => {
              setCount(1);
            }}
            onCopyOutput={() => copyOutput(outputText)}
            canCopy={Boolean(outputText)}
            onDownloadOutput={() =>
              downloadFile(outputText, `devforge-passwords.txt`)
            }
            canDownload={Boolean(outputText)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status="success"
          message={`Strength: ${primaryResult.strengthLabel}`}
          detail={`Entropy: ~${primaryResult.entropyBits} bits`}
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground border-b border-border pb-2">
            <Sliders className="h-4 w-4 text-primary" />
            <span className="uppercase">Generation Settings</span>
          </div>

          {mode === 'random' ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <span>Password Length</span>
                  <span className="font-mono text-primary font-bold">
                    {length} characters
                  </span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={64}
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  {
                    label: 'Uppercase (A-Z)',
                    checked: includeUppercase,
                    setter: setIncludeUppercase,
                  },
                  {
                    label: 'Lowercase (a-z)',
                    checked: includeLowercase,
                    setter: setIncludeLowercase,
                  },
                  {
                    label: 'Numbers (0-9)',
                    checked: includeNumbers,
                    setter: setIncludeNumbers,
                  },
                  {
                    label: 'Symbols (!@#$%)',
                    checked: includeSymbols,
                    setter: setIncludeSymbols,
                  },
                  {
                    label: 'Exclude Ambiguous (0, O, l, 1)',
                    checked: excludeAmbiguous,
                    setter: setExcludeAmbiguous,
                  },
                ].map((opt) => (
                  <label
                    key={opt.label}
                    className="flex items-center gap-2 rounded-lg border border-border bg-background p-2.5 text-xs font-semibold text-foreground cursor-pointer hover:bg-secondary/20 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={opt.checked}
                      onChange={(e) => opt.setter(e.target.checked)}
                      className="rounded accent-primary"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <span>Number of Words</span>
                  <span className="font-mono text-primary font-bold">
                    {passphraseWords} words
                  </span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={8}
                  value={passphraseWords}
                  onChange={(e) => setPassphraseWords(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Word Separator
                </label>
                <div className="flex items-center gap-2">
                  {['-', '.', '_', ' '].map((sep) => (
                    <button
                      key={sep}
                      type="button"
                      onClick={() => setPassphraseSeparator(sep)}
                      className={`rounded px-3 py-1 font-mono text-xs font-bold border transition-colors ${
                        passphraseSeparator === sep
                          ? 'border-primary bg-primary/20 text-primary'
                          : 'border-border bg-background text-foreground'
                      }`}
                    >
                      {sep === ' ' ? 'Space' : sep}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Batch Generation Count</span>
              <span className="font-mono text-primary font-bold">
                {count} passwords
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 5, 10].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCount(c)}
                  className={`rounded px-3 py-1 text-xs font-bold border transition-colors ${
                    count === c
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-foreground hover:bg-secondary/20'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Entropy & Crack Resistance</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded bg-card p-2 border border-border">
                <span className="text-muted-foreground block text-[10px] uppercase">
                  Entropy Bits
                </span>
                <span className="font-mono font-bold text-foreground">
                  {primaryResult.entropyBits} bits
                </span>
              </div>
              <div className="rounded bg-card p-2 border border-border">
                <span className="text-muted-foreground block text-[10px] uppercase">
                  Resistance Category
                </span>
                <span className="font-bold text-primary">
                  {primaryResult.strengthLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      }
      outputPanel={
        <div className="flex h-full flex-col space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-foreground">
            <div className="flex items-center gap-1.5">
              <KeyRound className="h-4 w-4 text-primary" />
              <span>Generated Passwords ({generatedList.length})</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {generatedList.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 hover:border-primary/40 transition-colors"
              >
                <div className="flex flex-col overflow-hidden">
                  <span className="font-mono text-sm font-bold text-foreground truncate select-all">
                    {item.password}
                  </span>
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    Entropy: {item.entropyBits} bits • {item.strengthLabel}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyItem(item.password, idx)}
                  className="flex shrink-0 items-center gap-1 rounded bg-secondary/30 px-2.5 py-1 text-xs font-bold text-foreground hover:bg-primary/20 hover:text-primary transition-colors"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-primary" />
                      <span className="text-primary">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="hidden">
            <OutputPanel
              title="Raw Output"
              value={outputText}
              language="text"
            />
          </div>
        </div>
      }
    />
  );
}
