import Link from 'next/link';
import { Sparkles, ArrowLeft, Wrench, Terminal } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';

interface ToolPlaceholderPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ToolPlaceholderPage({ params }: ToolPlaceholderPageProps) {
  const { slug } = await params;

  const formatTitle = (s: string) =>
    s
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  const title = formatTitle(slug);

  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center select-none">
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 shadow-lg">
          <Wrench className="h-10 w-10 text-primary animate-pulse" />
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
            BETA
          </span>
        </div>

        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-md text-xs text-muted-foreground sm:text-sm">
          This developer tool module is currently under active forging. In the meantime, try our flagship
          <span className="font-semibold text-primary"> JSON Formatter Pro</span>.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard/tools/json-formatter"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-md hover:opacity-90 transition-opacity"
          >
            <Sparkles className="h-4 w-4" />
            <span>Open JSON Formatter Pro</span>
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <div className="mt-8 flex items-center gap-2 rounded-lg border border-border/80 bg-muted/40 px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
          <Terminal className="h-3.5 w-3.5 text-primary" />
          <span>Module route: /dashboard/tools/{slug}</span>
        </div>
      </div>
    </DashboardShell>
  );
}
