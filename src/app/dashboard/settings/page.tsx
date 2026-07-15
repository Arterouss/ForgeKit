'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Settings,
  Palette,
  Layout,
  Code2,
  Package,
  Keyboard,
  Database,
  Shield,
  Sliders,
  Check,
  Download,
  Sparkles,
  Zap,
  Terminal,
} from 'lucide-react';

const SETTING_CATEGORIES = [
  { id: 'general', label: 'SYS_GENERAL', icon: Settings, desc: 'Core system defaults, startup workspace, and telemetry behavior' },
  { id: 'appearance', label: 'THEME_MATRIX', icon: Palette, desc: 'Themes, OLED contrast, UI scaling, and typography' },
  { id: 'workspace', label: 'CYBER_DOCK', icon: Layout, desc: 'Tab behavior, panel auto-collapse, dock orientation, and split-view' },
  { id: 'editor', label: 'MONACO_ENGINE', icon: Code2, desc: 'Monaco code formatting, line numbers, word wrap, and minimap' },
  { id: 'plugins', label: 'WASM_MODULES', icon: Package, desc: 'WASM sandbox permissions, auto-update checks, and custom registries' },
  { id: 'shortcuts', label: 'KEY_BINDINGS', icon: Keyboard, desc: 'Customize Ctrl+K, quick search, tool toggles, and panel resizing' },
  { id: 'data', label: 'STORAGE_VAULT', icon: Database, desc: 'IndexedDB cache limits, execution history retention, and auto-cleanup' },
  { id: 'backup', label: 'SNAPSHOTS', icon: Download, desc: 'Export/import workspace JSON vaults, snippets, and collections' },
  { id: 'privacy', label: 'SECURITY_WALL', icon: Shield, desc: 'Client-side WASM isolation, telemetry toggles, and secure audit logs' },
  { id: 'advanced', label: 'OVERCLOCKING', icon: Sliders, desc: 'Experimental WebAssembly threads, GPU hardware acceleration, and debug logs' },
] as const;

