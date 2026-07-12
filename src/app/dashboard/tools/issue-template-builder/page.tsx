import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { IssueTemplateBuilderPro } from '@/components/tools/issue-template-builder';

export const metadata: Metadata = {
  title: 'GitHub Issue Template Builder — DevForge Developer Studio',
  description:
    'Visual builder for GitHub YAML Issue Forms (.yml) and Markdown templates (.md) with structured fields, dropdown selectors, checkboxes, and required validation rules.',
};

export default function IssueTemplateBuilderPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <IssueTemplateBuilderPro />
      </div>
    </DashboardShell>
  );
}
