'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  Sparkles,
  Braces,
  FileCode,
  Regex,
  Key,
  Database,
  Globe,
  Terminal,
  Wrench,
} from 'lucide-react';
import { getAllTools } from '@/sdk/tool-registry';
import { categories } from '@/constants/categories';
import { ToolCard } from '@/components/ui/tool-card';
import { SearchBar } from '@/components/ui/search-bar';
import { EmptyState } from '@/components/ui/empty-state';
import { useWorkspace } from '@/components/workspace';

function getCategoryLucideIcon(categoryId: string, className?: string) {
  switch (categoryId) {
    case 'formatting':
      return <Braces className={className} />;
    case 'encoding':
      return <FileCode className={className} />;
    case 'generators':
      return <Sparkles className={className} />;
    case 'regex':
      return <Regex className={className} />;
    case 'crypto':
      return <Key className={className} />;
    case 'sql':
      return <Database className={className} />;
    case 'network':
      return <Globe className={className} />;
    case 'devops':
      return <Terminal className={className} />;
    case 'api':
      return <FileCode className={className} />;
    default:
      return <Wrench className={className} />;
  }
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { favorites, toggleFavorite, historyItems } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState('');

  const slug = typeof params?.slug === 'string' ? params.slug : '';
  const categoryDef = categories.find((c) => c.id === slug) || {
    id: slug,
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    description: `Sandboxed WASM developer modules and utilities for ${slug}.`,
    color: '#00F5FF',
    icon: 'Wrench',
  };

  const categoryTools = getAllTools().filter((tool) => tool.category === slug);
  const filteredTools = searchQuery
    ? categoryTools.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : categoryTools;

  const recentToolNames = historyItems.map((h) => h.toolName);

  return (
    <div className="space-y-8 pb-16 font-mono select-none">
      {/* Back & Category Header */}
      <div className="space-y-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-[#0c091f] px-4 py-2 text-xs font-bold text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-white transition-all shadow-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5 stroke-[3]" />
          <span>RETURN TO COMMAND HUD</span>
        </button>

        <section className="relative rounded-3xl border-2 border-cyan-500/40 bg-[#0c091f]/95 p-7 md:p-10 shadow-[0_0_35px_rgba(0,240,255,0.2)] overflow-hidden">
          <div
            className="absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-25 pointer-events-none"
            style={{ backgroundColor: categoryDef.color }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-cyan-400 bg-cyan-500/20 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                style={{
                  color: categoryDef.color,
                }}
              >
                {getCategoryLucideIcon(categoryDef.id, 'h-8 w-8 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]')}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-heading text-2xl md:text-4xl font-black text-white tracking-wider uppercase">
                    {categoryDef.name}
                  </h1>
                  <span className="rounded bg-fuchsia-500/20 border border-fuchsia-400 px-3 py-1 text-xs font-bold text-fuchsia-300 uppercase shadow-[0_0_12px_rgba(255,0,127,0.3)]">
                    {categoryTools.length} WASM MODULES
                  </span>
                </div>
                <p className="text-xs text-cyan-200/80 max-w-2xl font-sans leading-relaxed">
                  {categoryDef.description}
                </p>
              </div>
            </div>

            <div className="w-full lg:w-96 shrink-0">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={`> filter_${categoryDef.id} --query...`}
                className="bg-[#070512]/90 border-cyan-500/50 shadow-md"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              onClick={() => router.push(`/dashboard/tools/${tool.slug}`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Search className="h-10 w-10 text-fuchsia-400 animate-pulse" />}
          title="NO DOMAIN MODULES MATCHED FILTER"
          description={
            searchQuery
              ? `No sandboxed tools matching "${searchQuery}" in ${categoryDef.name}.`
              : `No modules currently mounted inside domain "${slug}".`
          }
        />
      )}
    </div>
  );
}
