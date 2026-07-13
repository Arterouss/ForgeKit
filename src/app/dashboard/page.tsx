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
  FolderKanban,
  Zap,
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
import { useWorkspace } from '@/components/workspace';

// Initialize registry once when the module loads
initializeRegistry();

export default function DashboardPage() {
  const router = useRouter();
  const { favorites, toggleFavorite, historyItems, dashboardWidgets } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState('');

  // Compute filtered tools dynamically
  const filteredTools = searchQuery ? searchTools(searchQuery) : getAllTools();

  const handleToolClick = (slug: string) => {
    router.push(`/dashboard/tools/${slug}`);
  };

  const favoriteToolObjects = getAllTools().filter((tool) =>
    favorites.includes(tool.slug)
  );

  const recentToolNames = historyItems.map((h) => h.toolName);
  const recentToolObjects = getAllTools()
    .filter(
      (tool) =>
        recentToolNames.includes(tool.name) || recentToolNames.includes(tool.slug)
    )
    .slice(0, 4);

  return (
    <div className="space-y-12 pb-16">
      {/* Search & Hero Banner */}
      <section className="relative rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/70 to-primary/5 p-7 md:p-12 shadow-xl overflow-hidden">
        {/* Glow & Ambient Background Effects */}
        <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-secondary/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>DEVFORGE WORKSPACE v1.0.0</span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              What are we forging today?
            </h1>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Access 60 instant developer tools running 100% locally in your browser. Search, format, decode, generate, or inspect anything in milliseconds.
            </p>
          </div>

          <div className="w-full lg:w-96 shrink-0 space-y-2">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              className="bg-background/90 shadow-lg border-border/80"
              placeholder="Search tools (e.g. JSON, UUID, JWT)..."
            />
            <div className="flex items-center justify-between px-1 text-[11px] text-muted-foreground">
              <span>Press <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">Ctrl + K</kbd> anywhere</span>
              <span>{getAllTools().length} tools available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Conditional Search Results View */}
      {searchQuery ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h2 className="text-base font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Search className="h-4.5 w-4.5 text-primary" />
              Search Results ({filteredTools.length})
            </h2>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Clear search
            </button>
          </div>

          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.slug}
                  tool={tool}
                  isFavorite={favorites.includes(tool.slug)}
                  isRecentlyUsed={
                    recentToolNames.includes(tool.name) ||
                    recentToolNames.includes(tool.slug)
                  }
                  onFavoriteToggle={() => toggleFavorite(tool.slug)}
                  onClick={() => handleToolClick(tool.slug)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Search className="h-8 w-8 text-muted-foreground" />}
              title="No matching tools found"
              description={`We couldn't find any tools matching "${searchQuery}". Try searching for terms like JSON, Base64, Regex, Docker, or Git.`}
            />
          )}
        </section>
      ) : (
        <>
          {/* Dashboard Hub: Favorites, Recents, Quick Start */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Favorites Widget */}
            {dashboardWidgets.showFavorites && (
              <div className="flex flex-col rounded-2xl border border-border/70 bg-card/40 p-6 space-y-4 shadow-sm hover:border-border transition-all">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Star className="h-3.5 w-3.5" />
                    </div>
                    Favorites
                  </h3>
                  <Badge variant="outline" className="text-[10px] font-semibold">
                    {favoriteToolObjects.length} pinned
                  </Badge>
                </div>

                {favoriteToolObjects.length > 0 ? (
                  <div className="space-y-2.5">
                    {favoriteToolObjects.map((tool) => (
                      <button
                        key={tool.slug}
                        onClick={() => handleToolClick(tool.slug)}
                        className="group w-full flex items-center justify-between rounded-xl p-3 bg-background/60 hover:bg-muted/60 border border-border/50 hover:border-primary/30 text-left transition-all"
                      >
                        <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                          <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                            {tool.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground truncate">
                            {tool.description}
                          </span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                    <Star className="h-8 w-8 text-muted-foreground/30 mb-2" />
                    <p className="text-xs font-medium text-foreground">No pinned favorites</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Click the heart icon on any tool card to pin it here.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Recently Used Widget */}
            {dashboardWidgets.showRecent && (
              <div className="flex flex-col rounded-2xl border border-border/70 bg-card/40 p-6 space-y-4 shadow-sm hover:border-border transition-all">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Clock className="h-3.5 w-3.5" />
                    </div>
                    Recently Used
                  </h3>
                  <Badge variant="outline" className="text-[10px] font-semibold">
                    {recentToolObjects.length} tools
                  </Badge>
                </div>

                {recentToolObjects.length > 0 ? (
                  <div className="space-y-2.5">
                    {recentToolObjects.map((tool) => (
                      <button
                        key={tool.slug}
                        onClick={() => handleToolClick(tool.slug)}
                        className="group w-full flex items-center justify-between rounded-xl p-3 bg-background/60 hover:bg-muted/60 border border-border/50 hover:border-primary/30 text-left transition-all"
                      >
                        <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                          <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                            {tool.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground truncate">
                            {tool.description}
                          </span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                    <Clock className="h-8 w-8 text-muted-foreground/30 mb-2" />
                    <p className="text-xs font-medium text-foreground">No recent activity</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Tools you run will automatically appear here.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Featured Quick Start Widget */}
            <div className="flex flex-col rounded-2xl border border-border/70 bg-card/40 p-6 space-y-4 shadow-sm hover:border-border transition-all">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="h-3.5 w-3.5" />
                </div>
                Quick Start & Tips
              </h3>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3.5 rounded-xl border border-border/50 bg-background/40 p-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-foreground">Multi-Tab Workflows</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Keep multiple tools open simultaneously in browser tabs at the top of your screen.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-xl border border-border/50 bg-background/40 p-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FolderKanban className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-foreground">Command Palette</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Press <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">Ctrl+K</kbd> anywhere to switch themes or launch any tool.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Categories Grid */}
          {dashboardWidgets.showCategories && (
            <section className="space-y-5">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Explore Tool Categories
                </h2>
                <button
                  onClick={() => router.push('/dashboard/collections')}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>View collections</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((cat) => {
                  const categoryTools = getAllTools().filter(
                    (t) => t.category === cat.id
                  );
                  return (
                    <CategoryCard
                      key={cat.id}
                      category={cat}
                      toolCount={categoryTools.length}
                      onClick={() => {
                        const firstTool = categoryTools[0];
                        if (firstTool) {
                          handleToolClick(firstTool.slug);
                        }
                      }}
                    />
                  );
                })}
              </div>
            </section>
          )}

          {/* Tool Registry Grid Grouped by Category */}
          {dashboardWidgets.showAllTools && (
            <section className="space-y-10 pt-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="space-y-1">
                  <h2 className="text-base font-extrabold text-foreground tracking-tight uppercase">
                    Browse Complete Tool Registry
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    All tools are instant, client-side, and ready to forge.
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs font-semibold px-3 py-1">
                  {getAllTools().length} tools registered
                </Badge>
              </div>

              {categories.map((cat) => {
                const categoryTools = getAllTools().filter(
                  (t) => t.category === cat.id
                );
                if (categoryTools.length === 0) return null;

                return (
                  <div key={cat.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="h-3 w-3 rounded-full shadow-sm"
                          style={{ backgroundColor: cat.color }}
                        />
                        <h3 className="text-sm font-bold text-foreground tracking-wide uppercase">
                          {cat.name}
                        </h3>
                        <Badge variant="outline" className="text-[10px] font-semibold">
                          {categoryTools.length} tools
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground hidden sm:inline">
                        {cat.description}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {categoryTools.map((tool) => (
                        <ToolCard
                          key={tool.slug}
                          tool={tool}
                          isFavorite={favorites.includes(tool.slug)}
                          isRecentlyUsed={
                            recentToolNames.includes(tool.name) ||
                            recentToolNames.includes(tool.slug)
                          }
                          onFavoriteToggle={() => toggleFavorite(tool.slug)}
                          onClick={() => handleToolClick(tool.slug)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>
          )}
        </>
      )}
    </div>
  );
}
