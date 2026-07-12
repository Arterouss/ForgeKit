import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { DockerRunBuilderPro } from '@/components/tools/docker-run-builder';

export const metadata: Metadata = {
  title: 'Docker Run Command Builder Pro — DevForge Developer Studio',
  description:
    'Visual docker run CLI command generator with volume mounts, environment flags, interactive mode, and Docker Compose import support.',
};

export default function DockerRunBuilderPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <DockerRunBuilderPro />
      </div>
    </DashboardShell>
  );
}
