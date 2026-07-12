import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { NginxBuilderPro } from '@/components/tools/nginx-builder';

export const metadata: Metadata = {
  title: 'Nginx Config Builder Pro — DevForge Developer Studio',
  description:
    'Visual Nginx server block builder for reverse proxies, SPA static site routing, SSL TLSv1.3, and Gzip compression.',
};

export default function NginxBuilderPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <NginxBuilderPro />
      </div>
    </DashboardShell>
  );
}
