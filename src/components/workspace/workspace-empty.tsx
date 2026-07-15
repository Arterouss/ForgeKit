'use client';

import {
  Braces,
  Regex,
  Key,
  Database,
  FileCode,
  Globe,
  Keyboard,
  ArrowRight,
  Cpu,
} from 'lucide-react';
import { useWorkspace } from './workspace-context';

const POPULAR_TOOLS = [
  {
    id: 'json-formatter',
    title: 'JSON AST Formatter Pro',
    description: 'Validate, minify, and inspect JSON payloads with high-speed WASM AST parsing.',
    category: 'Formatters',
    icon: Braces,
    href: '/dashboard/tools/json-formatter',
  },
  {
    id: 'regex-tester',
    title: 'Regex Compiler & Lab',
    description: 'Real-time regular expression evaluation with live capture highlights.',
    category: 'Matching',
    icon: Regex,
    href: '/dashboard/tools/regex-tester',
  },
  {
    id: 'jwt-decoder',
    title: 'JWT Crypto Inspector',
    description: 'Decode and verify cryptographic header, payload, and signature claims instantly.',
    category: 'Security',
    icon: Key,
    href: '/dashboard/tools/jwt-decoder',
  },
  {
    id: 'sql-formatter',
    title: 'SQL AST Beautifier',
    description: 'Beautify messy database queries for PostgreSQL, MySQL, and SQLite dialects.',
    category: 'Database',
    icon: Database,
    href: '/dashboard/tools/sql-formatter',
  },
  {
    id: 'base64-encoder',
    title: 'Base64 Binary Studio',
    description: 'Encode and decode Base64 strings, images, and raw binary streams.',
    category: 'Encoding',
    icon: FileCode,
    href: '/dashboard/tools/base64-encoder',
  },
  {
    id: 'curl-builder',
    title: 'HTTP cURL Deck',
    description: 'Construct complex cURL commands with headers, body payloads, and auth flags.',
    category: 'Network',
    icon: Globe,
    href: '/dashboard/tools/curl-builder',
  },
];

export function WorkspaceEmpty() {
  const { openTab } = useWorkspace();

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-10 overflow-y-auto font-mono select-none bg-[#070512]">
      <div className="mx-auto max-w-4xl w-full space-y-8 text-center">
        {/* Header badge & title */}
        <div className="flex flex-col items-center space-y-3">
          <div className="inline-flex items-center gap-2 terminal-badge">
            <Cpu className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>// CYBER_DECK_WORKSTATION_IDLE</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            NO ACTIVE TOOL BUFFER OPEN
          </h2>
          <p className="max-w-md text-xs sm:text-sm text-cyan-200/70 font-mono">
            Select a utility module below or press <kbd className="rounded border border-cyan-500/40 bg-cyan-500/20 px-2 py-0.5 font-mono text-xs font-bold text-cyan-300">⌘K</kbd> to summon the spotlight terminal.
          </p>
        </div>

        {/* Popular Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
          {POPULAR_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() =>
                  openTab({
                    id: tool.id,
                    title: tool.title,
                    category: tool.category,
                    href: tool.href,
                  })
                }
                className="group relative flex flex-col justify-between neo-card p-5 border-cyan-500/30 transition-all hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,240,255,0.25)]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300 uppercase">
                      // {tool.category}
                    </span>
                  </div>
                  <h3 className="font-heading text-sm font-black text-white group-hover:text-cyan-300 transition-colors uppercase">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-cyan-200/70 line-clamp-2 font-sans">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-cyan-500/20 pt-3 text-[11px] font-mono text-cyan-400 font-bold">
                  <span>LAUNCH MODULE</span>
                  <ArrowRight className="h-3.5 w-3.5 text-lime-400 transition-transform group-hover:translate-x-1 stroke-[3]" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="mx-auto max-w-xl rounded-2xl border-2 border-cyan-500/30 bg-[#0c091f] p-5 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 mb-3 border-b border-cyan-500/20 pb-2">
            <Keyboard className="h-4 w-4 text-fuchsia-400" />
            <span>// WORKSTATION_KEYBOARD_SHORTCUTS</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-cyan-200/80">
            <div className="flex items-center justify-between rounded-xl border border-cyan-500/20 bg-[#070512] px-3 py-2">
              <span>COMMAND SPOTLIGHT</span>
              <kbd className="font-mono text-[10px] bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 px-1.5 py-0.5 rounded font-bold">⌘K</kbd>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-cyan-500/20 bg-[#070512] px-3 py-2">
              <span>SWITCH TABS</span>
              <kbd className="font-mono text-[10px] bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 px-1.5 py-0.5 rounded font-bold">⌘+TAB</kbd>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-cyan-500/20 bg-[#070512] px-3 py-2">
              <span>CLOSE TAB</span>
              <kbd className="font-mono text-[10px] bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 px-1.5 py-0.5 rounded font-bold">⌘W</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
