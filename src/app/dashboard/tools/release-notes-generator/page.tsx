import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { ReleaseNotesGeneratorPro } from '@/components/tools/release-notes-generator';

export const metadata: Metadata = {
  title: 'Release Notes Generator — DevForge Developer Studio',
  description:
    'Automated changelog builder that parses git log --oneline output and groups commits into semantic categories with GitHub comparison links.',
};

export default function ReleaseNotesGeneratorPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <ReleaseNotesGeneratorPro />
      </div>
    </DashboardShell>
  );
}
