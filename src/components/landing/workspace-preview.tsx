'use client';

import { motion } from 'framer-motion';

const tabs = ['JSON Formatter', 'Regex Tester', 'JWT Decoder', 'Docker'];

export function WorkspacePreview() {
  return (
    <section id="workspace" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl">
            Your Workspace, Your Way
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            Work on multiple tools simultaneously with tabs.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        >
          {/* Window chrome */}
          <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-destructive/60" />
              <div className="h-3 w-3 rounded-full bg-warning/60" />
              <div className="h-3 w-3 rounded-full bg-success/60" />
            </div>
            <div className="ml-4 flex items-center gap-1">
              {tabs.map((tab, i) => (
                <div
                  key={tab}
                  className={`rounded-lg px-3 py-1 text-[11px] font-medium ${
                    i === 0
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {tab}
                </div>
              ))}
            </div>
          </div>

          {/* Fake workspace content */}
          <div className="grid grid-cols-12 divide-x divide-border">
            {/* Sidebar */}
            <div className="col-span-3 hidden space-y-1 p-3 md:block">
              {['Home', 'Workspace', 'Collections', 'Pinned', 'Recent'].map((item) => (
                <div
                  key={item}
                  className={`rounded-lg px-3 py-1.5 text-[11px] ${
                    item === 'Workspace'
                      ? 'bg-primary/10 font-medium text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item}
                </div>
              ))}
              <div className="my-2 border-t border-border" />
              {['Formatting', 'Encoding', 'Generators', 'Docker'].map((cat) => (
                <div
                  key={cat}
                  className="rounded-lg px-3 py-1.5 text-[11px] text-muted-foreground"
                >
                  {cat}
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="col-span-12 p-4 md:col-span-9">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-primary/10" />
                <span className="text-sm font-semibold text-foreground">JSON Formatter</span>
                <span className="rounded-full bg-success/10 px-2 py-0.5 text-[9px] font-medium text-success">
                  Stable
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted/50 p-3">
                  <div className="mb-2 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">Input</div>
                  <div className="space-y-1">
                    {[1, 2, 3, 4, 5].map((l) => (
                      <div key={l} className="h-2.5 rounded bg-muted" style={{ width: `${50 + l * 8}%` }} />
                    ))}
                  </div>
                </div>
                <div className="rounded-xl bg-primary/5 p-3">
                  <div className="mb-2 text-[9px] font-medium uppercase tracking-wider text-primary">Output</div>
                  <div className="space-y-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((l) => (
                      <div key={l} className="h-2.5 rounded bg-primary/10" style={{ width: `${30 + l * 9}%` }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Status bar */}
              <div className="mt-3 flex items-center justify-between rounded-lg bg-muted/30 px-3 py-1.5">
                <span className="text-[9px] text-muted-foreground">UTF-8 • 256 chars</span>
                <span className="text-[9px] text-success">✓ Valid JSON</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
