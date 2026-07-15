'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Terminal,
  Zap,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Code2,
  Sparkles,
  Github,
  CheckCircle2,
} from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative w-full pt-6 pb-20 sm:pb-32 flex flex-col items-center justify-center text-center px-4 overflow-hidden select-none">
      {/* Top Cyber Navigation Strip */}
      <header className="w-full mx-auto mb-16 flex items-center justify-between py-4 px-6 rounded-2xl border border-cyan-500/30 bg-[#070512]/90 backdrop-blur-xl shadow-[0_0_25px_rgba(0,240,255,0.15)]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-lime-400 font-mono font-extrabold text-[#070512] text-sm shadow-[0_0_15px_rgba(0,240,255,0.5)]">
            DF
          </div>
          <div className="flex flex-col text-left font-mono">
            <span className="text-sm font-extrabold text-cyan-300 tracking-wider">DEVFORGE_OS</span>
            <span className="text-[10px] text-lime-400 font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-ping" />
              v3.5 // WASM_ISOLATED
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 font-mono text-xs font-bold text-cyan-400/80">
          <Link href="#workspace" className="hover:text-cyan-300 transition-colors">
            // WORKSPACE
          </Link>
          <Link href="#features" className="hover:text-cyan-300 transition-colors">
            // CYBER_TOOLS
          </Link>
          <Link href="#ecosystem" className="hover:text-cyan-300 transition-colors">
            // PLUGINS
          </Link>
          <Link href="#faq" className="hover:text-cyan-300 transition-colors">
            // FAQ
          </Link>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <a
            href="https://github.com/Arterouss/ForgeKit"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-[#0c091f] px-3.5 py-2 text-xs font-bold text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/20 transition-all"
          >
            <Github className="h-4 w-4 text-fuchsia-400" />
            <span>REPO</span>
          </a>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-lime-400 px-4 py-2 text-xs font-extrabold text-[#070512] shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(255,0,127,0.6)] hover:scale-105 transition-all"
          >
            <span>LAUNCH DECK</span>
            <ArrowRight className="h-4 w-4 stroke-[3]" />
          </Link>
        </div>
      </header>

      {/* Main Hero Content */}
      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Terminal Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-3 terminal-badge px-4 py-1.5 rounded-full"
        >
          <Terminal className="h-4 w-4 text-fuchsia-400 animate-pulse" />
          <span>SYS_STATUS: ONLINE</span>
          <span className="text-white/30">|</span>
          <span className="text-lime-400">CLIENT_WASM_SANDBOX</span>
        </motion.div>

        {/* Huge Awe-Inspiring Retro-Futuristic Headline - Display Title 56px */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-heading text-4xl sm:text-5xl md:text-[56px] font-black tracking-tight text-foreground leading-[1.08] uppercase"
        >
          THE RETRO-FUTURISTIC <br />
          <span className="glow-cyan-text drop-shadow-[0_0_35px_rgba(0,240,255,0.4)]">
            ENGINEERING CYBER-DECK
          </span>
        </motion.h1>

        {/* Supporting Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto text-base sm:text-[16px] font-medium text-cyan-100/80 leading-relaxed font-sans"
        >
          Forget generic web dashboards and slow cloud servers. Experience <strong className="text-cyan-300 font-extrabold">60+ specialized developer tools</strong> executing at bare-metal speeds inside a multi-layered local WebAssembly workstation.
        </motion.p>

        {/* Primary Action Buttons (12px button spacing) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 font-mono"
        >
          <Link
            href="/dashboard"
            className="w-full sm:w-auto neo-btn px-8 py-4 text-sm flex items-center justify-center gap-3 shadow-[0_0_35px_rgba(0,240,255,0.5)]"
          >
            <Zap className="h-5 w-5 fill-current" />
            <span>LAUNCH CYBER DECK</span>
            <span className="rounded bg-[#070512]/30 px-2 py-0.5 text-xs text-[#070512] border border-[#070512]/30">
              ⌘K
            </span>
          </Link>

          <Link
            href="/dashboard/tools/json-formatter"
            className="w-full sm:w-auto neo-card px-8 py-4 text-sm font-bold text-cyan-300 hover:text-white flex items-center justify-center gap-3 border border-cyan-500/40 hover:border-cyan-400"
          >
            <Code2 className="h-5 w-5 text-fuchsia-400" />
            <span>OPEN TOOL ARCHIVE</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Key Architectural Pillars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto font-mono text-xs"
        >
          <div className="flex items-center justify-center gap-2.5 rounded-xl border border-cyan-500/20 bg-[#0c091f]/80 px-4 py-3 text-cyan-300">
            <ShieldCheck className="h-4 w-4 text-lime-400 shrink-0" />
            <span>100% OFFLINE CAPABLE</span>
          </div>
          <div className="flex items-center justify-center gap-2.5 rounded-xl border border-cyan-500/20 bg-[#0c091f]/80 px-4 py-3 text-cyan-300">
            <Cpu className="h-4 w-4 text-fuchsia-400 shrink-0" />
            <span>0.4MS WASM LATENCY</span>
          </div>
          <div className="flex items-center justify-center gap-2.5 rounded-xl border border-cyan-500/20 bg-[#0c091f]/80 px-4 py-3 text-cyan-300">
            <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
            <span>NO TELEMETRY / NO LOGS</span>
          </div>
        </motion.div>
      </div>

      {/* Floating Isometric/Glass Status HUD Badges around Hero */}
      <div className="hidden xl:block pointer-events-none absolute inset-0 w-full mx-auto overflow-hidden">
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-44 left-4 cyber-glass p-4 rounded-2xl border border-cyan-500/40 text-left font-mono text-xs max-w-xs shadow-[0_0_20px_rgba(0,240,255,0.2)] pointer-events-auto"
        >
          <div className="flex items-center justify-between gap-3 text-cyan-400 font-extrabold border-b border-cyan-500/20 pb-2 mb-2">
            <span>// WASM_WORKER_01</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-lime-400" />
          </div>
          <p className="text-cyan-200/90 text-[11px]">JSON AST Parser compiled in 0.18ms. Memory buffer safe.</p>
        </motion.div>

        <motion.div
          animate={{ y: [0, 14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-60 right-6 cyber-glass p-4 rounded-2xl border border-fuchsia-500/40 text-left font-mono text-xs max-w-xs shadow-[0_0_20px_rgba(255,0,127,0.2)] pointer-events-auto"
        >
          <div className="flex items-center justify-between gap-3 text-fuchsia-400 font-extrabold border-b border-fuchsia-500/20 pb-2 mb-2">
            <span>// CRYPTO_SANDBOX</span>
            <span className="text-[10px] bg-lime-400/20 text-lime-400 px-1.5 py-0.5 rounded">VERIFIED</span>
          </div>
          <p className="text-cyan-200/90 text-[11px]">Argon2 / SHA-256 local execution. Zero network sockets open.</p>
        </motion.div>
      </div>
    </section>
  );
}
