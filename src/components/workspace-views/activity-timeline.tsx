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
import { Badge } from '@/components/ui/badge';

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
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <History className="h-6 w-6 text-primary" />
            Recent Activity Timeline
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Chronological audit trail of all developer tools executed across your active workspace.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter activity history..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          {historyItems.length > 0 && (
            <button
              onClick={clearHistory}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition shrink-0"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear Timeline
            </button>
          )}
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-16 text-center space-y-3">
          <Clock className="h-8 w-8 text-muted-foreground mx-auto" />
          <h3 className="font-semibold text-foreground">No Activity Recorded Yet</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Run or process any of the 60 tools in DevForge Developer Studio to populate your activity feed here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card/40 p-5 hover:border-border/80 transition"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-sm">
                      {item.toolName}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {item.timestamp}
                    </Badge>
                  </div>
                  <span className="text-xs font-medium text-primary/90 block mt-0.5">
                    {item.action}
                  </span>
                  {item.detail && (
                    <span className="text-xs text-muted-foreground block mt-1 truncate">
                      {item.detail}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 sm:shrink-0">
                <button
                  onClick={() => handleRelaunch(item.toolName)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition"
                >
                  <Play className="h-3.5 w-3.5" />
                  Re-run Tool
                </button>
                <button
                  onClick={() => removeHistoryItem(item.id)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
                  title="Remove from history"
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
