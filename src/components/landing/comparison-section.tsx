'use client';

import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

const without = [
  'Open 10 different websites',
  'Lose time switching tabs',
  'Different UIs everywhere',
  'Bookmarks you never find',
  'No keyboard shortcuts',
];

const withDF = [
  'Everything in one place',
  'Beautiful unified interface',
  'Keyboard shortcuts for everything',
  'Blazing fast performance',
  'Works offline too',
];

export function ComparisonSection() {
  return (
    <section id="comparison" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl">
            Why DevForge?
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            Stop juggling tools. Start forging.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Without */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6"
          >
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-destructive">
              Without DevForge
            </h3>
            <ul className="space-y-3">
              {without.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <X className="h-4 w-4 shrink-0 text-destructive/60" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* With */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-primary/20 bg-primary/5 p-6"
          >
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-primary">
              With DevForge
            </h3>
            <ul className="space-y-3">
              {withDF.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
