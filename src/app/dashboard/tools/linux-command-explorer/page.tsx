import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { LinuxCommandExplorerPro } from '@/components/tools/linux-command-explorer';

export const metadata: Metadata = {
  title: 'Linux Command Explorer — DevForge Developer Studio',
  description:
    'Interactive Linux server administration and DevOps CLI database with flag reference breakdowns, syntax templates, and real-world production examples.',
};

export default function LinuxCommandExplorerPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <LinuxCommandExplorerPro />
      </div>
    </DashboardShell>
  );
}
