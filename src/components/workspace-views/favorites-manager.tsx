'use client';

import { useState } from 'react';
import { Pin, Search, Star, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWorkspace } from '@/components/workspace';
import { getAllTools } from '@/sdk/tool-registry';

export function FavoritesManagerView() {
  const router = useRouter();
  const { favorites, toggleFavorite } = useWorkspace();
  const allTools = getAllTools();

  const [query, setQuery] = useState('');

  const favoriteTools = allTools.filter((t) => favorites.includes(t.slug));
  const filteredTools = query
    ? favoriteTools.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase())
      )
    : favoriteTools;

  return (
    <div className="space-y-8 pb-12 font-mono select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b-2 border-cyan-500/30 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-wider text-white flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/20 border border-fuchsia-400 text-fuchsia-400 shadow-[0_0_15px_rgba(255,0,127,0.3)]">
              <Pin className="h-5 w-5 fill-fuchsia-400" />
            </div>
            <span>PINNED_FAVORITES // DOCK VAULT</span>
          </h1>
          <p className="text-xs text-cyan-200/70 mt-1 font-sans">
            Quickly access and launch your pinned developer modules directly from the high-priority workstation dock.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-400" />
          <input
            type="text"
            placeholder="> search_favorites..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border-2 border-cyan-500/40 bg-[#070512] pl-10 pr-4 py-2 text-xs text-cyan-100 placeholder:text-cyan-400/50 focus:border-cyan-300 focus:outline-none font-mono shadow-[0_0_10px_rgba(0,240,255,0.15)]"
          />
        </div>
      </div>

      {favoriteTools.length === 0 ? (
        <div className="rounded-3xl border-2 border-cyan-500/30 bg-[#0c091f]/90 p-16 text-center space-y-3 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
          <Star className="h-10 w-10 text-yellow-400 mx-auto opacity-70 animate-bounce" />
          <h3 className="font-heading text-lg font-black text-white uppercase">NO PINNED FAVORITES DETECTED IN VAULT</h3>
          <p className="text-xs text-cyan-200/70 max-w-md mx-auto font-sans">
            Click the neon heart/star icon on any tool card across the dashboard to lock utility modules to your high-priority favorites dock.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => (
            <div
              key={tool.slug}
              onClick={() => router.push(`/dashboard/tools/${tool.slug}`)}
              className="group flex flex-col justify-between rounded-2xl border-2 border-cyan-500/30 bg-[#0c091f]/90 p-6 cursor-pointer transition-all hover:border-fuchsia-400 hover:bg-[#110d29] hover:shadow-[0_0_25px_rgba(255,0,127,0.25)]"
            >
              <div>
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5 mb-3">
                  <span className="rounded bg-cyan-500/15 border border-cyan-400/50 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300 uppercase">
                    // {tool.category}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(tool.slug);
                    }}
                    className="rounded-lg p-1.5 text-fuchsia-400 hover:bg-fuchsia-500/20 transition-colors"
                    title="Unpin Favorite"
                  >
                    <Star className="h-4 w-4 fill-fuchsia-400 text-fuchsia-400 drop-shadow-[0_0_8px_#ff007f]" />
                  </button>
                </div>

                <h3 className="text-base font-heading font-black text-white group-hover:text-fuchsia-300 transition-colors uppercase">
                  {tool.name}
                </h3>
                <p className="text-xs text-cyan-200/70 mt-1.5 line-clamp-2 font-sans">
                  {tool.description}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-cyan-500/20 pt-3 text-xs font-mono font-bold text-lime-400">
                <span>LAUNCH MODULE</span>
                <ExternalLink className="h-3.5 w-3.5 text-lime-400 transition-transform group-hover:translate-x-1 stroke-[3]" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
