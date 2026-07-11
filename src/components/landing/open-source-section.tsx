'use client';

import { motion } from 'framer-motion';
import { Github, Heart, Map, Scale } from 'lucide-react';

export function OpenSourceSection() {
  return (
    <section id="open-source" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Heart className="h-7 w-7 text-primary" />
          </div>

          <h2 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl">
            Open Source at Heart
          </h2>
          <p className="max-w-2xl text-muted-foreground sm:text-lg">
            DevForge is free, open source, and community driven.
            <br />
            Built by developers, for developers.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: <Scale className="h-5 w-5" />, label: 'MIT License' },
              { icon: <Heart className="h-5 w-5" />, label: 'Community Driven' },
              { icon: <Github className="h-5 w-5" />, label: 'Contributions Welcome' },
              { icon: <Map className="h-5 w-5" />, label: 'Public Roadmap' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card/50 p-4 text-center"
              >
                <div className="text-primary">{item.icon}</div>
                <span className="text-xs font-medium text-foreground">{item.label}</span>
              </div>
            ))}
          </div>

          <a
            href="https://github.com/Arterouss/ForgeKit"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <Github className="h-4 w-4" />
            Star on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}
