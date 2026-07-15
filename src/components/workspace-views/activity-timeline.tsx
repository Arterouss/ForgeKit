'use client';

import { useState } from 'react';
import {
  History,
  Trash2,
  Search,
  Play,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWorkspace } from '@/components/workspace';
import { getAllTools } from '@/sdk/tool-registry';

export function ActivityTimelineView() {
  const router = useRouter();
  const { historyItems, clearHistory, removeHistoryItem } = useWorkspace();
  const allTools = getAllTools();

  const [query, setQuery] = useState('');

  const filteredHistory = query
    ? historyItems.filter(
        (h) =>
          h.toolName.toLowerCase().includes(query.toLowerCase()) ||
          h.action.toLowerCase().includes(query.toLowerCase()) ||
          (h.detail && h.detail.toLowerCase().includes(query.toLowerCase()))
      )
    : historyItems;

  const handleRelaunch = (toolName: string) => {
    const matched = allTools.find(
      (t) =>
        t.name.toLowerCase() === toolName.toLowerCase() ||
        t.name.toLowerCase().includes(toolName.toLowerCase())
    );
    if (matched) {
      router.push(`/dashboard/tools/${matched.slug}`);
    }
  };

  return (
    <div className="space-y-8 pb-12 font-mono select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b-2 border-cyan-500/30 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-wider text-white flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <History className="h-5 w-5" />
            </div>
            <span>RECENT_TELEMETRY // AUDIT LOG</span>
          </h1>
          <p className="text-xs text-cyan-200/70 mt-1 font-sans">
            Chronological audit trail of all developer tools executed across your active bare-metal WASM workspace.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-400" />
            <input
              type="text"
              placeholder="> filter_logs --query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border-2 border-cyan-500/40 bg-[#070512] pl-10 pr-4 py-2 text-xs text-cyan-100 placeholder:text-cyan-400/50 focus:border-cyan-300 focus:outline-none font-mono shadow-[0_0_10px_rgba(0,240,255,0.15)]"
            />
          </div>
          {historyItems.length > 0 && (
            <button
              onClick={clearHistory}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-400 bg-rose-500/15 px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/25 transition shrink-0 shadow-[0_0_12px_rgba(244,63,94,0.3)]"
            >
              <Trash2 className="h-3.5 w-3.5" />
              CLEAR_BUFFER [X]
            </button>
          )}
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="rounded-3xl border-2 border-cyan-500/30 bg-[#0c091f]/90 p-16 text-center space-y-3 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
          <Clock className="h-10 w-10 text-fuchsia-400 mx-auto opacity-70 animate-pulse" />
          <h3 className="font-heading text-lg font-black text-white uppercase">NO ACTIVITY AUDIT TRAIL RECORDED YET</h3>
          <p className="text-xs text-cyan-200/70 max-w-md mx-auto font-sans">
            Run or execute any of the 60 tools in DevForge Workstation to populate your live telemetry feed here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border-2 border-cyan-500/30 bg-[#0c091f]/90 p-5 hover:border-cyan-400 transition-all shadow-sm"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <CheckCircle2 className="h-5 w-5 text-lime-400 shrink-0 mt-0.5 shadow-[0_0_8px_#39ff14]" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-white text-sm uppercase font-heading tracking-wide">
                      {item.toolName}
                    </span>
                    <span className="rounded bg-cyan-500/20 border border-cyan-400/50 px-2 py-0.5 text-[10px] text-cyan-300 font-mono font-bold">
                      {item.timestamp}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-lime-400 block mt-1">
                    {item.action}
                  </span>
                  {item.detail && (
                    <span className="text-[11px] text-cyan-200/80 block mt-1.5 truncate font-sans bg-[#070512] px-2 py-1 rounded border border-cyan-500/20">
                      {item.detail}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:shrink-0">
                <button
                  onClick={() => handleRelaunch(item.toolName)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-lime-400 bg-lime-500/20 px-4 py-1.5 text-xs font-bold text-lime-400 hover:bg-lime-500/30 transition shadow-[0_0_10px_rgba(57,255,20,0.25)]"
                >
                  <Play className="h-3.5 w-3.5 fill-lime-400" />
                  RELAUNCH_TOOL
                </button>
                <button
                  onClick={() => removeHistoryItem(item.id)}
                  className="rounded-xl border border-cyan-500/30 bg-[#070512] p-2 text-cyan-400 hover:border-rose-400 hover:text-rose-400 transition"
                  title="Remove telemetry entry"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
