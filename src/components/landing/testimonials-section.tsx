'use client';

import { Star, Terminal } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote:
      'DevForge completely replaced our fragmented collection of web utilities. Having 60+ tools run locally in WebAssembly with zero latency and zero telemetry is incredible.',
    author: 'Alex Rivera',
    role: 'STAFF INFRASTRUCTURE ENGINEER',
    company: 'CLOUDSCALE SYSTEMS',
  },
  {
    quote:
      'The air-gapped privacy guarantee is why our enterprise security team approved DevForge instantly. We inspect production JWT payloads and certificates locally without leaks.',
    author: 'Sarah Chen',
    role: 'PRINCIPAL SECURITY ARCHITECT',
    company: 'CYBER FINTECH LABS',
  },
  {
    quote:
      'The Retro-Futuristic Cyber-Deck layout, Spotlight search (Ctrl+K), and split-view docking panels make it feel faster and more powerful than any native desktop OS.',
    author: 'Marcus Vance',
    role: 'SENIOR SYSTEMS ARCHITECT',
    company: 'VOXEL NETWORKS',
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative w-full select-none font-mono">
      <div className="w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 terminal-badge">
            <Terminal className="h-3.5 w-3.5 text-lime-400 animate-pulse" />
            <span>// ENGINEER_LOGS & TESTIMONIALS</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-[36px] font-black uppercase tracking-tight text-foreground leading-tight">
            LOVED BY <span className="glow-cyan-text">ENGINEERING LEADERS</span>. <br />
            TRUSTED BY SECURITY TEAMS.
          </h2>
          <p className="text-base sm:text-[16px] text-cyan-200/80 font-sans leading-relaxed">
            See why senior engineers and architects have abandoned cloud dashboards for the DevForge Cyber-Deck.
          </p>
        </div>

        {/* Synthwave Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={t.author}
              className="flex flex-col justify-between neo-card p-6 border-cyan-500/30 space-y-6 h-full"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 text-[11px] text-cyan-400 font-bold">
                  <span>// LOG_ENTRY_0{idx + 1}</span>
                  <div className="flex items-center gap-1 text-lime-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-lime-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-mono text-cyan-100/90 leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="border-t border-cyan-500/20 pt-4">
                <div className="font-heading font-black text-white text-base tracking-wide">
                  {t.author}
                </div>
                <div className="text-[11px] font-mono text-cyan-400">
                  {t.role} // <span className="text-lime-400 font-bold">{t.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
