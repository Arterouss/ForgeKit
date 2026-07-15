'use client';

import { Github, Terminal, ArrowRight } from 'lucide-react';

export function OpenSourceSection() {
  return (
    <section id="opensource" className="relative w-full select-none font-mono">
      <div className="w-full">
        <div className="relative rounded-3xl border-2 border-cyan-500/40 bg-gradient-to-br from-[#0c091f] via-[#070512] to-[#140c28] p-10 sm:p-16 text-center shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-hidden space-y-8">
          {/* Ambient glow */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 terminal-badge">
              <Terminal className="h-3.5 w-3.5 text-fuchsia-400 animate-pulse" />
              <span>// 100% OPEN_SOURCE_ARCHIVE</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-[36px] font-black uppercase tracking-tight text-foreground leading-tight">
              BUILT IN <span className="glow-cyan-text">PUBLIC</span>. <br />
              AUDIT EVERY WASM MODULE.
            </h2>
            <p className="text-base sm:text-[16px] text-cyan-200/80 leading-relaxed font-sans">
              DevForge is 100% open-source under an MIT-compatible license. Host it inside your own air-gapped enterprise cluster or inspect how our local WebAssembly modules process data without telemetry.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-4">
            <a
              href="https://github.com/Arterouss/ForgeKit"
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn px-8 py-4 text-sm flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,240,255,0.5)]"
            >
              <Github className="h-5 w-5" />
              <span>INSPECT CODEBASE ON GITHUB</span>
              <ArrowRight className="h-5 w-5 stroke-[3]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
