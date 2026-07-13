import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { BashScriptGeneratorPro } from '@/components/tools/bash-script-generator';

export const metadata: Metadata = {
  title: 'Bash Script Generator — DevForge Developer Studio',
  description:
    'Interactive generator for production-grade Linux Bash scripts with strict mode (set -euo pipefail), ANSI logging helpers, trap cleanup handlers, and CLI flag parsers.',
};

export default function BashScriptGeneratorPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <BashScriptGeneratorPro />
      </div>
    </DashboardShell>
  );
}
