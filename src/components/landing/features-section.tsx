'use client';

import {
  Cpu,
  Shield,
  Layers,
  Sparkles,
  Command,
  Lock,
} from 'lucide-react';

export function FeaturesSection() {
  return (
    <section id="features" className="relative w-full select-none">
      <div className="w-full space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 terminal-badge">
            <Sparkles className="h-3.5 w-3.5 text-fuchsia-400 animate-pulse" />
            <span>// ARCHITECTURAL_SPECIFICATIONS</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-[36px] font-black uppercase tracking-tight text-foreground leading-tight">
            ENGINEERED LIKE A <span className="glow-cyan-text">RETRO COMPUTER</span>. <br />
            POWERED BY MODERN WEBASSEMBLY.
          </h2>
          <p className="text-base sm:text-[16px] text-cyan-200/80 font-sans leading-relaxed">
            We discarded generic cloud templates and rebuilt the entire developer experience into an air-gapped, high-speed, local workstation OS.
          </p>
        </div>

        {/* Cyberpunk Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
          {/* Bento Card 1 - Large Feature */}
          <div className="md:col-span-2 neo-card p-8 md:p-10 space-y-6 flex flex-col justify-between border-cyan-500/30">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                <Cpu className="h-6 w-6" />
              </div>
              <span className="rounded-full border border-lime-500/40 bg-lime-500/15 px-3 py-1 text-xs font-mono font-extrabold text-lime-400 shadow-[0_0_10px_rgba(57,255,20,0.2)]">
                0.14ms WASM LATENCY
              </span>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-heading font-black text-white uppercase tracking-tight">
                Client-Side WebAssembly Bare-Metal Engine
              </h3>
              <p className="text-sm text-cyan-200/80 leading-relaxed max-w-xl font-mono">
                Format 25MB JSON dumps, compile multi-threaded regular expressions, and execute cryptographic Argon2/SHA hashes inside local memory buffers without sending a single byte across the internet.
              </p>
            </div>
            <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[11px] text-cyan-400/60">
              <span>// ARCH: WASM_64</span>
              <span>// THREADS: MULTI_CORE</span>
            </div>
          </div>

          {/* Bento Card 2 */}
          <div className="neo-card p-8 space-y-6 flex flex-col justify-between border-fuchsia-500/30">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/40 shadow-[0_0_15px_rgba(255,0,127,0.3)]">
                <Shield className="h-6 w-6" />
              </div>
              <Lock className="h-4 w-4 text-fuchsia-400" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-heading font-black text-white uppercase tracking-tight">
                Air-Gapped Privacy Sandbox
              </h3>
              <p className="text-xs text-cyan-200/80 leading-relaxed font-mono">
                Your API bearer tokens, JWT private keys, database connection URIs, and SSL certificates never touch our servers.
              </p>
            </div>
            <div className="pt-2 border-t border-fuchsia-500/20 text-[11px] text-fuchsia-400/80 font-bold">
              <span>// PROTOCOL: ZERO_TELEMETRY</span>
            </div>
          </div>

          {/* Bento Card 3 */}
          <div className="neo-card p-8 space-y-6 flex flex-col justify-between border-lime-500/30">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-500/15 text-lime-400 border border-lime-500/40 shadow-[0_0_15px_rgba(57,255,20,0.3)]">
                <Command className="h-6 w-6" />
              </div>
              <kbd className="text-[10px] bg-lime-500/20 border border-lime-500/40 text-lime-400 px-2 py-0.5 rounded font-extrabold">
                ⌘K
              </kbd>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-heading font-black text-white uppercase tracking-tight">
                Terminal Command Deck
              </h3>
              <p className="text-xs text-cyan-200/80 leading-relaxed font-mono">
                Press Ctrl+K or ⌘+K anywhere to summon the spotlight terminal prompt. Launch tools, copy history, and switch themes instantly.
              </p>
            </div>
            <div className="pt-2 border-t border-lime-500/20 text-[11px] text-lime-400/80 font-bold">
              <span>// EXEC: <span className="text-fuchsia-400">{'>'}</span> search --instant</span>
            </div>
          </div>

          {/* Bento Card 4 - Large Feature */}
          <div className="md:col-span-2 neo-card p-8 md:p-10 space-y-6 flex flex-col justify-between border-cyan-500/30">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400 border border-violet-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <Layers className="h-6 w-6" />
              </div>
              <span className="rounded-full border border-cyan-500/40 bg-cyan-500/15 px-3 py-1 text-xs font-mono font-extrabold text-cyan-300">
                MULTI-DOCK IDE
              </span>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-heading font-black text-white uppercase tracking-tight">
                Split-View Multi-Panel Workstation
              </h3>
              <p className="text-sm text-cyan-200/80 leading-relaxed max-w-xl font-mono">
                Run multiple tools side-by-side in resizable docking panels. Inspect JWT tokens while compiling regex patterns and formatting SQL queries simultaneously without losing context.
              </p>
            </div>
            <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[11px] text-cyan-400/60">
              <span>// PANELS: SPLIT / SINGLE</span>
              <span>// STORAGE: INDEXED_DB_VAULT</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
