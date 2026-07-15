'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquare, ExternalLink } from 'lucide-react';

export default function DiscordPage() {
  const router = useRouter();

  return (
    <div className="space-y-8 pb-16 max-w-3xl mx-auto">
      <div className="space-y-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card/70 to-primary/5 p-8 shadow-md text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
            <MessageSquare className="h-7 w-7" />
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-foreground">
            Join the DevForge Community
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Connect with developers building and using DevForge. Request tools, share plugins, or get instant help.
          </p>

          <div className="pt-2">
            <a
              href="https://github.com/Arterouss/ForgeKit/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all"
            >
              <span>Join Community Forum</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
