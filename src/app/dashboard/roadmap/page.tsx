'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Map, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const roadmapPhases = [
  {
    phase: 'Phase 1-6',
    title: 'Core Engine, Design System & 60 Developer Tools',
    status: 'completed',
    items: [
      '60 Client-side Developer Tools (Formatting, Encoding, Generators, Docker, Linux, Git, API, DB, Crypto)',
      'OKLCH Dynamic Theme Engine (Dark, Light, Midnight, Nord, Tokyo Night, Dracula)',
      'Sandboxed Web Worker Execution SDK',
    ],
  },
  {
    phase: 'Phase 7-8',
    title: 'Workspace Ecosystem & Plugin Marketplace',
    status: 'completed',
    items: [
      'Multi-tab Browser Workspace Engine with Persistent State',
      'Plugin Marketplace with 6 Live Extensions',
      'Ctrl+K Command Palette & Keyboard Shortcuts',
    ],
  },
  {
    phase: 'Phase 9-10',
    title: 'UI/UX Master Polish & v1.0.0 Release Candidate',
    status: 'completed',
    items: [
      'Spacious Responsive UI/UX Layout with Dynamic Lucide Icons',
      'Privacy-first Error Reporter & Local Analytics Engine',
      '100% Test Coverage (210/210 Unit Tests Passed)',
    ],
  },
  {
    phase: 'Phase 11 (Upcoming)',
    title: 'Community Shared Collections & Cloud Sync (Optional)',
    status: 'in-progress',
    items: [
      'Export & Share Custom Tool Workflows via URL',
      'Custom Snippet Vault with Tagging',
      'Offline PWA Sync & Auto-update Notification',
    ],
  },
];

export default function RoadmapPage() {
  const router = useRouter();

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      <div className="space-y-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card/70 to-primary/5 p-8 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Map className="h-5 w-5" />
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-foreground">
              DevForge Product Roadmap
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Track our completed milestones and upcoming features for DevForge developer toolkit.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {roadmapPhases.map((item) => (
          <div
            key={item.phase}
            className="rounded-2xl border border-border/70 bg-card/50 p-6 space-y-4 shadow-sm hover:border-primary/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {item.status === 'completed' ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                ) : (
                  <Clock className="h-5 w-5 text-amber-500 shrink-0" />
                )}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    {item.phase}
                  </span>
                  <h3 className="text-base font-extrabold text-foreground">
                    {item.title}
                  </h3>
                </div>
              </div>

              <Badge
                variant={item.status === 'completed' ? 'default' : 'outline'}
                className="text-xs"
              >
                {item.status === 'completed' ? 'Completed (v1.0.0)' : 'In Progress'}
              </Badge>
            </div>

            <ul className="space-y-2 pl-8 list-disc text-xs md:text-sm text-muted-foreground">
              {item.items.map((desc, i) => (
                <li key={i}>{desc}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
