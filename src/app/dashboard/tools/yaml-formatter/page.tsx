import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { YamlFormatterPro } from '@/components/tools/yaml-formatter';

export const metadata: Metadata = {
  title: 'YAML Formatter Pro — DevForge Developer Studio',
  description:
    'Beautify, validate, and convert YAML documents for Docker Compose, Kubernetes, and CI/CD pipelines.',
};

export default function YamlFormatterPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <YamlFormatterPro />
      </div>
    </DashboardShell>
  );
}
