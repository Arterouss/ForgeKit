'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Wrench, Layers, ShieldCheck, Cpu, Terminal } from 'lucide-react';
import type { ReactNode } from 'react';

interface StatProps {
  icon: ReactNode;
  value: number;
  suffix?: string;
  label: string;
  status: string;
}

function AnimatedCounter({ icon, value, suffix = '', label, status }: StatProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `${Math.round(v)}${suffix}`);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate(count, value, { duration: 2, ease: 'easeOut' });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [count, value]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-between gap-4 neo-card p-6 text-center border-cyan-500/30 font-mono h-full"
    >
      <div className="flex items-center justify-between w-full border-b border-cyan-500/20 pb-2 text-[10px] text-cyan-400/80 font-bold">
        <span>// {status}</span>
        <span className="h-2 w-2 rounded-full bg-lime-400 shadow-[0_0_6px_#39ff14]" />
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/40 bg-cyan-500/15 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
        {icon}
      </div>
      <motion.span className="font-heading text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
        {rounded}
      </motion.span>
      <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">{label}</span>
    </div>
  );
}

export function StatsSection() {
  return (
    <section id="stats" className="relative w-full select-none font-mono">
      <div className="w-full space-y-8">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 terminal-badge">
            <Terminal className="h-3.5 w-3.5 text-lime-400 animate-pulse" />
            <span>// LIVE_SYSTEM_TELEMETRY</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-[36px] font-black uppercase tracking-tight text-foreground leading-tight">
            REAL-TIME <span className="glow-cyan-text">ENGINEERING TELEMETRY</span>
          </h2>
          <p className="text-base sm:text-[16px] text-cyan-200/80 font-sans leading-relaxed">
            Performance benchmarks and system metrics measured directly from local client-side WebAssembly execution.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5"
        >
          <AnimatedCounter
            icon={<Wrench className="h-6 w-6" />}
            value={60}
            suffix="+"
            label="SPECIALIZED WASM TOOLS"
            status="MOD_COUNT"
          />
          <AnimatedCounter
            icon={<Layers className="h-6 w-6 text-fuchsia-400" />}
            value={11}
            label="DOMAINS & CATEGORIES"
            status="SYS_DOMAINS"
          />
          <AnimatedCounter
            icon={<ShieldCheck className="h-6 w-6 text-lime-400" />}
            value={100}
            suffix="%"
            label="AIR-GAPPED & LOCAL"
            status="SEC_SANDBOX"
          />
          <AnimatedCounter
            icon={<Cpu className="h-6 w-6 text-cyan-400" />}
            value={0}
            suffix="ms"
            label="SERVER ROUND-TRIP TIME"
            status="NET_LATENCY"
          />
          <AnimatedCounter
            icon={<Terminal className="h-6 w-6 text-yellow-400" />}
            value={100}
            suffix="%"
            label="OPEN SOURCE ARCHIVE"
            status="CODE_BASE"
          />
        </motion.div>
      </div>
    </section>
  );
}
