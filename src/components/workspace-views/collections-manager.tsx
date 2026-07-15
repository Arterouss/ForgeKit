'use client';

import { useState } from 'react';
import {
  FolderOpen,
  Plus,
  Trash2,
  Folder,
  ExternalLink,
  Terminal,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWorkspace } from '@/components/workspace';
import { getAllTools } from '@/sdk/tool-registry';

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
    <div className="space-y-8 pb-12 font-mono select-none">
      {/* Header */}
      <div className="border-b-2 border-cyan-500/30 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-wider text-white flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <FolderOpen className="h-5 w-5" />
            </div>
            <span>TOOL_COLLECTIONS // CUSTOM KITS</span>
          </h1>
          <p className="text-xs text-cyan-200/70 mt-1 font-sans">
            Group your favorite utility modules into isolated domain kits (e.g., Incident Response Vault, SecOps Lab).
          </p>
        </div>
        <span className="rounded border border-cyan-400/50 bg-cyan-500/15 px-3 py-1 text-[10px] font-bold text-cyan-300 uppercase">
          TOTAL_KITS: {collections.length}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Collection Folders List & New Collection Form */}
        <div className="space-y-6">
          <div className="rounded-3xl border-2 border-cyan-500/30 bg-[#0c091f]/90 p-5 space-y-4 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-300 border-b border-cyan-500/20 pb-2.5 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-fuchsia-400" />
              <span>DOMAINS ({collections.length})</span>
            </h2>

            <div className="space-y-2">
              {collections.map((col) => {
                const isSelected = col.id === selectedColId;
                return (
                  <div
                    key={col.id}
                    onClick={() => setSelectedColId(col.id)}
                    className={`flex items-center justify-between rounded-xl border-2 p-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-500/20 text-white shadow-[0_0_15px_rgba(0,240,255,0.25)] scale-[1.01]'
                        : 'border-cyan-500/30 bg-[#070512] text-cyan-200/80 hover:border-cyan-400/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Folder
                        className={`h-5 w-5 shrink-0 ${
                          isSelected ? 'text-fuchsia-400' : 'text-cyan-400'
                        }`}
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-xs uppercase block truncate">
                          {col.name}
                        </span>
                        <span className="text-[10px] text-cyan-400/70 block truncate font-sans">
                          {col.toolSlugs.length} WASM modules
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCollection(col.id);
                      }}
                      className="rounded-lg p-1.5 text-cyan-400/60 hover:text-rose-400 transition-colors"
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
            className="rounded-3xl border-2 border-cyan-500/30 bg-[#0c091f]/90 p-5 space-y-3 shadow-sm"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 border-b border-cyan-500/20 pb-2">
              // CREATE_NEW_KIT
            </h3>
            <input
              type="text"
              placeholder="Kit Title (e.g. SRE Incident Kit)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-cyan-500/40 bg-[#070512] px-3.5 py-2 text-xs text-white placeholder:text-cyan-400/50 focus:border-cyan-300 focus:outline-none font-mono"
            />
            <input
              type="text"
              placeholder="Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-cyan-500/40 bg-[#070512] px-3.5 py-2 text-xs text-white placeholder:text-cyan-400/50 focus:border-cyan-300 focus:outline-none font-mono"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl border border-lime-400 bg-lime-500/20 px-4 py-2.5 text-xs font-bold text-lime-400 hover:bg-lime-500/30 transition w-full justify-center shadow-[0_0_12px_rgba(57,255,20,0.25)]"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              INITIALIZE_KIT
            </button>
          </form>
        </div>

        {/* Right Column: Active Collection Tools Display */}
        <div className="lg:col-span-2 rounded-3xl border-2 border-cyan-500/30 bg-[#0c091f]/90 p-6 sm:p-8 space-y-6 shadow-[0_0_30px_rgba(0,240,255,0.15)] min-h-[500px]">
          {activeCollection ? (
            <>
              <div className="border-b border-cyan-500/30 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-heading font-black uppercase text-white tracking-wide">
                    {activeCollection.name}
                  </h2>
                  <p className="text-xs text-cyan-200/70 mt-0.5 font-sans">
                    {activeCollection.description || 'Custom collection of sandboxed DevForge WASM tools'}
                  </p>
                </div>
                <span className="rounded bg-cyan-500/15 border border-cyan-400/40 px-2.5 py-1 text-[10px] font-bold text-cyan-300 uppercase">
                  ACTIVE_MODULES: {activeCollection.toolSlugs.length}
                </span>
              </div>

              {activeCollection.toolSlugs.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-cyan-500/30 p-16 text-center text-cyan-400/70 text-xs font-mono space-y-2">
                  <FolderOpen className="h-8 w-8 text-fuchsia-400 mx-auto opacity-70" />
                  <p className="font-bold uppercase">NO WASM TOOLS ATTACHED TO THIS KIT YET</p>
                  <p className="text-[11px] font-sans text-cyan-200/60 max-w-sm mx-auto">
                    Open any tool module or tool card and select &quot;Add to Collection&quot; to populate this domain folder.
                  </p>
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
                        className="flex flex-col justify-between rounded-2xl border-2 border-cyan-500/30 bg-[#070512] p-5 cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-2.5">
                            <span className="font-bold text-white text-xs uppercase tracking-wide">
                              {tool.name}
                            </span>
                            <ExternalLink className="h-3.5 w-3.5 text-lime-400" />
                          </div>
                          <p className="text-xs text-cyan-200/70 line-clamp-2 font-sans">
                            {tool.description}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-cyan-500/20 pt-2.5">
                          <span className="rounded bg-cyan-500/15 border border-cyan-400/40 px-2 py-0.5 text-[9px] font-bold text-cyan-300 uppercase">
                            {tool.category}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeToolFromCollection(activeCollection.id, slug);
                            }}
                            className="text-xs text-rose-400 hover:underline font-bold"
                          >
                            DETACH [X]
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="p-16 text-center text-cyan-400/70 text-xs font-mono">
              Select or initialize a domain kit on the left to inspect and launch its assigned WASM modules.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
