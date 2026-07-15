import type { Metadata } from 'next';
import { GitHubActionsBuilderPro } from '@/components/tools/github-actions-builder';

export const metadata: Metadata = {
  title: 'GitHub Actions Workflow Builder Pro — DevForge Developer Studio',
  description:
    'Visual CI/CD workflow generator with automated Docker build/push integration, multi-branch triggers, and step matrix builder.',
};

export default function GitHubActionsBuilderPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <GitHubActionsBuilderPro />
      </div>
  );
}
