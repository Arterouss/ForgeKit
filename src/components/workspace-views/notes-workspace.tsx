'use client';

import { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  Trash2,
  Eye,
  Edit3,
} from 'lucide-react';
import { useWorkspace } from '@/components/workspace';
import { Badge } from '@/components/ui/badge';

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
    setNotes('# DevForge Notes\n\n');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Developer Notes & Scratchpad
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Persistent local markdown scratchpad automatically synced across your workspace sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Autosaved to LocalStorage
          </Badge>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied Markdown</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition"
          >
            <Download className="h-3.5 w-3.5" />
            Download .md
          </button>
          <button
            onClick={handleClear}
            className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2 text-rose-400 hover:bg-rose-500/20 transition"
            title="Clear Scratchpad"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editor / Preview Toolbar */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('split')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === 'split'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === 'edit'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            Edit Markdown
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === 'preview'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            Live Preview
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
          <div className="flex flex-col rounded-2xl border border-border bg-card/40">
            <div className="border-b border-border px-4 py-2.5 text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Edit3 className="h-3.5 w-3.5 text-primary" />
              Markdown Editor
            </div>
            <textarea
              rows={22}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full flex-1 rounded-b-2xl bg-transparent p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              placeholder="Write your markdown developer notes here..."
            />
          </div>
        )}

        {(activeTab === 'split' || activeTab === 'preview') && (
          <div className="flex flex-col rounded-2xl border border-border bg-card/40">
            <div className="border-b border-border px-4 py-2.5 text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-primary" />
              Formatted Live Preview
            </div>
            <div className="prose prose-invert max-w-none p-6 text-sm text-foreground overflow-y-auto max-h-[520px] whitespace-pre-wrap font-sans">
              {notes || 'No content written yet.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
