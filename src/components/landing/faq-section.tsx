'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Terminal } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'HOW DOES DEVFORGE EXECUTE 60+ TOOLS LOCALLY INSIDE THE BROWSER?',
    answer:
      'DevForge compiles critical algorithms (JSON AST parsing, JWT cryptographic validation, Argon2 hashing, and syntax compilation) into WebAssembly (WASM) workers and client-side bundles. No data payload ever leaves your browser window.',
  },
  {
    question: 'CAN I RUN DEVFORGE OFFLINE OR INSIDE AN AIR-GAPPED SECURITY ZONE?',
    answer:
      'Yes. Once initialized, DevForge registers an offline Service Worker that caches the full workstation asset tree. You can disconnect from the internet or run inside high-security enterprise air-gapped networks.',
  },
  {
    question: 'IS DEVFORGE FREE AND OPEN-SOURCE TO INSPECT?',
    answer:
      'Yes! DevForge is 100% open-source under an MIT-compatible license. You can inspect every line of code, host it on your private servers, or contribute new utilities on GitHub.',
  },
  {
    question: 'HOW DO I EXTEND OR REGISTER CUSTOM UTILITIES IN MY WORKSPACE?',
    answer:
      'DevForge includes a local Tool SDK and Plugin Marketplace system. You can write custom client utilities using our TypeScript `registerTool` interface and load them dynamically into your personal Cyber-Deck.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative w-full select-none font-mono">
      <div className="w-full space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 terminal-badge">
            <Terminal className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>// ARCHITECTURE & SECURITY FAQ</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-[36px] font-black uppercase tracking-tight text-foreground leading-tight">
            FREQUENTLY ASKED <span className="glow-cyan-text">QUESTIONS</span>.
          </h2>
          <p className="text-base sm:text-[16px] text-cyan-200/80 font-sans leading-relaxed">
            Everything you need to know about WebAssembly sandboxing, air-gapped security, and offline execution.
          </p>
        </div>

        {/* Synthwave Accordion Cards */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.question}
                className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-cyan-400 bg-[#0c091f] shadow-[0_0_25px_rgba(0,240,255,0.2)]'
                    : 'border-cyan-500/20 bg-[#070512] hover:border-cyan-500/50'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-6 sm:p-7 text-left font-extrabold text-xs sm:text-sm tracking-wide text-cyan-300 hover:text-white transition-colors"
                >
                  <span>{item.question}</span>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                      isOpen
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                        : 'border-cyan-500/30 bg-[#0c091f] text-muted-foreground'
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-7 text-xs sm:text-sm text-cyan-100/80 leading-relaxed border-t border-cyan-500/20 pt-4 font-mono">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
