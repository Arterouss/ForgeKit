import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { ReadmeGeneratorPro } from '@/components/tools/readme-generator';

export const metadata: Metadata = {
  title: 'README Generator Pro — DevForge Developer Studio',
  description:
    'Visual README.md document builder with dynamic Shields.io badges, features list, tech stack badges, and table of contents.',
};

export default function ReadmeGeneratorPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <ReadmeGeneratorPro />
      </div>
    </DashboardShell>
  );
}
