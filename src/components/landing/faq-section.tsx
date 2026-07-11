'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Is DevForge really free?',
    a: 'Yes! DevForge is 100% free and open source under the MIT License. No hidden fees, no premium tiers, no data collection.',
  },
  {
    q: 'Does it work offline?',
    a: 'Most tools run entirely in your browser — no server requests needed. You can use DevForge offline for formatting, encoding, generating, and more.',
  },
  {
    q: 'Can I contribute?',
    a: 'Absolutely! We welcome contributions of all kinds — new tools, bug fixes, UI improvements, documentation. Check our CONTRIBUTING.md on GitHub.',
  },
  {
    q: 'What tech stack is used?',
    a: 'DevForge is built with Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, and Prisma. Everything is modern, typed, and maintainable.',
  },
  {
    q: 'Is my data safe?',
    a: 'All processing happens in your browser. We never send your data to any server. Your code, tokens, and secrets stay on your machine.',
  },
  {
    q: 'How do I request a new tool?',
    a: 'Open a Feature Request issue on our GitHub repository. The community votes on the most wanted tools, and contributors can pick them up.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl">
            Frequently Asked
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-2"
        >
          {faqs.map((faq, i) => (
            <div
              key={faq.q}
              className="rounded-xl border border-border bg-card/50 transition-colors hover:bg-card"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
                aria-expanded={openIndex === i}
              >
                <span className="text-sm font-medium text-foreground">{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
