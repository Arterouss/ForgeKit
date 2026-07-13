'use client';

import { useState } from 'react';
import {
  Code2,
  Plus,
  Trash2,
  Copy,
  Check,
  Search,
  FileCode,
} from 'lucide-react';
import { useWorkspace } from '@/components/workspace';
import { Badge } from '@/components/ui/badge';

const LANGUAGES = ['json', 'regex', 'bash', 'dockerfile', 'yaml', 'sql', 'typescript'];

export function SnippetManagerView() {
  const { snippets, addSnippet, deleteSnippet } = useWorkspace();

  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('json');
  const [code, setCode] = useState('');
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;
    addSnippet(title, language, code);
    setTitle('');
    setCode('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSnippets = query
    ? snippets.filter(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.language.toLowerCase().includes(query.toLowerCase()) ||
          s.code.toLowerCase().includes(query.toLowerCase())
      )
    : snippets;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            Global Snippet Manager
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Store, search, and copy reusable code snippets, API payloads, and config templates.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search snippets..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Create Snippet Form */}
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-border bg-card/40 p-6 space-y-4"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Plus className="h-4 w-4 text-primary" />
            Save New Snippet
          </h2>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Snippet Title
            </label>
            <input
              type="text"
              placeholder="e.g. Standard REST Error Response"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Language / Format
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Code / Payload Content
            </label>
            <textarea
              rows={8}
              placeholder='{\n  "error": "Unauthorized"\n}'
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full font-mono text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition w-full justify-center"
          >
            <Plus className="h-4 w-4" />
            Save to Snippet Library
          </button>
        </form>

        {/* Right Column: Snippets List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredSnippets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-16 text-center space-y-3">
              <FileCode className="h-8 w-8 text-muted-foreground mx-auto" />
              <h3 className="font-semibold text-foreground">No Snippets Found</h3>
              <p className="text-sm text-muted-foreground">
                Save your first snippet using the form on the left.
              </p>
            </div>
          ) : (
            filteredSnippets.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl border border-border bg-card/40 p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-semibold text-foreground text-sm">
                      {s.title}
                    </span>
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {s.language}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {s.createdAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(s.id, s.code)}
                      className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted/80 transition"
                    >
                      {copiedId === s.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => deleteSnippet(s.id)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
                      title="Delete snippet"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <pre className="overflow-x-auto rounded-xl border border-border bg-background/80 p-3.5 text-xs font-mono text-foreground">
                  <code>{s.code}</code>
                </pre>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
