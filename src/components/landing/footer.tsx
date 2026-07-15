'use client';

import { Github } from 'lucide-react';
import Link from 'next/link';

const FOOTER_LINKS = [
  {
    title: '// WORKSPACE_DOMAINS',
    links: [
      { label: 'Launch Cyber-Deck Hub', href: '/dashboard' },
      { label: 'JSON AST Formatter', href: '/dashboard/tools/json-formatter' },
      { label: 'JWT Cryptographic Inspector', href: '/dashboard/tools/jwt-decoder' },
      { label: 'Regex Expression Debugger', href: '/dashboard/tools/regex-tester' },
    ],
  },
  {
    title: '// OPEN_SOURCE_ARCHIVE',
    links: [
      { label: 'GitHub Repository', href: 'https://github.com/Arterouss/ForgeKit', external: true },
      { label: 'Report Issue / Bug', href: 'https://github.com/Arterouss/ForgeKit/issues', external: true },
      { label: 'Contributing Guide', href: 'https://github.com/Arterouss/ForgeKit/blob/main/CONTRIBUTING.md', external: true },
    ],
  },
  {
    title: '// SYSTEM_ARCHITECTURE',
    links: [
      { label: 'WASM Bare-Metal Engine', href: '#features' },
      { label: 'Zero-Telemetry Sandbox', href: '#features' },
      { label: 'MIT Open License', href: 'https://github.com/Arterouss/ForgeKit/blob/main/LICENSE', external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-cyan-500/30 bg-[#070512] py-16 text-foreground select-none font-mono">
      <div className="w-full space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-lime-400 text-[#070512] font-black text-sm shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                DF
              </div>
              <span className="font-heading text-2xl font-black tracking-tight text-white uppercase">
                DevForge <span className="text-cyan-400">OS</span>
              </span>
            </Link>
            <p className="max-w-sm text-xs text-cyan-200/70 leading-relaxed">
              The retro-futuristic desktop engineering platform powered by local WebAssembly. Zero network round-trips. Air-gapped privacy by default.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://github.com/Arterouss/ForgeKit"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-[#0c091f] text-cyan-400 hover:border-cyan-400 hover:bg-cyan-500/20 transition-all shadow-sm"
                aria-label="GitHub"
              >
                <Github className="h-4.5 w-4.5 text-fuchsia-400" />
              </a>
            </div>
          </div>

          {/* Links Col */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.title} className="space-y-4">
              <div className="text-xs font-mono font-extrabold uppercase tracking-wider text-cyan-400 border-l-2 border-cyan-400 pl-2">
                {col.title}
              </div>
              <ul className="space-y-2.5 text-xs font-mono font-bold">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-200/70 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                      >
                        <span>{link.label}</span>
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-cyan-200/70 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
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

        {/* Bottom copyright row */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-cyan-500/20 pt-8 text-xs font-mono text-cyan-400/70 gap-4">
          <div>
            © {new Date().getFullYear()} DEVFORGE_OS // PROTOCOL v3.5
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-lime-400 animate-ping" />
            <span className="text-lime-400 font-bold">ALL 60+ TOOLS RUNNING LOCAL WASM</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
