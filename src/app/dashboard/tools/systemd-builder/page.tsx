import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { SystemdBuilderPro } from '@/components/tools/systemd-builder';

export const metadata: Metadata = {
  title: 'Systemd Service Builder — DevForge Developer Studio',
  description:
    'Visual generator for Linux .service unit files with security hardening flags, environment variables, restart policies, and systemctl lifecycle commands.',
};

export default function SystemdBuilderPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <SystemdBuilderPro />
      </div>
    </DashboardShell>
  );
}
