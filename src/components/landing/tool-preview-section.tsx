'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const tabs = ['JSON Formatter', 'JWT Decoder', 'Dockerfile Gen', 'Regex Tester'];

const previews: Record<string, { input: string; output: string }> = {
  'JSON Formatter': {
    input: '{"name":"DevForge","version":"0.3.0","features":["formatting","encoding","generators"],"config":{"theme":"dark","lang":"en"}}',
    output: `{
  "name": "DevForge",
  "version": "0.3.0",
  "features": [
    "formatting",
    "encoding",
    "generators"
  ],
  "config": {
    "theme": "dark",
    "lang": "en"
  }
}`,
  },
  'JWT Decoder': {
    input: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldi BGb3JnZSIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    output: `Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "sub": "1234567890",
  "name": "DevForge",
  "iat": 1516239022
}`,
  },
  'Dockerfile Gen': {
    input: `Framework: Next.js
Node: 22-alpine
Package Manager: pnpm
Port: 3000`,
    output: `FROM node:22-alpine AS base
RUN corepack enable

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]`,
  },
  'Regex Tester': {
    input: `Pattern: /\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b/gi

Test String:
Contact us at hello@devforge.dev
or support@devforge.dev`,
    output: `✓ 2 matches found

Match 1: hello@devforge.dev
  Index: 14-32

Match 2: support@devforge.dev
  Index: 37-57`,
  },
};

export function ToolPreviewSection() {
  const [activeTab, setActiveTab] = useState('JSON Formatter');

  return (
    <section id="preview" className="relative z-10 px-4 py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl">
            See It in Action
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            Every tool works instantly. No setup, no config.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        >
          {/* Tab bar */}
          <div className="flex items-center gap-1 border-b border-border bg-muted/30 px-3 py-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activePreviewTab"
                    className="absolute inset-0 rounded-lg bg-primary/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative">{tab}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Input */}
            <div className="border-b border-border p-4 md:border-b-0 md:border-r">
              <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Input
              </div>
              <motion.pre
                key={`input-${activeTab}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="overflow-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground/80"
                style={{ minHeight: '180px' }}
              >
                {previews[activeTab].input}
              </motion.pre>
            </div>

            {/* Output */}
            <div className="p-4">
              <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-primary">
                Output
              </div>
              <motion.pre
                key={`output-${activeTab}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="overflow-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-primary/90"
                style={{ minHeight: '180px' }}
              >
                {previews[activeTab].output}
              </motion.pre>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
