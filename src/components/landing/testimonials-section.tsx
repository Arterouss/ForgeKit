'use client';

import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/animations/variants';

const testimonials = [
  {
    name: 'Alex Chen',
    role: 'Senior Engineer @ Vercel',
    content: 'DevForge replaced 12 bookmarks I used to visit daily. Everything is just… there.',
    avatar: '🧑‍💻',
  },
  {
    name: 'Sarah Kim',
    role: 'DevOps Lead @ Stripe',
    content: 'The Docker tools alone saved me hours. The keyboard shortcuts make it feel like an IDE for utilities.',
    avatar: '👩‍🔬',
  },
  {
    name: 'Marcus Rivera',
    role: 'Full Stack Dev',
    content: 'Finally, a dev tool that looks as good as it works. The workspace tabs are a game changer.',
    avatar: '👨‍🎨',
  },
  {
    name: 'Priya Patel',
    role: 'Indie Hacker',
    content: 'Open source, fast, beautiful. This is what every dev tool should aspire to be.',
    avatar: '🚀',
  },
  {
    name: 'James Okonkwo',
    role: 'Security Engineer',
    content: 'The hash and encoding tools are surprisingly thorough. And everything runs client-side. Respect.',
    avatar: '🔐',
  },
  {
    name: 'Luna Nakamura',
    role: 'Frontend Architect',
    content: 'I recommend DevForge to every team I work with. It just makes the small tasks disappear.',
    avatar: '✨',
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl">
            Loved by Developers
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            Join thousands of developers who made the switch.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={staggerItem}
              className="break-inside-avoid rounded-2xl border border-border bg-card/50 p-5"
            >
              <p className="text-sm leading-relaxed text-foreground/80">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-lg">
                  {t.avatar}
                </span>
                <div>
                  <div className="text-xs font-semibold text-foreground">{t.name}</div>
                  <div className="text-[10px] text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