export default function SettingsCenterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('general');
  const [autoSave, setAutoSave] = useState(true);
  const [telemetry, setTelemetry] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);
  const [savedMessage, setSavedMessage] = useState(false);

  const triggerSaveNotification = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  return (
    <div className="flex h-full flex-col lg:flex-row gap-6 max-w-[1550px] mx-auto p-4 md:p-8 select-none font-mono text-xs">
      {/* Left Categorized Navigation per Chapter 21 */}
      <aside className="w-full lg:w-80 shrink-0 space-y-3">
        <div className="flex items-center justify-between border-2 border-cyan-500/30 bg-[#0c091f] px-4 py-3 rounded-2xl shadow-[0_0_15px_rgba(0,240,255,0.15)]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.3)] font-extrabold">
              <Settings className="h-5 w-5 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <div>
              <h1 className="text-sm font-heading font-black text-white uppercase tracking-wider">SYSTEM_SETTINGS</h1>
              <p className="text-[10px] text-cyan-400/80 font-mono">// WORKSTATION CONFIG</p>
            </div>
          </div>
          {savedMessage && (
            <span className="flex items-center gap-1 rounded bg-lime-500/20 border border-lime-400 px-2.5 py-1 text-[10px] font-bold text-lime-400 shadow-[0_0_10px_#39ff14]">
              <Check className="h-3 w-3 stroke-[3]" /> BUFFER_SAVED
            </span>
          )}
        </div>

        <div className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1 no-scrollbar">
          {SETTING_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (cat.id === 'appearance') {
                    router.push('/dashboard/settings/appearance');
                  } else {
                    setActiveTab(cat.id);
                  }
                }}
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
                  <div className="truncate text-xs font-bold uppercase">{cat.label}</div>
                  <div className="truncate text-[10px] text-cyan-200/60 font-sans">{cat.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Right Settings Content Area */}
      <main className="flex-1 rounded-3xl border-2 border-cyan-500/30 bg-[#0c091f]/95 backdrop-blur-2xl p-6 sm:p-8 space-y-8 min-h-[550px] shadow-[0_0_40px_rgba(0,240,255,0.2)]">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="border-b border-cyan-500/30 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-heading font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-cyan-400" />
                  <span>SYS_GENERAL // CORE DEFAULTS</span>
                </h2>
                <p className="text-xs text-cyan-200/70 mt-1 font-sans">Configure core runtime startup options and IndexedDB persistence behaviors.</p>
              </div>
              <span className="rounded border border-cyan-400/50 bg-cyan-500/15 px-3 py-1 font-mono text-[10px] font-bold text-cyan-300 uppercase">
                STATUS: ACTIVE
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-cyan-500/30 bg-[#070512] p-5 hover:border-cyan-400 transition-all">
                <div>
                  <span className="text-sm font-bold text-white uppercase">AUTO-PERSIST WORKSTATE BUFFER</span>
                  <p className="text-xs text-cyan-200/70 font-sans mt-0.5">Automatically commit open tab sessions, input text editors, and split layout dimensions to local IndexedDB.</p>
                </div>
                <button
                  onClick={() => { setAutoSave(!autoSave); triggerSaveNotification(); }}
                  className={cn(
                    "relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none",
                    autoSave ? "bg-cyan-400 border-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.6)]" : "bg-[#0c091f] border-cyan-500/40"
                  )}
                >
                  <span className={cn(
                    "inline-block h-5 w-5 rounded-full bg-[#070512] transform transition duration-200 ease-in-out mt-0.5 ml-0.5",
                    autoSave ? "translate-x-6 bg-[#070512]" : "translate-x-0 bg-cyan-400/60"
                  )} />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-cyan-500/30 bg-[#070512] p-5 hover:border-cyan-400 transition-all">
                <div>
                  <span className="text-sm font-bold text-white uppercase">WASM BARE-METAL AIR-GAP ENFORCEMENT</span>
                  <p className="text-xs text-cyan-200/70 font-sans mt-0.5">Force all cryptographic formatting, regex matching, and payload parsing to execute strictly offline inside client-side WebAssembly threads.</p>
                </div>
                <span className="rounded bg-lime-500/20 border border-lime-400 px-3 py-1.5 text-xs font-bold text-lime-400 flex items-center gap-1.5 shadow-[0_0_10px_rgba(57,255,20,0.3)]">
                  <Zap className="h-4 w-4 fill-lime-400" /> ENFORCED
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'editor' && (
          <div className="space-y-6">
            <div className="border-b border-cyan-500/30 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-heading font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-fuchsia-400" />
                  <span>MONACO_ENGINE // EDITOR CONFIG</span>
                </h2>
                <p className="text-xs text-cyan-200/70 mt-1 font-sans">Customize syntax highlighting, minimap rendering, and line wrapping policies.</p>
              </div>
              <span className="rounded border border-fuchsia-400/50 bg-fuchsia-500/15 px-3 py-1 font-mono text-[10px] font-bold text-fuchsia-300 uppercase">
                ENGINE: MONACO_v4.2
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-cyan-500/30 bg-[#070512] p-5 hover:border-cyan-400 transition-all">
                <div>
                  <span className="text-sm font-bold text-white uppercase">DISPLAY LINE NUMBER GUTTER</span>
                  <p className="text-xs text-cyan-200/70 font-sans mt-0.5">Show absolute line numbering along the left gutter of all Monaco input and AST output editors.</p>
                </div>
                <button
                  onClick={() => { setLineNumbers(!lineNumbers); triggerSaveNotification(); }}
                  className={cn(
                    "relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none",
                    lineNumbers ? "bg-cyan-400 border-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.6)]" : "bg-[#0c091f] border-cyan-500/40"
                  )}
                >
                  <span className={cn(
                    "inline-block h-5 w-5 rounded-full bg-[#070512] transform transition duration-200 ease-in-out mt-0.5 ml-0.5",
                    lineNumbers ? "translate-x-6" : "translate-x-0 bg-cyan-400/60"
                  )} />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-cyan-500/30 bg-[#070512] p-5 hover:border-cyan-400 transition-all">
                <div>
                  <span className="text-sm font-bold text-white uppercase">SOFT WORD WRAPPING (VIEWPORT BOUND)</span>
                  <p className="text-xs text-cyan-200/70 font-sans mt-0.5">Wrap long strings of JSON, SQL, or Base64 across the screen without requiring horizontal scrollbars.</p>
                </div>
                <button
                  onClick={() => { setWordWrap(!wordWrap); triggerSaveNotification(); }}
                  className={cn(
                    "relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none",
                    wordWrap ? "bg-cyan-400 border-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.6)]" : "bg-[#0c091f] border-cyan-500/40"
                  )}
                >
                  <span className={cn(
                    "inline-block h-5 w-5 rounded-full bg-[#070512] transform transition duration-200 ease-in-out mt-0.5 ml-0.5",
                    wordWrap ? "translate-x-6" : "translate-x-0 bg-cyan-400/60"
                  )} />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div className="border-b border-cyan-500/30 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-heading font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Shield className="h-5 w-5 text-lime-400" />
                  <span>SECURITY_WALL // PRIVACY & TELEMETRY</span>
                </h2>
                <p className="text-xs text-cyan-200/70 mt-1 font-sans">Manage local telemetry policies, error reporting streams, and WASM memory isolation.</p>
              </div>
              <span className="rounded border border-lime-400/50 bg-lime-500/15 px-3 py-1 font-mono text-[10px] font-bold text-lime-400 uppercase">
                SECURITY: AIR_GAPPED
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-cyan-500/30 bg-[#070512] p-5 hover:border-cyan-400 transition-all">
                <div>
                  <span className="text-sm font-bold text-white uppercase">ANONYMOUS ERROR TELEMETRY STREAM</span>
                  <p className="text-xs text-cyan-200/70 font-sans mt-0.5">Transmit zero-payload anonymized crash stack traces to help optimize WASM thread reliability.</p>
                </div>
                <button
                  onClick={() => { setTelemetry(!telemetry); triggerSaveNotification(); }}
                  className={cn(
                    "relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none",
                    telemetry ? "bg-cyan-400 border-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.6)]" : "bg-[#0c091f] border-cyan-500/40"
                  )}
                >
                  <span className={cn(
                    "inline-block h-5 w-5 rounded-full bg-[#070512] transform transition duration-200 ease-in-out mt-0.5 ml-0.5",
                    telemetry ? "translate-x-6" : "translate-x-0 bg-cyan-400/60"
                  )} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Other categorized tabs rendered consistently */}
        {activeTab !== 'general' && activeTab !== 'editor' && activeTab !== 'privacy' && (
          <div className="space-y-6">
            <div className="border-b border-cyan-500/30 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-heading font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-fuchsia-400 animate-pulse" />
                  <span>{activeTab.toUpperCase()} // MODULE SETTINGS</span>
                </h2>
                <p className="text-xs text-cyan-200/70 mt-1 font-sans">Manage {activeTab} runtime policies, memory allocation, and client-side flags.</p>
              </div>
              <span className="rounded border border-cyan-400/50 bg-cyan-500/15 px-3 py-1 font-mono text-[10px] font-bold text-cyan-300 uppercase">
                SYNCED: INDEXED_DB
              </span>
            </div>
            <div className="rounded-2xl border-2 border-cyan-500/30 bg-[#070512] p-10 text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/15 border border-cyan-400 text-cyan-400 mx-auto shadow-[0_0_20px_rgba(0,240,255,0.25)]">
                <Sliders className="h-8 w-8" />
              </div>
              <p className="text-sm font-bold text-white uppercase tracking-wider">
                ALL {activeTab.toUpperCase()} CONFIGURATIONS ARE STORED IN YOUR LOCAL INDEXEDDB VAULT.
              </p>
              <p className="text-xs text-cyan-200/70 max-w-lg mx-auto font-sans leading-relaxed">
                Zero telemetry or cloud tracking involved. Every parameter is sandboxed to your browser engine, ensuring full developer autonomy.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
