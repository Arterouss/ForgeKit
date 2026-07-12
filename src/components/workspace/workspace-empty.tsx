'use client';

import {
  Braces,
  Regex,
  Key,
  Database,
  FileCode,
  Globe,
  Sparkles,
  Keyboard,
  ArrowRight,
} from 'lucide-react';
import { useWorkspace } from './workspace-context';

const POPULAR_TOOLS = [
  {
    id: 'json-formatter',
    title: 'JSON Formatter Pro',
    description: 'Format, validate, minify, and inspect JSON structures with tree view.',
    category: 'Formatters',
    icon: Braces,
    href: '/dashboard/tools/json-formatter',
  },
  {
    id: 'regex-tester',
    title: 'Regex Tester & Debugger',
    description: 'Real-time regular expression evaluation with match highlighting & explanation.',
    category: 'Text',
    icon: Regex,
    href: '/dashboard/tools/regex-tester',
  },
  {
    id: 'jwt-decoder',
    title: 'JWT Token Inspector',
    description: 'Decode and inspect header, payload, and signature claims instantly.',
    category: 'Security',
    icon: Key,
    href: '/dashboard/tools/jwt-decoder',
  },
  {
    id: 'sql-formatter',
    title: 'SQL Formatter & Validator',
    description: 'Beautify messy queries for PostgreSQL, MySQL, and SQLite.',
    category: 'Formatters',
    icon: Database,
    href: '/dashboard/tools/sql-formatter',
  },
  {
    id: 'base64-encoder',
    title: 'Base64 String & File Studio',
    description: 'Encode and decode Base64 strings, images, and raw binary payloads.',
    category: 'Encoding',
    icon: FileCode,
    href: '/dashboard/tools/base64-encoder',
  },
  {
    id: 'curl-builder',
    title: 'HTTP cURL Builder',
    description: 'Construct cURL commands with headers, body, and auth parameters.',
    category: 'Network',
    icon: Globe,
    href: '/dashboard/tools/curl-builder',
  },
];

export function WorkspaceEmpty() {
  const { openTab } = useWorkspace();

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-10 overflow-y-auto">
      <div className="mx-auto max-w-4xl w-full space-y-8 text-center">
        {/* Header badge & title */}
        <div className="flex flex-col items-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>DevForge Workspace Engine</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            No Active Tool Tab Open
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Launch a tool from the quick grid below or press <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">Ctrl+K</kbd> to search all 40+ developer tools.
          </p>
        </div>

        {/* Popular Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
          {POPULAR_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() =>
                  openTab({
                    id: tool.id,
                    title: tool.title,
                    category: tool.category,
                    href: tool.href,
                  })
                }
                className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card/60 p-4 transition-all hover:border-primary/50 hover:bg-card hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {tool.category}
                    </span>
                  </div>
                  <h3 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-80 group-hover:opacity-100 transition-opacity">
                  <span>Open Tool</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="mx-auto max-w-xl rounded-xl border border-border/60 bg-muted/20 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground mb-3">
            <Keyboard className="h-4 w-4 text-primary" />
            <span>Workspace Power Shortcuts</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
            <div className="flex items-center justify-between rounded-lg border border-border/40 bg-background/50 px-3 py-2">
              <span>Command Search</span>
              <kbd className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">Ctrl + K</kbd>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/40 bg-background/50 px-3 py-2">
              <span>Switch Tabs</span>
              <kbd className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">Ctrl + Tab</kbd>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/40 bg-background/50 px-3 py-2">
              <span>Close Tab</span>
              <kbd className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">Ctrl + W</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
