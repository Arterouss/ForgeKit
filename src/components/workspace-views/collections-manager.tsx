'use client';

import { useState } from 'react';
import {
  FolderOpen,
  Plus,
  Trash2,
  Folder,
  ExternalLink,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWorkspace } from '@/components/workspace';
import { getAllTools } from '@/sdk/tool-registry';
import { Badge } from '@/components/ui/badge';

export function CollectionsManagerView() {
  const router = useRouter();
  const { collections, createCollection, deleteCollection, removeToolFromCollection } = useWorkspace();
  const allTools = getAllTools();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColId, setSelectedColId] = useState<string | null>(
    collections[0]?.id ?? null
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createCollection(name, description, 'Folder');
    setName('');
    setDescription('');
  };

  const activeCollection = collections.find((c) => c.id === selectedColId);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <FolderOpen className="h-6 w-6 text-primary" />
          Tool Collections & Custom Kits Manager
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Group your favorite developer tools into custom functional kits (e.g., DevOps Toolkit, Incident Response Kit).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Collection Folders List & New Collection Form */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card/40 p-5 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Your Collections ({collections.length})
            </h2>

            <div className="space-y-2">
              {collections.map((col) => {
                const isSelected = col.id === selectedColId;
                return (
                  <div
                    key={col.id}
                    onClick={() => setSelectedColId(col.id)}
                    className={`flex items-center justify-between rounded-xl border p-3.5 cursor-pointer transition ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-background/50 hover:border-border/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Folder
                        className={`h-5 w-5 shrink-0 ${
                          isSelected ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      />
                      <div className="min-w-0">
                        <span className="font-semibold text-sm text-foreground block truncate">
                          {col.name}
                        </span>
                        <span className="text-xs text-muted-foreground block truncate">
                          {col.toolSlugs.length} tools grouped
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCollection(col.id);
                      }}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
                      title="Delete collection"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* New Collection Form */}
          <form
            onSubmit={handleCreate}
            className="rounded-2xl border border-border bg-card/40 p-5 space-y-3"
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Create New Collection
            </h3>
            <input
              type="text"
              placeholder="Collection Name (e.g. SRE Incident Kit)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition w-full justify-center"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Collection Folder
            </button>
          </form>
        </div>

        {/* Right Column: Active Collection Tools Display */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card/40 p-6 space-y-6">
          {activeCollection ? (
            <>
              <div className="border-b border-border pb-4">
                <h2 className="text-xl font-bold text-foreground">
                  {activeCollection.name}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {activeCollection.description || 'Custom collection of DevForge tools'}
                </p>
              </div>

              {activeCollection.toolSlugs.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground text-sm">
                  No tools added to this collection yet. You can add tools from the main dashboard or tool cards.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeCollection.toolSlugs.map((slug) => {
                    const tool = allTools.find((t) => t.slug === slug);
                    if (!tool) return null;
                    return (
                      <div
                        key={slug}
                        onClick={() => router.push(`/dashboard/tools/${slug}`)}
                        className="flex flex-col justify-between rounded-xl border border-border bg-background/60 p-4 cursor-pointer hover:border-primary/50 transition"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-foreground text-sm">
                              {tool.name}
                            </span>
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {tool.description}
                          </p>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <Badge variant="secondary" className="text-[10px]">
                            {tool.category}
                          </Badge>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeToolFromCollection(activeCollection.id, slug);
                            }}
                            className="text-xs text-rose-400 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center text-muted-foreground text-sm">
              Select or create a collection on the left to inspect its tools.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
