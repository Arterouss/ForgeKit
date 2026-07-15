'use client';

import { useState } from 'react';
import {
  BookOpen,
  Code2,
  Cpu,
  Keyboard,
  Search,
  ChevronRight,
  Copy,
  Check,
  Zap,
  HelpCircle,
  Terminal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DOC_SECTIONS = [
  {
    id: 'quickstart',
    title: 'SYS_INITIALIZE // QUICK START',
    icon: Zap,
    desc: 'Get up and running with DevForge Cyber Workstation in under 60 seconds.',
    content: `DevForge is engineered to execute bare-metal offline in your browser engine with zero network latency. Every tool module runs inside isolated WebAssembly (WASM) and Web Worker threads.

### OPENING MODULES & COMMANDS
Press \`Ctrl+K\` (or \`⌘K\` on macOS) anywhere across the OS to summon the **Spotlight Command Terminal**. Type any command or module name (e.g., \`JSON Formatter\`, \`JWT Decoder\`, \`Regex Lab\`) and press Enter to instantly mount and execute.

### 3-PANEL CYBER-DECK STUDIO
Every developer module opens inside a high-contrast 3-panel IDE workstation layout. Toggle seamlessly between **Split View** (input vs AST output side-by-side) and **Single Editor Buffer** using the top action console.`,
  },
  {
    id: 'wasm-engine',
    title: 'WASM_AIR_GAP // OFFLINE SECURITY',
    icon: Cpu,
    desc: 'How DevForge sandboxes sensitive cryptographic keys and API tokens.',
    content: `Unlike legacy web utilities that transmit your proprietary JSON payloads, JWT bearer tokens, or private SSH keys across cloud network sockets, DevForge guarantees 100% air-gapped local execution.

### CRYPTOGRAPHIC MEMORY ISOLATION
All hashing algorithms (SHA-256, HMAC, Argon2) and formatting transforms execute inside sandboxed WebAssembly memory buffers. Your data never escapes your local browser runtime environment.`,
  },
  {
    id: 'shortcuts',
    title: 'KEY_BINDINGS // SHORTCUTS MATRIX',
    icon: Keyboard,
    desc: 'Master keyboard-first developer velocity across all tools.',
    content: `| Shortcut Key | Action Performed |
| :--- | :--- |
| \`Ctrl + K\` / \`⌘ + K\` | Summon Spotlight Command Terminal |
| \`Ctrl + M\` / \`⌘ + M\` | Open Sandboxed Plugin Marketplace |
| \`Ctrl + /\` / \`⌘ + /\` | Toggle Cyber Sidebar Collapse (\`72px\` vs \`288px\`) |
| \`Alt + S\` | Toggle Split vs Single Editor Buffer |
| \`Esc\` | Close active terminal modal, dialog, or drawer |`,
  },
  {
    id: 'sdk',
    title: 'MODULE_SDK // EXTENSION ENGINE',
    icon: Code2,
    desc: 'Register custom developer utilities into the global runtime index.',
    content: `You can dynamically inject custom WASM tools into the global DevForge index using the \`ToolRegistry\` API:

\`\`\`typescript
import { toolRegistry } from '@/sdk/tool-registry';

toolRegistry.registerTool({
  id: 'custom-yaml-validator',
  title: 'YAML VALIDATOR V2',
  category: 'Formatting',
  description: 'Strict syntax validator with custom AST rules',
  path: '/dashboard/tools/yaml-validator',
});
\`\`\``,
  },
  {
    id: 'faq',
    title: 'KNOWLEDGE_BASE // FAQ',
    icon: HelpCircle,
    desc: 'Answers regarding privacy, persistence, and local IndexedDB vaults.',
    content: `**Q: Where are my open workspace tabs, buffers, and snippets stored?**  
A: Everything is committed locally in your browser's \`IndexedDB\` and \`localStorage\` under the \`devforge_cyberos\` key. You can export or import portable JSON snapshots anytime via Settings -> Snapshots & Backup.`,
  },
];

export default function DocumentationCenterPage() {
  const [activeSection, setActiveSection] = useState('quickstart');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const currentDoc = DOC_SECTIONS.find((s) => s.id === activeSection) || DOC_SECTIONS[0];

  const handleCopySnippet = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full flex-col lg:flex-row gap-6 max-w-[1440px] mx-auto p-4 md:p-8 select-none font-mono text-xs">
      {/* Left Documentation Navigation per Chapter 22 */}
      <aside className="w-full lg:w-80 shrink-0 space-y-3">
        <div className="flex items-center justify-between border-2 border-cyan-500/30 bg-[#0c091f] px-4 py-3 rounded-2xl shadow-[0_0_15px_rgba(0,240,255,0.15)]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.3)] font-extrabold">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-heading font-black text-white uppercase tracking-wider">DOCS_MATRIX</h1>
              <p className="text-[10px] text-cyan-400/80 font-mono">// KNOWLEDGE BASE</p>
            </div>
          </div>
          <span className="rounded bg-cyan-500/20 border border-cyan-400/50 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
            v3.5
          </span>
        </div>

        {/* Search inside docs */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-400" />
          <input
            type="text"
            placeholder="> search_docs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border-2 border-cyan-500/40 bg-[#070512] pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-cyan-400/50 focus:border-cyan-300 focus:outline-none font-mono shadow-sm"
          />
        </div>

        <div className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-230px)] pr-1 no-scrollbar">
          {DOC_SECTIONS.filter((s) =>
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.desc.toLowerCase().includes(searchQuery.toLowerCase())
          ).map((section) => {
            const Icon = section.icon;
            const isSelected = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-mono font-bold transition-all',
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)] scale-[1.01]'
                    : 'text-cyan-400/70 border-2 border-transparent hover:bg-cyan-500/10 hover:text-white'
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-transform group-hover:scale-110',
                    isSelected ? 'text-fuchsia-400' : 'text-cyan-400'
                  )}
                />
                <div className="flex-1 truncate">
                  <div className="truncate text-xs font-bold uppercase">{section.title}</div>
                  <div className="truncate text-[10px] text-cyan-200/60 font-sans">{section.desc}</div>
                </div>
                <ChevronRight className={`h-3.5 w-3.5 opacity-60 transition-transform ${isSelected ? 'translate-x-1 opacity-100 text-fuchsia-400' : ''}`} />
              </button>
            );
          })}
        </div>
      </aside>

      {/* Right Document Reading Area per Chapter 22 */}
      <main className="flex-1 rounded-3xl border-2 border-cyan-500/30 bg-[#0c091f]/95 backdrop-blur-2xl p-6 sm:p-10 space-y-8 overflow-y-auto min-h-[550px] shadow-[0_0_35px_rgba(0,240,255,0.2)]">
        <div className="border-b border-cyan-500/30 pb-6 space-y-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-fuchsia-400 uppercase tracking-wider">
              <Terminal className="h-4 w-4" />
              <span>CHAPTER_REFERENCE // {currentDoc.id.toUpperCase()}</span>
            </div>
            <span className="rounded border border-lime-400/50 bg-lime-500/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-lime-400 uppercase">
              STATUS: AIR_GAPPED
            </span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-white uppercase tracking-wide">{currentDoc.title}</h2>
          <p className="text-xs text-cyan-200/80 font-sans">{currentDoc.desc}</p>
        </div>

        <div className="prose prose-invert max-w-[800px] text-xs sm:text-sm text-cyan-100 font-sans leading-relaxed space-y-4">
          {currentDoc.content.split('\n\n').map((para, i) => {
            if (para.startsWith('### ')) {
              return <h3 key={i} className="text-base font-heading font-black text-white uppercase tracking-wide pt-4 border-t border-cyan-500/20">{para.replace('### ', '')}</h3>;
            }
            if (para.startsWith('```')) {
              const codeClean = para.replace(/```[a-z]*\n/g, '').replace(/\n```/g, '');
              return (
                <div key={i} className="relative rounded-2xl border-2 border-cyan-500/30 bg-[#070512] p-5 font-mono text-xs text-lime-300 my-4 shadow-sm">
                  <button
                    onClick={() => handleCopySnippet(codeClean)}
                    className="absolute right-3.5 top-3.5 flex items-center gap-1.5 rounded-lg border border-cyan-400/60 bg-cyan-500/20 px-2.5 py-1 text-[10px] font-bold text-cyan-300 hover:bg-cyan-500/30 transition-colors shadow-sm"
                  >
                    {copied ? <Check className="h-3 w-3 text-lime-400 stroke-[3]" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? 'COPIED' : 'COPY'}</span>
                  </button>
                  <pre className="overflow-x-auto pr-20 font-mono leading-relaxed">{codeClean}</pre>
                </div>
              );
            }
            return <p key={i} className="whitespace-pre-line leading-relaxed">{para}</p>;
          })}
        </div>
      </main>
    </div>
  );
}
