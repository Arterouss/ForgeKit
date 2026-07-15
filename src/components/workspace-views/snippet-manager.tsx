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
  Terminal,
} from 'lucide-react';
import { useWorkspace } from '@/components/workspace';

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
    <div className="space-y-8 pb-12 font-mono select-none">
      {/* Header */}
      <div className="border-b-2 border-cyan-500/30 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-wider text-white flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Code2 className="h-5 w-5" />
            </div>
            <span>SNIPPET_VAULT // PAYLOAD LIBRARY</span>
          </h1>
          <p className="text-xs text-cyan-200/70 mt-1 font-sans">
            Store, search, and instant-copy reusable code snippets, JWT payloads, regex matches, and config blueprints.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-400" />
          <input
            type="text"
            placeholder="> search_payloads..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border-2 border-cyan-500/40 bg-[#070512] pl-10 pr-4 py-2 text-xs text-cyan-100 placeholder:text-cyan-400/50 focus:border-cyan-300 focus:outline-none font-mono shadow-[0_0_10px_rgba(0,240,255,0.15)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Create Snippet Form */}
        <form
          onSubmit={handleCreate}
          className="rounded-3xl border-2 border-cyan-500/30 bg-[#0c091f]/90 p-6 space-y-4 shadow-[0_0_25px_rgba(0,240,255,0.15)]"
        >
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-300 border-b border-cyan-500/20 pb-2.5 flex items-center gap-2">
            <Terminal className="h-4 w-4 text-fuchsia-400" />
            <span>// SAVE_NEW_PAYLOAD</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-white mb-1.5 uppercase">
              Snippet Title
            </label>
            <input
              type="text"
              placeholder="e.g. Standard REST Error JSON"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-cyan-500/40 bg-[#070512] px-3.5 py-2 text-xs text-white placeholder:text-cyan-400/50 focus:border-cyan-300 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white mb-1.5 uppercase">
              Language / Format
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-xl border border-cyan-500/40 bg-[#070512] px-3.5 py-2 text-xs text-white focus:border-cyan-300 focus:outline-none font-mono"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-white mb-1.5 uppercase">
              Payload Content
            </label>
            <textarea
              rows={8}
              placeholder='{\n  "error": "Unauthorized",\n  "status": 401\n}'
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full font-mono text-xs rounded-xl border border-cyan-500/40 bg-[#070512] px-3.5 py-2 text-lime-300 placeholder:text-cyan-400/50 focus:border-cyan-300 focus:outline-none leading-relaxed"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl border border-lime-400 bg-lime-500/20 px-4 py-2.5 text-xs font-bold text-lime-400 hover:bg-lime-500/30 transition w-full justify-center shadow-[0_0_12px_rgba(57,255,20,0.25)]"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            COMMIT_TO_VAULT
          </button>
        </form>

        {/* Right Column: Snippets List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredSnippets.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-cyan-500/30 p-16 text-center space-y-3 bg-[#0c091f]/60">
              <FileCode className="h-10 w-10 text-fuchsia-400 mx-auto opacity-70 animate-pulse" />
              <h3 className="font-heading text-lg font-black text-white uppercase">NO SNIPPETS FOUND IN VAULT</h3>
              <p className="text-xs text-cyan-200/70 max-w-md mx-auto font-sans">
                Save your first payload blueprint using the terminal form on the left.
              </p>
            </div>
          ) : (
            filteredSnippets.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl border-2 border-cyan-500/30 bg-[#0c091f]/90 p-5 space-y-3 hover:border-cyan-400 transition-all shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-white text-sm uppercase">
                      {s.title}
                    </span>
                    <span className="rounded bg-cyan-500/15 border border-cyan-400/40 px-2 py-0.5 text-[10px] uppercase text-cyan-300 font-bold">
                      {s.language}
                    </span>
                    <span className="text-[10px] text-cyan-400/70">
                      // {s.createdAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(s.id, s.code)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400 bg-cyan-500/20 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 transition shadow-sm"
                    >
                      {copiedId === s.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-lime-400 stroke-[3]" />
                          <span className="text-lime-400 font-extrabold">COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>COPY</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => deleteSnippet(s.id)}
                      className="rounded-xl border border-cyan-500/30 bg-[#070512] p-2 text-cyan-400 hover:border-rose-400 hover:text-rose-400 transition"
                      title="Delete snippet"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <pre className="overflow-x-auto rounded-xl border border-cyan-500/20 bg-[#070512] p-4 text-xs font-mono text-lime-300 leading-relaxed">
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
