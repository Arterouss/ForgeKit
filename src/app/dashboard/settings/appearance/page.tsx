'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { ArrowLeft, Palette, Check, Sparkles } from 'lucide-react';
import { useMounted } from '@/hooks/use-mounted';

const themes = [
  { id: 'dark', name: 'Dark Forge', desc: 'Standard sleek dark interface with high-contrast surfaces', badge: 'Default' },
  { id: 'light', name: 'Light Forge', desc: 'Clean daylight interface with crisp shadows', badge: 'Light' },
  { id: 'midnight', name: 'Midnight Violet', desc: 'OLED deep violet-black contrast (#09090b)', badge: 'OLED' },
  { id: 'nord', name: 'Arctic Nord', desc: 'Cool arctic blue and cyan developer palette', badge: 'Cool' },
  { id: 'tokyo-night', name: 'Tokyo Night', desc: 'Vibrant indigo cyberpunk studio glow', badge: 'Cyberpunk' },
  { id: 'dracula', name: 'Dracula Purple', desc: 'Warm purple-pink developer syntax palette', badge: 'Warm' },
];

export default function AppearanceSettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto select-none">
      <div className="space-y-6">
        <button
          onClick={() => router.push('/dashboard/settings')}
          className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-2 text-xs font-bold text-muted-foreground hover:border-primary/50 hover:bg-white/[0.05] hover:text-foreground transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Settings Center</span>
        </button>

        <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.025] backdrop-blur-2xl p-8 shadow-2xl space-y-8">
          <div className="flex items-center gap-4 border-b border-white/[0.08] pb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-white shadow-lg">
              <Palette className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-extrabold text-foreground flex items-center gap-2">
                Appearance & Theme Studio
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-extrabold text-primary border border-primary/20">
                  <Sparkles className="h-3 w-3" /> Live
                </span>
              </h1>
              <p className="text-xs font-medium text-muted-foreground mt-1">
                Curated developer color schemes tailored for multi-hour engineering sessions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {themes.map((item) => {
              const isSelected = mounted && theme === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTheme(item.id)}
                  className={`group relative flex flex-col justify-between rounded-[24px] border p-6 text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-primary/80 bg-primary/10 shadow-xl shadow-primary/5'
                      : 'border-white/[0.08] bg-white/[0.02] hover:border-primary/50 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="text-base font-extrabold text-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-white/[0.06] border border-white/[0.08] px-2.5 py-0.5 text-[10px] font-extrabold text-muted-foreground">
                        {item.badge}
                      </span>
                      {isSelected && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-md">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
