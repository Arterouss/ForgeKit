'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Wrench, Layers, Users, Star, GitFork } from 'lucide-react';
import type { ReactNode } from 'react';

interface StatProps {
  icon: ReactNode;
  value: number;
  suffix?: string;
  label: string;
}

function AnimatedCounter({ icon, value, suffix = '', label }: StatProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `${Math.round(v)}${suffix}`);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate(count, value, { duration: 2, ease: 'easeOut' });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [count, value]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <motion.span className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
        {rounded}
      </motion.span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export function StatsSection() {
  return (
    <section id="stats" className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-5"
        >
          <AnimatedCounter
            icon={<Wrench className="h-5 w-5" />}
            value={100}
            suffix="+"
            label="Developer Tools"
          />
          <AnimatedCounter
            icon={<Layers className="h-5 w-5" />}
            value={11}
            label="Categories"
          />
          <AnimatedCounter
            icon={<Users className="h-5 w-5" />}
            value={5000}
            suffix="+"
            label="Developers"
          />
          <AnimatedCounter
            icon={<Star className="h-5 w-5" />}
            value={100}
            suffix="%"
            label="Open Source"
          />
          <AnimatedCounter
            icon={<GitFork className="h-5 w-5" />}
            value={50}
            suffix="+"
            label="Contributors"
          />
        </motion.div>
      </div>
    </section>
  );
}
