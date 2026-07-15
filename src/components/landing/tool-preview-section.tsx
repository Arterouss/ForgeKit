'use client';

import { useState } from 'react';
import {
  Braces,
  Shield,
  Terminal,
  Copy,
  Check,
  Sparkles,
  Cpu,
  Database,
  Play,
  CheckCircle2,
} from 'lucide-react';

interface PreviewDemo {
  id: string;
  name: string;
  category: string;
  icon: React.ElementType;
  inputTitle: string;
  outputTitle: string;
  input: string;
  output: string;
  badge: string;
  latency: string;
}

const PREVIEW_DEMOS: PreviewDemo[] = [
  {
    id: 'json',
    name: 'JSON AST Formatter',
    category: 'FORMATTING',
    icon: Braces,
    inputTitle: 'RAW MINIFIED PAYLOAD',
    outputTitle: 'VALIDATED AST STRUCTURE',
    badge: '2-SPACE INDENT // VALID',
    latency: '0.14ms',
    input: `{"status":200,"engine":"WASM_v3.5","user":{"id":"cyber_881","handle":"arterouss","permissions":["admin","sys_op"],"vault":{"encrypted":true,"localSync":true}}}`,
    output: `{
  "status": 200,
  "engine": "WASM_v3.5",
  "user": {
    "id": "cyber_881",
    "handle": "arterouss",
    "permissions": [
      "admin",
      "sys_op"
    ],
    "vault": {
      "encrypted": true,
      "localSync": true
    }
  }
}`,
  },
  {
    id: 'jwt',
    name: 'JWT Cryptographic Inspector',
    category: 'SECURITY',
    icon: Shield,
    inputTitle: 'ENCODED JWT BEARER TOKEN',
    outputTitle: 'DECODED CRYPTOGRAPHIC CLAIMS',
    badge: 'HS256 SIGNATURE VALIDATED',
    latency: '0.22ms',
    input: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjeWJlcl84ODEiLCJuYW1lIjoiRGV2Rm9yZ2UgQ3liZXIgT1MiLCJpYXQiOjE3MTU4NDkyMDAsImV4cCI6MTk5OTk5OTk5OX0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    output: `// HEADER: ALGORITHM & CRYPTO TYPE
{
  "alg": "HS256",
  "typ": "JWT"
}

// PAYLOAD: IDENTITY CLAIMS
{
  "sub": "cyber_881",
  "name": "DevForge Cyber OS",
  "iat": 1715849200,
  "exp": 1999999999
}`,
  },
  {
    id: 'regex',
    name: 'Regex Match Lab',
    category: 'MATCHING',
    icon: Terminal,
    inputTitle: 'PATTERN: /([a-z0-9._%+-]+)@devforge\\.dev/gi',
    outputTitle: 'LIVE CAPTURE GROUPS & INDICES',
    badge: '2 TARGETS DETECTED',
    latency: '0.18ms',
    input: `Transmit alert to security lead at cyber@devforge.dev and devops cluster at sysops@devforge.dev immediately.`,
    output: `[MATCH_01]: "cyber@devforge.dev"
  > Index Range: [35 ... 53]
  > Capture Group 1: "cyber"

[MATCH_02]: "sysops@devforge.dev"
  > Index Range: [76 ... 95]
  > Capture Group 1: "sysops"`,
  },
  {
    id: 'sql',
    name: 'SQL Query Beautifier',
    category: 'DATABASE',
    icon: Database,
    inputTitle: 'MINIFIED SQL QUERY STRING',
    outputTitle: 'OPTIMIZED & FORMATTED SQL',
    badge: 'POSTGRES DIALECT // AST PARSED',
    latency: '0.29ms',
    input: `SELECT id,username,email,created_at FROM users WHERE status='active' AND role IN ('admin','developer') ORDER BY created_at DESC LIMIT 50;`,
    output: `SELECT 
  id, 
  username, 
  email, 
  created_at 
FROM users 
WHERE status = 'active' 
  AND role IN ('admin', 'developer') 
ORDER BY created_at DESC 
LIMIT 50;`,
  },
];

