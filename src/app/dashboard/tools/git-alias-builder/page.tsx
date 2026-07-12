import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { GitAliasBuilderPro } from '@/components/tools/git-alias-builder';

export const metadata: Metadata = {
  title: 'Git Alias Builder — DevForge Developer Studio',
  description:
    'Visual generator for Git terminal shortcuts supporting .gitconfig INI sections, global CLI setup commands, and shell bash/zsh aliases.',
};

export default function GitAliasBuilderPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <GitAliasBuilderPro />
      </div>
    </DashboardShell>
  );
}
