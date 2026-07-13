'use client';

import { useState } from 'react';
import { Pin, Search, Star, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWorkspace } from '@/components/workspace';
import { getAllTools } from '@/sdk/tool-registry';
import { Badge } from '@/components/ui/badge';

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
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Pin className="h-6 w-6 text-primary" />
            Pinned Favorites Manager
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Quickly access and organize your most frequently used developer tools.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search pinned favorites..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {favoriteTools.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-16 text-center space-y-3">
          <Star className="h-8 w-8 text-muted-foreground mx-auto" />
          <h3 className="font-semibold text-foreground">No Pinned Favorites Yet</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Click the star icon on any tool card in the dashboard or tool page to pin your favorite utilities here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => (
            <div
              key={tool.slug}
              onClick={() => router.push(`/dashboard/tools/${tool.slug}`)}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card/40 p-5 cursor-pointer transition hover:border-primary/50 hover:bg-card/60"
            >
              <div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {tool.category}
                  </Badge>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(tool.slug);
                    }}
                    className="rounded-lg p-1.5 text-amber-400 hover:bg-amber-400/10 transition"
                    title="Unpin Favorite"
                  >
                    <Star className="h-4 w-4 fill-amber-400" />
                  </button>
                </div>

                <h3 className="text-base font-semibold text-foreground mt-3 group-hover:text-primary transition">
                  {tool.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                  {tool.description}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-3 text-xs font-medium text-primary">
                <span>Launch Tool</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
