'use client';

import { Check, X, Sparkles } from 'lucide-react';

export function ComparisonSection() {
  const COMPARISONS = [
    {
      feature: 'Execution Architecture',
      traditional: 'Remote Server / Cloud API calls',
      devforge: '100% Client-Side Local WASM',
    },
    {
      feature: 'Data Privacy & Secrets',
      traditional: 'Logged on third-party servers',
      devforge: 'Strictly sandboxed inside browser',
    },
    {
      feature: 'Average Processing Latency',
      traditional: '300ms — 1,500ms roundtrip',
      devforge: '0.2ms — 1.5ms instant execution',
    },
    {
      feature: 'Offline Capability',
      traditional: 'Requires active internet connection',
      devforge: 'Works 100% offline & air-gapped',
    },
    {
      feature: 'Pop-Up Ads & Tracking',
      traditional: 'Banner ads, cookies & analytics',
      devforge: 'Zero ads, zero telemetry',
    },
  ];

  return (
    <section className="relative w-full select-none">
      <div className="w-full space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 terminal-badge">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>// BENCHMARK_COMPARISON</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-[36px] font-black tracking-tight text-foreground uppercase leading-tight">
            Why Engineering Teams <br /> Switch to DevForge.
          </h2>
          <p className="text-base sm:text-[16px] text-cyan-200/80 font-sans leading-relaxed">
            See how DevForge compares against traditional ad-supported online utility websites.
          </p>
        </div>

        {/* Luxury Comparison Card */}
        <div className="rounded-3xl border-2 border-cyan-500/40 bg-[#0c091f]/90 p-6 sm:p-10 shadow-[0_0_35px_rgba(0,240,255,0.2)] backdrop-blur-2xl">
          <div className="grid grid-cols-12 border-b border-white/[0.08] pb-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-muted-foreground">
            <div className="col-span-4">Metric / Capability</div>
            <div className="col-span-4 text-center">Traditional Websites</div>
            <div className="col-span-4 text-center text-primary">DevForge Workspace</div>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {COMPARISONS.map((row) => (
              <div
                key={row.feature}
                className="grid grid-cols-12 items-center py-5 text-xs sm:text-sm"
              >
                <div className="col-span-4 font-bold text-foreground">
                  {row.feature}
                </div>
                <div className="col-span-4 flex items-center justify-center gap-2 text-center text-muted-foreground font-medium">
                  <X className="h-4 w-4 text-rose-400 shrink-0" />
                  <span>{row.traditional}</span>
                </div>
                <div className="col-span-4 flex items-center justify-center gap-2 text-center font-bold text-emerald-400">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{row.devforge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