export function ToolPreviewSection() {
  const [activeTab, setActiveTab] = useState(PREVIEW_DEMOS[0].id);
  const [copied, setCopied] = useState(false);

  const activeDemo =
    PREVIEW_DEMOS.find((d) => d.id === activeTab) ?? PREVIEW_DEMOS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeDemo.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="workspace" className="relative w-full select-none">
      <div className="w-full space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 terminal-badge">
            <Cpu className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>// INTERACTIVE_CYBER_DECK_PREVIEW</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-[36px] font-black uppercase tracking-tight text-foreground leading-tight">
            LIVE WORKSPACE <span className="glow-cyan-text">SIMULATOR</span>
          </h2>
          <p className="max-w-3xl mx-auto text-base sm:text-[16px] text-cyan-200/80 font-sans leading-relaxed">
            Test the real-time client WebAssembly execution engine right now. Zero server latency. Zero data leave your browser window.
          </p>
        </div>

        {/* Cyber-Deck Workstation OS Window */}
        <div className="relative rounded-3xl border-2 border-cyan-500/40 bg-[#070512]/95 shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden">
          {/* Top Retro Computer Window Strip */}
          <div className="flex items-center justify-between border-b border-cyan-500/30 bg-[#0c091f] px-5 py-3 font-mono text-xs">
            <div className="flex items-center gap-3">
              {/* Retro Window Traffic Lights */}
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-fuchsia-500/80 border border-fuchsia-400" title="Close Window" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/80 border border-yellow-300" title="Minimize Window" />
                <span className="h-3 w-3 rounded-full bg-lime-400/80 border border-lime-300 animate-pulse" title="Maximize Window" />
              </div>
              <span className="text-cyan-300 font-extrabold tracking-wider hidden sm:inline">
                DEVFORGE_WORKSTATION_v3.5 // SANDBOX_ACTIVE
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-lime-400 font-bold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-lime-400" />
                THREADS: 4 ACTIVE
              </span>
              <span className="hidden md:inline text-cyan-400/70">
                MEM: 14.2 MB
              </span>
            </div>
          </div>

          {/* Docking Tabs Navigation Strip */}
          <div className="flex flex-wrap items-center gap-2 border-b border-cyan-500/20 bg-[#070512] px-4 py-3">
            {PREVIEW_DEMOS.map((demo) => {
              const IconComponent = demo.icon;
              const isActive = activeDemo.id === demo.id;
              return (
                <button
                  key={demo.id}
                  onClick={() => setActiveTab(demo.id)}
                  className={`flex items-center gap-2.5 rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)] scale-[1.02]'
                      : 'bg-[#0c091f] border border-cyan-500/20 text-muted-foreground hover:border-cyan-500/50 hover:text-cyan-200'
                  }`}
                >
                  <IconComponent
                    className={`h-4 w-4 ${
                      isActive ? 'text-cyan-400' : 'text-muted-foreground'
                    }`}
                  />
                  <span>{demo.name}</span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-lime-400 shadow-[0_0_6px_#39ff14]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Split-View IDE Workspace Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-cyan-500/20 min-h-[420px] font-mono text-xs">
            {/* Left: Input Editor Panel */}
            <div className="flex flex-col bg-[#070512]">
              <div className="flex items-center justify-between border-b border-cyan-500/20 bg-[#0c091f]/60 px-4 py-2.5">
                <span className="font-extrabold text-cyan-400 flex items-center gap-2">
                  <span className="text-fuchsia-400">{'>'}</span> {activeDemo.inputTitle}
                </span>
                <span className="rounded bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[10px] text-cyan-300">
                  INPUT BUFFER
                </span>
              </div>
              <div className="flex-1 p-5 overflow-auto text-cyan-100/90 leading-relaxed scrollbar-none font-mono">
                <pre className="whitespace-pre-wrap select-text">{activeDemo.input}</pre>
              </div>
              <div className="border-t border-cyan-500/20 bg-[#0c091f]/40 px-4 py-2 flex items-center justify-between text-[11px] text-cyan-400/60">
                <span>ENCODING: UTF-8</span>
                <span>BYTES: {activeDemo.input.length}</span>
              </div>
            </div>

            {/* Right: Output Execution Panel */}
            <div className="flex flex-col bg-[#090718]">
              <div className="flex items-center justify-between border-b border-cyan-500/20 bg-[#0c091f]/80 px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-lime-400 flex items-center gap-2">
                    <Play className="h-3.5 w-3.5 fill-current text-lime-400" /> {activeDemo.outputTitle}
                  </span>
                  <span className="rounded bg-lime-500/15 border border-lime-500/30 px-2 py-0.5 text-[10px] text-lime-400 font-bold">
                    {activeDemo.latency}
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/15 px-3 py-1 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 transition-all shadow-sm"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-lime-400" />
                      <span className="text-lime-400 font-extrabold">COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>COPY RESULT</span>
                    </>
                  )}
                </button>
              </div>
              <div className="flex-1 p-5 overflow-auto text-lime-300 leading-relaxed scrollbar-none font-mono">
                <pre className="whitespace-pre-wrap select-text">{activeDemo.output}</pre>
              </div>
              <div className="border-t border-cyan-500/20 bg-[#0c091f]/40 px-4 py-2 flex items-center justify-between text-[11px]">
                <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-lime-400" />
                  {activeDemo.badge}
                </span>
                <span className="text-lime-400/80 font-bold">WASM WORKER ZERO-ALLOC</span>
              </div>
            </div>
          </div>

          {/* Bottom Console Status Bar */}
          <div className="border-t border-cyan-500/30 bg-[#0c091f] px-5 py-2.5 flex flex-wrap items-center justify-between text-xs font-mono text-cyan-400/80">
            <div className="flex items-center gap-4">
              <span>{'>'} CONSOLE_STATUS: READY</span>
              <span className="text-white/20">|</span>
              <span className="text-lime-400">MEMORY_SANDBOX: ISOLATED</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-fuchsia-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-cyan-300 font-bold">60+ MORE WORKSTATION TOOLS INSIDE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
