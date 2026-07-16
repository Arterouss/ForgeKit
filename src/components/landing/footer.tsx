'use client';

import { Github, Twitter, MessageSquare, ExternalLink, ShieldCheck, Cpu, Terminal, Heart } from 'lucide-react';
import Link from 'next/link';

const footerLinks = [
  {
    title: 'Product & Tools',
    links: [
      { label: 'Workstation Dashboard', href: '/dashboard' },
      { label: 'All 60+ Developer Tools', href: '/dashboard' },
      { label: 'JSON AST Formatter Pro', href: '/dashboard/tools/json-formatter' },
      { label: 'JWT Security Inspector', href: '/dashboard/tools/jwt-decoder' },
      { label: 'Regex Studio & Compiler', href: '/dashboard/tools/regex-tester' },
      { label: 'Plugin Marketplace', href: '/dashboard/marketplace' },
    ],
  },
  {
    title: 'Community & Ecosystem',
    links: [
      { label: 'GitHub Repository', href: 'https://github.com/Arterouss/ForgeKit', external: true },
      { label: 'Creator (@Arterouss)', href: 'https://github.com/Arterouss', external: true },
      { label: 'Discord Server', href: '/dashboard/discord' },
      { label: 'Report Issue / Bug', href: 'https://github.com/Arterouss/ForgeKit/issues', external: true },
      { label: 'Feature Request Hub', href: '/dashboard/feedback' },
    ],
  },
  {
    title: 'Resources & Architecture',
    links: [
      { label: 'Documentation & FAQ', href: '/dashboard/docs' },
      { label: 'Tool SDK & Extension Engine', href: '/dashboard/docs' },
      { label: 'WASM Air-Gapped Specs', href: '#features' },
      { label: 'Product Roadmap', href: '/dashboard/roadmap' },
      { label: 'Contributing Guide', href: 'https://github.com/Arterouss/ForgeKit/blob/main/CONTRIBUTING.md', external: true },
    ],
  },
  {
    title: 'Legal & Security',
    links: [
      { label: 'Privacy Policy (Air-Gapped)', href: '/dashboard/docs' },
      { label: 'Terms of Service', href: '/dashboard/docs' },
      { label: 'Security & Audit Logs', href: '/dashboard/marketplace' },
      { label: 'MIT Open License', href: 'https://github.com/Arterouss/ForgeKit/blob/main/LICENSE', external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-cyan-500/30 bg-[#070512] px-4 py-20 text-foreground select-none overflow-hidden font-sans">
      {/* Subtle ambient glow behind footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-full max-w-7xl bg-gradient-to-b from-cyan-500/5 via-fuchsia-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-6xl space-y-16">
        {/* Top Section: Brand + Links Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-6">
          {/* Brand Info & Attribution Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-lime-400 text-[#070512] font-black text-base shadow-[0_0_20px_rgba(0,240,255,0.4)] group-hover:scale-105 transition-transform">
                ⚒️
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-black tracking-tight text-white uppercase flex items-center gap-1.5">
                  Forge<span className="text-cyan-400">Kit</span>
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400/80">
                  DEVFORGE PLATFORM v3.5
                </span>
              </div>
            </Link>

            <p className="max-w-sm text-xs sm:text-sm text-cyan-200/70 leading-relaxed font-normal">
              The ultimate professional developer workstation built on client-side WebAssembly. All 60+ tools execute offline right inside your browser with zero latency and 100% air-gapped data privacy.
            </p>

            {/* Creator Badge Box */}
            <div className="rounded-2xl border border-cyan-500/30 bg-[#0c091f]/90 p-4 space-y-3 max-w-sm shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase text-fuchsia-400">
                  // LEAD ARCHITECT & CREATOR
                </span>
                <span className="flex h-2 w-2 rounded-full bg-lime-400 animate-ping" />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">Bayu Arterouss</span>
                  <span className="text-xs font-mono text-cyan-300/80">@Arterouss</span>
                </div>
                <a
                  href="https://github.com/Arterouss"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/50 bg-cyan-500/20 px-3.5 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 hover:text-white transition shadow-sm font-mono"
                >
                  <span>Profile</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Social Action Buttons */}
            <div className="flex items-center gap-3 pt-1 font-mono">
              <a
                href="https://github.com/Arterouss/ForgeKit"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-[#0c091f] text-cyan-400 hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-white transition shadow-sm"
                aria-label="ForgeKit GitHub Repository"
                title="ForgeKit GitHub Repository"
              >
                <Github className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-[#0c091f] text-cyan-400 hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-white transition shadow-sm"
                aria-label="Twitter / X"
                title="Twitter / X"
              >
                <Twitter className="h-4.5 w-4.5" />
              </a>
              <a
                href="/dashboard/discord"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-[#0c091f] text-cyan-400 hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-white transition shadow-sm"
                aria-label="Discord Community"
                title="Discord Community"
              >
                <MessageSquare className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {/* Links Navigation Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-4">
            {footerLinks.map((group) => (
              <div key={group.title} className="space-y-4">
                <h4 className="text-xs font-mono font-black uppercase tracking-wider text-cyan-400 border-l-2 border-cyan-400 pl-2.5">
                  {group.title}
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-200/70 hover:text-cyan-300 transition-colors inline-flex items-center gap-1 group/link"
                        >
                          <span>{link.label}</span>
                          <ExternalLink className="h-3 w-3 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-fuchsia-400" />
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-cyan-200/70 hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
                        >
                          <span>{link.label}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Feature Highlights Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-3xl border border-cyan-500/20 bg-[#0c091f]/60 p-6 font-mono text-xs">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-white uppercase block">WASM Bare-Metal Runtime</span>
              <span className="text-[11px] text-cyan-400/70 font-sans">Multi-threaded browser memory buffers</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-white uppercase block">100% Air-Gapped Privacy</span>
              <span className="text-[11px] text-cyan-400/70 font-sans">Zero external telemetry or server logging</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime-500/15 text-lime-400 border border-lime-500/30">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-white uppercase block">Spotlight Command Deck</span>
              <span className="text-[11px] text-cyan-400/70 font-sans">Press Ctrl+K or ⌘+K anywhere to launch</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright and Attribution Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-cyan-500/20 pt-8 text-xs font-mono text-cyan-400/80 gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-center sm:text-left">
            <span>© {new Date().getFullYear()} FORGEKIT // DEVFORGE PLATFORM. MIT License.</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Crafted & Engineered with</span>
            <Heart className="h-3.5 w-3.5 text-fuchsia-500 fill-fuchsia-500 animate-pulse" />
            <span>by</span>
            <a
              href="https://github.com/Arterouss"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-white underline decoration-cyan-400 decoration-2 underline-offset-4 hover:text-cyan-300 transition-colors"
            >
              @Arterouss
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
