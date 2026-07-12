import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { DockerfileBuilderPro } from '@/components/tools/dockerfile-builder';

export const metadata: Metadata = {
  title: 'Dockerfile Builder Pro — DevForge Developer Studio',
  description:
    'Visual multi-stage Dockerfile generator with live preview, security validation, and cross-tool .dockerignore suggestions.',
};

export default function DockerfileBuilderPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <DockerfileBuilderPro />
      </div>
    </DashboardShell>
  );
}
