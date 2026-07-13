'use client';

import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/animations/variants';
import {
  Code2, Binary, Sparkles, Container, Terminal,
  GitBranch, Database, Globe, Webhook, Shield, Wrench,
} from 'lucide-react';
import type { ReactNode } from 'react';

const iconMap: Record<string, ReactNode> = {
  Code2: <Code2 className="h-6 w-6" />,
  Binary: <Binary className="h-6 w-6" />,
  Sparkles: <Sparkles className="h-6 w-6" />,
  Container: <Container className="h-6 w-6" />,
  Terminal: <Terminal className="h-6 w-6" />,
  GitBranch: <GitBranch className="h-6 w-6" />,
  Database: <Database className="h-6 w-6" />,
  Globe: <Globe className="h-6 w-6" />,
  Webhook: <Webhook className="h-6 w-6" />,
  Shield: <Shield className="h-6 w-6" />,
  Wrench: <Wrench className="h-6 w-6" />,
};

const features = [
  { name: 'Formatting', icon: 'Code2', color: 'oklch(0.82 0.17 195)', desc: 'Format & beautify code' },
  { name: 'Encoding', icon: 'Binary', color: 'oklch(0.58 0.24 290)', desc: 'Encode, decode & transform' },
  { name: 'Generators', icon: 'Sparkles', color: 'oklch(0.78 0.15 80)', desc: 'UUIDs, passwords, configs' },
  { name: 'Docker', icon: 'Container', color: '#2496ED', desc: 'Container utilities' },
  { name: 'Linux', icon: 'Terminal', color: '#FCC624', desc: 'Command & permission tools' },
  { name: 'Git', icon: 'GitBranch', color: '#F05032', desc: 'Workflow & commit helpers' },
  { name: 'API', icon: 'Webhook', color: '#FF6B6B', desc: 'Testing & development' },
  { name: 'Database', icon: 'Database', color: '#336791', desc: 'Query & conversion' },
  { name: 'Network', icon: 'Globe', color: 'oklch(0.72 0.2 155)', desc: 'Connectivity utilities' },
  { name: 'Security', icon: 'Shield', color: '#E74C3C', desc: 'Crypto & hash tools' },
  { name: 'Utilities', icon: 'Wrench', color: 'oklch(0.65 0.02 250)', desc: 'General purpose tools' },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative z-10 px-4 py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl">
            Every Tool You Need
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            100+ developer utilities, organized by category.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 pb-12"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.name}
              variants={staggerItem}
              className="group relative flex flex-col items-center gap-3 rounded-2xl border border-border bg-card/50 p-5 text-center transition-all hover:border-transparent hover:bg-card hover:shadow-lg"
              style={{
                '--glow': feature.color,
              } as React.CSSProperties}
            >
              {/* Glow border on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
                style={{
                  background: `linear-gradient(135deg, ${feature.color}18, transparent 60%)`,
                  boxShadow: `inset 0 0 0 1px ${feature.color}30`,
                  borderRadius: 'inherit',
                }}
              />

              <motion.div
                whileHover={{ rotate: 6 }}
                className="relative flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
              >
                {iconMap[feature.icon]}
              </motion.div>

              <div className="relative">
                <h3 className="text-sm font-semibold text-foreground">{feature.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
