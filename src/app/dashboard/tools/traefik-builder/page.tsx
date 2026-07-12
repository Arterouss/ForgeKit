import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { TraefikBuilderPro } from '@/components/tools/traefik-builder';

export const metadata: Metadata = {
  title: 'Traefik Config Builder Pro — DevForge Developer Studio',
  description:
    'Visual Traefik v3 static & dynamic YAML generator with Docker auto-discovery and automated Let\'s Encrypt TLS.',
};

export default function TraefikBuilderPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <TraefikBuilderPro />
      </div>
    </DashboardShell>
  );
}
