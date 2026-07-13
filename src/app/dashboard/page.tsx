'use client';

import { useState } from 'react';
import {
  Sparkles,
  Search,
  BookOpen,
  Star,
  Clock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { initializeRegistry } from '@/sdk/tools-init';
import { getAllTools, searchTools } from '@/sdk/tool-registry';
import { categories } from '@/constants/categories';
import { SearchBar } from '@/components/ui/search-bar';
import { ToolCard } from '@/components/ui/tool-card';
import { CategoryCard } from '@/components/ui/category-card';
import { EmptyState } from '@/components/ui/empty-state';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

// Initialize registry once when the module loads
initializeRegistry();

export default function DashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['json-formatter', 'jwt-decoder']);
  const [recentTools, setRecentTools] = useState<string[]>(['base64', 'uuid-generator']);

  // Compute filtered tools dynamically to avoid setState in useEffect
  const filteredTools = searchQuery ? searchTools(searchQuery) : getAllTools();

  const toggleFavorite = (slug: string) => {
    setFavorites((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleToolClick = (slug: string) => {
    // Add to recent list
    setRecentTools((prev) => {
      const filtered = prev.filter((s) => s !== slug);
      return [slug, ...filtered].slice(0, 5);
    });
    router.push(`/dashboard/tools/${slug}`);
  };

  const favoriteToolObjects = getAllTools().filter((tool) =>
    favorites.includes(tool.slug)
  );

  const recentToolObjects = getAllTools().filter((tool) =>
    recentTools.includes(tool.slug)
  );

  return (
    <div className="space-y-10">
      {/* Search Header Banner */}
      <section className="relative rounded-3xl border border-border bg-card/40 p-6 md:p-10 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              Welcome to DevForge
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              What are we forging today?
            </h2>
            <p className="text-sm text-muted-foreground max-w-md">
              Access the ultimate developer toolkit. Instant formatting, decoding, and generators.
            </p>
          </div>

          <div className="w-full md:w-80 shrink-0">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              className="bg-background/80"
              placeholder="Search tools (e.g. JSON, UUID)..."
            />
          </div>
        </div>
      </section>

      {/* Conditional Search Results View */}
      {searchQuery ? (
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            Search Results ({filteredTools.length})
          </h3>
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.slug}
                  tool={tool}
                  isFavorite={favorites.includes(tool.slug)}
                  isRecentlyUsed={recentTools.includes(tool.slug)}
                  onFavoriteToggle={() => toggleFavorite(tool.slug)}
                  onClick={() => handleToolClick(tool.slug)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Search className="h-8 w-8 text-muted-foreground" />}
              title="No tools found"
              description={`We couldn't find any tools matching "${searchQuery}". Try searching for categories like formatting, encoding, or generators.`}
            />
          )}
        </section>
      ) : (
        <>
          {/* Dashboard Hub: Favorites, Recents, Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Favorites Widget */}
            <div className="rounded-2xl border border-border bg-card/30 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 text-primary" />
                  Favorites
                </h4>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {favoriteToolObjects.length} pinned
                </Badge>
              </div>
              {favoriteToolObjects.length > 0 ? (
                <div className="space-y-2">
                  {favoriteToolObjects.map((tool) => (
                    <button
                      key={tool.slug}
                      onClick={() => handleToolClick(tool.slug)}
                      className="w-full flex items-center justify-between rounded-xl p-2.5 bg-background/50 hover:bg-muted/50 border border-border/50 text-left transition-all"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-semibold text-foreground">{tool.name}</span>
                        <span className="text-[10px] text-muted-foreground">{tool.description}</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  No favorites pinned yet. Click the heart icon on any tool card.
                </div>
              )}
            </div>

            {/* Recently Used Widget */}
            <div className="rounded-2xl border border-border bg-card/30 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  Recently Used
                </h4>
              </div>
              {recentToolObjects.length > 0 ? (
                <div className="space-y-2">
                  {recentToolObjects.map((tool) => (
                    <button
                      key={tool.slug}
                      onClick={() => handleToolClick(tool.slug)}
                      className="w-full flex items-center justify-between rounded-xl p-2.5 bg-background/50 hover:bg-muted/50 border border-border/50 text-left transition-all"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-semibold text-foreground">{tool.name}</span>
                        <span className="text-[10px] text-muted-foreground">{tool.description}</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  No recently used tools yet. Start opening some tools.
                </div>
              )}
            </div>

            {/* Quick Tips & Resources */}
            <div className="rounded-2xl border border-border bg-card/30 p-5 space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-primary" />
                Featured Quick Start
              </h4>
              <div className="space-y-2.5">
                <div className="flex gap-3 text-xs">
                  <div className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    💡
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold text-foreground">Interactive Tab System</div>
                    <div className="text-[11px] text-muted-foreground leading-relaxed">
                      You can keep multiple tools open in tabs simultaneously, just like your browser.
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 text-xs">
                  <div className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    ⌨️
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold text-foreground">Command Palette</div>
                    <div className="text-[11px] text-muted-foreground leading-relaxed">
                      Press <kbd className="bg-muted px-1 rounded text-[10px]">Ctrl+K</kbd> anywhere to trigger the quick actions list.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Categories */}
          <section className="space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              Popular Categories
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {categories.slice(0, 6).map((cat) => {
                const categoryTools = getAllTools().filter((t) => t.category === cat.id);
                return (
                  <CategoryCard
                    key={cat.id}
                    category={cat}
                    toolCount={categoryTools.length}
                    onClick={() => {
                      alert(`Category "${cat.name}" selected.`);
                    }}
                  />
                );
              })}
            </div>
          </section>

          {/* Tool Grid (Divided by Categories) */}
          <section className="space-y-8">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Browse Tool Registry
              </h3>
              <Badge variant="secondary" className="text-[10px]">
                {getAllTools().length} tools registered
              </Badge>
            </div>

            {categories.map((cat) => {
              const categoryTools = getAllTools().filter((t) => t.category === cat.id);
              if (categoryTools.length === 0) return null;

              return (
                <div key={cat.id} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <h4 className="text-xs font-bold text-foreground tracking-wide uppercase">
                      {cat.name}
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {categoryTools.map((tool) => (
                      <ToolCard
                        key={tool.slug}
                        tool={tool}
                        isFavorite={favorites.includes(tool.slug)}
                        isRecentlyUsed={recentTools.includes(tool.slug)}
                        onFavoriteToggle={() => toggleFavorite(tool.slug)}
                        onClick={() => handleToolClick(tool.slug)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        </>
      )}
    </div>
  );
}
