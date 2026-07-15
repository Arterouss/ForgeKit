'use client';

import { Terminal, Shield, Braces, Layers } from 'lucide-react';

const TABS = [
  { label: 'JSON_Formatter.wasm', icon: Braces, active: true },
  { label: 'JWT_Security_Core.wasm', icon: Shield, active: false },
  { label: 'Regex_Compiler.re', icon: Terminal, active: false },
];

export function WorkspacePreview() {
  return (
    <section id="workspace-ide" className="relative w-full select-none font-mono">
      <div className="w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 terminal-badge">
            <Layers className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>// MULTI_PANEL_DOCKING_SYSTEM</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-[36px] font-black uppercase tracking-tight text-foreground leading-tight">
            SPLIT-VIEW <span className="glow-cyan-text">DESKTOP IDE</span>. <br />
            ZERO CLOUD DOWNLOAD REQUIRED.
          </h2>
          <p className="text-base sm:text-[16px] text-cyan-200/80 font-sans leading-relaxed">
            Keep your tool sessions organized across persistent tabs. Split panels horizontally or vertically, compare live data streams, and retain state across restarts inside your IndexedDB vault.
          </p>
        </div>

        {/* Retro Workstation OS Window Mockup */}
        <div className="rounded-3xl border-2 border-cyan-500/40 bg-[#070512]/95 shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-hidden">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-cyan-500/30 bg-[#0c091f] px-5 py-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-fuchsia-500/80 border border-fuchsia-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/80 border border-yellow-300" />
                <span className="h-3 w-3 rounded-full bg-lime-400/80 border border-lime-300" />
              </div>
              <span className="text-cyan-300 font-extrabold tracking-wider hidden sm:inline">
                DEVFORGE_MULTI_SPLIT_WORKSTATION // WINDOW_ID: #001
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <div
                    key={tab.label}
                    className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                      tab.active
                        ? 'border border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                        : 'text-muted-foreground hover:bg-cyan-500/10 hover:text-cyan-200'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="rounded bg-lime-500/15 border border-lime-500/40 px-2.5 py-0.5 text-[10px] font-extrabold text-lime-400">
                WASM WORKERS: 4 ONLINE
              </span>
            </div>
          </div>

          {/* IDE Body */}
          <div className="grid grid-cols-12 divide-x divide-cyan-500/20 min-h-[380px] text-xs">
            {/* Sidebar Explorer */}
            <div className="col-span-3 hidden md:flex flex-col justify-between p-5 bg-[#080614]">
              <div className="space-y-4">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5 border-l-2 border-cyan-400 pl-2">
                  <span>// ACTIVE_SESSIONS</span>
                </div>
                <div className="space-y-1.5 text-xs font-bold">
                  {[
                    'Staging_JWT_Token.jwt',
                    'Postgres_Query_Plan.sql',
                    'API_Webhook_Payload.json',
                    'Nginx_Proxy_Router.conf',
                  ].map((s, idx) => (
                    <div
                      key={s}
                      className={`rounded-xl px-3 py-2.5 transition-all ${
                        idx === 0
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                          : 'text-muted-foreground hover:bg-cyan-500/10 hover:text-cyan-200'
                      }`}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-cyan-500/30 bg-[#0c091f] p-3 text-[11px] text-cyan-300">
                <span>MEM_POOL: 14.2 MB // ZERO_LEAK</span>
              </div>
            </div>

            {/* Split Code View */}
            <div className="col-span-12 md:col-span-9 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-cyan-500/20">
              <div className="p-6 space-y-4 bg-[#070512]">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-400 border-b border-cyan-500/20 pb-2">
                  <span><span className="text-fuchsia-400">{'>'}</span> INPUT_STREAM_BUFFER</span>
                  <span className="text-cyan-300">218 BYTES</span>
                </div>
                <pre className="font-mono text-xs sm:text-sm text-cyan-100 leading-relaxed">
                  {`{\n  "service": "DevForge Cyber Gateway",\n  "status": "HEALTHY",\n  "uptime_seconds": 86400,\n  "memory_rss": "14.2MB",\n  "wasm_modules": ["json_ast", "jwt_crypto"]\n}`}
                </pre>
              </div>

              <div className="p-6 space-y-4 bg-[#090718]">
                <div className="flex items-center justify-between text-xs font-bold text-lime-400 border-b border-cyan-500/20 pb-2">
                  <span><span className="text-fuchsia-400">{'>'}</span> OUTPUT_AST_INSPECTOR</span>
                  <span>VALID JSON // 0.14ms</span>
                </div>
                <pre className="font-mono text-xs sm:text-sm text-lime-300 leading-relaxed">
                  {`[✓] Schema Validation: PASSED\n[✓] AST Syntax Check: OK\n[✓] Encoding: UTF-8\n\nObject Keys Found: 5\nDepth Level: 1\nZero memory allocation errors.`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
