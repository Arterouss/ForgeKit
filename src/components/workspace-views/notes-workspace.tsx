'use client';

import { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  Trash2,
  Edit3,
  Terminal,
} from 'lucide-react';
import { useWorkspace } from '@/components/workspace';

export function NotesWorkspaceView() {
  const { notes, setNotes } = useWorkspace();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'split' | 'edit' | 'preview'>(
    'split'
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([notes], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devforge-notes-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setNotes('# CYBER_DECK // PERSISTENT NOTES\n\n> Buffer cleared. Ready for input...\n');
  };

  return (
    <div className="space-y-6 pb-12 font-mono select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b-2 border-cyan-500/30 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-wider text-white flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <FileText className="h-5 w-5" />
            </div>
            <span>PERSISTENT_SCRATCHPAD // MARKDOWN LAB</span>
          </h1>
          <p className="text-xs text-cyan-200/70 mt-1 font-sans">
            Persistent local markdown scratchpad automatically synced and encrypted inside your workstation session.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="rounded border border-lime-400/50 bg-lime-500/15 px-3 py-1 text-[10px] font-bold text-lime-400 uppercase shadow-[0_0_10px_rgba(57,255,20,0.2)]">
            SYNCED: INDEXED_DB
          </span>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400 bg-cyan-500/20 px-3.5 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 transition shadow-sm"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-lime-400 stroke-[3]" />
                <span className="text-lime-400 font-extrabold">COPIED_MD</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>COPY_MD</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-xl border border-lime-400 bg-lime-500/20 px-3.5 py-2 text-xs font-bold text-lime-400 hover:bg-lime-500/30 transition shadow-[0_0_12px_rgba(57,255,20,0.25)]"
          >
            <Download className="h-3.5 w-3.5" />
            EXPORT_.MD
          </button>
          <button
            onClick={handleClear}
            className="rounded-xl border border-rose-400 bg-rose-500/15 p-2 text-rose-400 hover:bg-rose-500/25 transition shadow-sm"
            title="Clear Scratchpad Buffer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editor / Preview Toolbar */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
        <div className="flex gap-2 bg-[#0c091f] p-1 rounded-xl border border-cyan-500/30">
          <button
            onClick={() => setActiveTab('split')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'split'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-sm'
                : 'text-cyan-400/60 hover:text-white'
            }`}
          >
            SPLIT_VIEW
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'edit'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-sm'
                : 'text-cyan-400/60 hover:text-white'
            }`}
          >
            EDIT_BUFFER
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'preview'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-sm'
                : 'text-cyan-400/60 hover:text-white'
            }`}
          >
            LIVE_PREVIEW
          </button>
        </div>
      </div>

      {/* Split or Single View */}
      <div
        className={`grid gap-6 ${
          activeTab === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {(activeTab === 'split' || activeTab === 'edit') && (
          <div className="flex flex-col rounded-3xl border-2 border-cyan-500/30 bg-[#0c091f]/90 shadow-[0_0_25px_rgba(0,240,255,0.15)] overflow-hidden">
            <div className="border-b border-cyan-500/30 px-5 py-3 text-xs font-bold text-cyan-300 flex items-center justify-between bg-[#070512]">
              <span className="flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-fuchsia-400" />
                <span>// MARKDOWN_EDITOR_BUFFER</span>
              </span>
              <span className="text-[10px] text-cyan-400/60">UTF-8 // RAW</span>
            </div>
            <textarea
              rows={22}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full flex-1 bg-transparent p-5 font-mono text-xs text-lime-300 placeholder:text-cyan-400/50 focus:outline-none leading-relaxed resize-none"
              placeholder="> Write markdown scratchpad notes here..."
            />
          </div>
        )}

        {(activeTab === 'split' || activeTab === 'preview') && (
          <div className="flex flex-col rounded-3xl border-2 border-cyan-500/30 bg-[#0c091f]/90 shadow-[0_0_25px_rgba(0,240,255,0.15)] overflow-hidden">
            <div className="border-b border-cyan-500/30 px-5 py-3 text-xs font-bold text-cyan-300 flex items-center justify-between bg-[#070512]">
              <span className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-lime-400" />
                <span>// RENDERED_PREVIEW_OUTPUT</span>
              </span>
              <span className="text-[10px] text-lime-400 font-bold">AST: OK</span>
            </div>
            <div className="flex-1 p-6 overflow-y-auto font-sans text-xs text-cyan-100 leading-relaxed space-y-3 whitespace-pre-wrap">
              {notes || (
                <span className="text-cyan-400/50 font-mono">// Preview buffer idle. Type markdown on the left to render...</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
