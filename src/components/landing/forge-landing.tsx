'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Blocks,
  Braces,
  Check,
  ChevronDown,
  CircleDot,
  Code2,
  Command,
  FolderKanban,
  Github,
  LayoutPanelTop,
  LockKeyhole,
  Play,
  Search,
  WandSparkles,
  Zap,
} from 'lucide-react';

const features = [
  { icon: Braces, title: 'Built-in utilities', text: 'Format, inspect, encode, and generate with tools that stay close to your work.' },
  { icon: LayoutPanelTop, title: 'A real workspace', text: 'Keep tools, notes, and output in a calm, persistent desktop-style environment.' },
  { icon: Blocks, title: 'Extensible by design', text: 'Plug in focused capabilities without turning your workspace into a collection of tabs.' },
];

const testimonials = [
  ['“It feels like the utilities I use all day finally belong in the same place.”', 'Maya Chen', 'Platform engineer'],
  ['“Fast, private, and unexpectedly serene. I spend less time context-switching.”', 'Noah Martinez', 'Independent developer'],
];

export function ForgeLanding() {
  return (
    <div className="relative isolate overflow-hidden bg-[#09090b] text-zinc-100">
      <div className="landing-orb absolute -left-64 top-24 h-[36rem] w-[36rem] rounded-full bg-violet-600" />
      <div className="landing-orb absolute right-[-16rem] top-[34rem] h-[34rem] w-[34rem] rounded-full bg-indigo-600" />

      <header className="relative z-10 mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-violet-300 to-violet-500 text-[#17121f] shadow-lg shadow-violet-500/20"><Zap className="size-4 fill-current" /></span>
          DevForge
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-zinc-400 md:flex">
          <a href="#workflow" className="transition hover:text-white">Workflow</a>
          <a href="#ecosystem" className="transition hover:text-white">Ecosystem</a>
          <a href="#faq" className="transition hover:text-white">FAQ</a>
        </nav>
        <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200">
          Open workspace <ArrowRight className="size-3.5" />
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <section className="mx-auto flex max-w-4xl flex-col items-center pb-20 pt-20 text-center sm:pt-28">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.045] px-3 py-1.5 text-xs text-zinc-300 backdrop-blur">
            <span className="size-1.5 rounded-full bg-teal-300 shadow-[0_0_12px_#5eead4]" /> Local-first developer tools
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }} className="max-w-4xl text-balance text-5xl font-semibold tracking-[-.055em] text-white sm:text-7xl">
            A quieter place to build <span className="bg-gradient-to-br from-violet-200 via-violet-300 to-indigo-400 bg-clip-text text-transparent">great software.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 }} className="mt-6 max-w-2xl text-pretty text-base leading-7 text-zinc-400 sm:text-lg">
            DevForge gathers the small developer tasks that interrupt your flow into one considered, private workspace.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .22 }} className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-violet-300 px-5 py-3 text-sm font-semibold text-violet-950 shadow-xl shadow-violet-500/20 transition hover:-translate-y-0.5 hover:bg-violet-200">Start creating <ArrowRight className="size-4" /></Link>
            <a href="#workflow" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.045] px-5 py-3 text-sm font-medium text-zinc-200 backdrop-blur transition hover:bg-white/[.09]"><Play className="size-3.5 fill-current" /> See how it works</a>
          </motion.div>
        </section>

        <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} className="app-surface relative mx-auto max-w-6xl overflow-hidden rounded-[28px] p-2 shadow-2xl shadow-black/40">
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-violet-400/10 to-transparent" />
          <div className="relative overflow-hidden rounded-[22px] border border-white/[.08] bg-[#101014]">
            <div className="flex h-12 items-center justify-between border-b border-white/[.07] px-4 sm:px-5">
              <div className="flex gap-1.5"><i className="size-2.5 rounded-full bg-rose-300/70" /><i className="size-2.5 rounded-full bg-amber-200/70" /><i className="size-2.5 rounded-full bg-emerald-300/70" /></div>
              <div className="hidden rounded-md bg-white/[.045] px-3 py-1 font-mono text-[10px] text-zinc-500 sm:block">forge://workspace/main</div>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500"><CircleDot className="size-3 text-teal-300" /> Synced</div>
            </div>
            <div className="grid min-h-[360px] grid-cols-[56px_1fr] sm:grid-cols-[190px_1fr] lg:min-h-[470px]">
              <aside className="border-r border-white/[.07] bg-white/[.018] p-3 sm:p-4">
                <div className="mb-6 flex items-center gap-2 text-sm font-medium text-zinc-100"><span className="grid size-6 place-items-center rounded-lg bg-violet-300 text-violet-950"><Zap className="size-3.5 fill-current" /></span><span className="hidden sm:inline">Morning build</span></div>
                <div className="space-y-1">
                  {['Overview', 'Pinned', 'Collections', 'Plugins'].map((item, index) => <div key={item} className={`flex items-center gap-2 rounded-lg px-2 py-2 text-xs ${index === 0 ? 'bg-white/[.08] text-white' : 'text-zinc-500'}`}><FolderKanban className="size-3.5" /><span className="hidden sm:inline">{item}</span></div>)}
                </div>
              </aside>
              <div className="min-w-0 p-5 sm:p-7">
                <div className="flex items-center justify-between gap-3"><div><p className="text-xs text-zinc-500">Tuesday, July 15</p><h2 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">Continue where you left off.</h2></div><button className="rounded-lg border border-white/10 bg-white/[.04] p-2 text-zinc-400"><Command className="size-4" /></button></div>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {['JSON Formatter', 'JWT Inspector', 'Regex Studio'].map((tool, index) => <div key={tool} className="rounded-xl border border-white/[.08] bg-white/[.035] p-3.5"><div className={`grid size-8 place-items-center rounded-lg ${index === 1 ? 'bg-teal-300/15 text-teal-200' : 'bg-violet-300/15 text-violet-200'}`}>{index === 0 ? <Braces className="size-4" /> : index === 1 ? <LockKeyhole className="size-4" /> : <Search className="size-4" />}</div><p className="mt-5 text-sm font-medium text-zinc-100">{tool}</p><p className="mt-1 text-[11px] text-zinc-500">Used {index + 2}h ago</p></div>)}
                </div>
                <div className="mt-5 rounded-xl border border-white/[.08] bg-black/20 p-4"><div className="mb-3 flex justify-between text-xs"><span className="font-medium text-zinc-200">Workspace activity</span><span className="text-zinc-500">This week</span></div><div className="flex h-14 items-end gap-1.5">{[22,38,28,68,44,82,54,76,47,62,91,58].map((height, i) => <span key={i} className="flex-1 rounded-sm bg-gradient-to-t from-violet-500/30 to-violet-300/80" style={{ height: `${height}%` }} />)}</div></div>
              </div>
            </div>
          </div>
        </motion.section>

        <section id="workflow" className="py-28">
          <div className="max-w-xl"><p className="eyebrow">Designed around momentum</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.04em] text-white sm:text-4xl">Everything you need. Nothing demanding your attention.</h2></div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">{features.map(({ icon: Icon, title, text }) => <div key={title} className="app-panel-interactive min-h-56 p-6"><span className="grid size-10 place-items-center rounded-xl border border-violet-300/15 bg-violet-300/10 text-violet-200"><Icon className="size-5" /></span><h3 className="mt-10 text-lg font-medium text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p></div>)}</div>
        </section>

        <section id="ecosystem" className="grid items-center gap-10 rounded-[28px] border border-white/[.09] bg-gradient-to-br from-white/[.06] to-white/[.018] p-7 sm:p-10 lg:grid-cols-[1.1fr_.9fr] lg:p-14">
          <div><p className="eyebrow">Your setup, extended</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.04em] text-white">Add power without adding clutter.</h2><p className="mt-4 max-w-lg text-sm leading-6 text-zinc-400">Bring specialized tools into a workspace that gives every capability the same polished, predictable home.</p><Link href="/dashboard/marketplace" className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-violet-200 transition hover:text-white">Explore plugins <ArrowRight className="size-4" /></Link></div>
          <div className="rounded-2xl border border-white/[.08] bg-[#0c0c0f] p-3 shadow-2xl"><div className="grid gap-2">{[['Schema lens', 'Inspect APIs'], ['Release notes', 'Ship clearly'], ['Git helpers', 'Stay in flow']].map(([name, sub], i) => <div className="flex items-center gap-3 rounded-xl bg-white/[.045] p-3.5" key={name}><span className={`grid size-9 place-items-center rounded-lg ${i === 1 ? 'bg-teal-300/15 text-teal-200' : 'bg-violet-300/15 text-violet-200'}`}>{i === 0 ? <Code2 className="size-4" /> : i === 1 ? <WandSparkles className="size-4" /> : <Github className="size-4" />}</span><span><b className="block text-sm font-medium text-zinc-100">{name}</b><small className="text-xs text-zinc-500">{sub}</small></span><Check className="ml-auto size-4 text-teal-300" /></div>)}</div></div>
        </section>

        <section className="py-28"><div className="grid gap-4 md:grid-cols-2">{testimonials.map(([quote, name, role]) => <figure key={name} className="app-panel p-7"><blockquote className="text-lg leading-8 tracking-tight text-zinc-200">{quote}</blockquote><figcaption className="mt-9 text-sm"><b className="block font-medium text-zinc-100">{name}</b><span className="text-zinc-500">{role}</span></figcaption></figure>)}</div></section>

        <section id="faq" className="mx-auto max-w-3xl border-t border-white/[.08] py-20"><p className="eyebrow">Questions</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.04em] text-white">Built for focus, from the first click.</h2><div className="mt-8 divide-y divide-white/[.08]">{[['Does DevForge send my data anywhere?', 'Core tools run in your browser and your workspace stays under your control.'], ['Can I organize the tools I use most?', 'Yes. Pin favorites, create collections, and return to your recent work in one click.'], ['Can I add more capabilities?', 'The plugin marketplace is built into your workspace, so new tools feel native from the start.']].map(([question, answer]) => <details key={question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-zinc-200">{question}<ChevronDown className="size-4 text-zinc-500 transition group-open:rotate-180" /></summary><p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">{answer}</p></details>)}</div></section>
      </main>
      <footer className="relative z-10 border-t border-white/[.08]"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between lg:px-8"><span className="flex items-center gap-2 text-zinc-300"><span className="grid size-5 place-items-center rounded-md bg-violet-300 text-violet-950"><Zap className="size-3 fill-current" /></span> DevForge</span><span>Tools that respect your focus.</span></div></footer>
    </div>
  );
}
