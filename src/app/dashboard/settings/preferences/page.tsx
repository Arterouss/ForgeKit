'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Sliders } from 'lucide-react';
import { useWorkspace } from '@/components/workspace';

export default function PreferencesSettingsPage() {
  const router = useRouter();
  const { dashboardWidgets, setDashboardWidget } = useWorkspace();

  return (
    <div className="space-y-8 pb-16 max-w-2xl mx-auto">
      <div className="space-y-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="rounded-3xl border border-border/80 bg-card/70 p-8 shadow-md space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-extrabold text-foreground">
                Dashboard & Workspace Preferences
              </h1>
              <p className="text-xs text-muted-foreground">
                Customize which widgets and sections appear on your main dashboard.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'showFavorites' as const,
                title: 'Show Pinned Favorites Widget',
                desc: 'Displays your pinned tools card at the top of the dashboard.',
              },
              {
                id: 'showRecent' as const,
                title: 'Show Recently Used Tools Widget',
                desc: 'Displays the 4 most recently opened tools automatically.',
              },
              {
                id: 'showCategories' as const,
                title: 'Show Explore Categories Grid',
                desc: 'Displays the 6 popular category shortcut cards.',
              },
              {
                id: 'showAllTools' as const,
                title: 'Show Complete Tool Registry Catalog',
                desc: 'Displays all 60 registered tools categorized at the bottom.',
              },
            ].map((widget) => {
              const enabled = dashboardWidgets[widget.id];
              return (
                <div
                  key={widget.id}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 p-4"
                >
                  <div className="space-y-0.5 pr-4">
                    <h3 className="text-xs font-bold text-foreground">{widget.title}</h3>
                    <p className="text-[11px] text-muted-foreground">{widget.desc}</p>
                  </div>
                  <button
                    onClick={() => setDashboardWidget(widget.id, !enabled)}
                    className={`flex h-6 w-11 items-center rounded-full p-1 transition-colors ${
                      enabled ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                        enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
