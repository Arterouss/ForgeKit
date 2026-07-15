import type { Metadata } from 'next';
import { GitHubLabelsGeneratorPro } from '@/components/tools/github-labels-generator';

export const metadata: Metadata = {
  title: 'GitHub Labels Generator — DevForge Developer Studio',
  description:
    'Visual builder for repository issue & PR labels with hex color previews, exporting to GitHub CLI script commands, JSON arrays, or YAML configs.',
};

export default function GitHubLabelsGeneratorPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <GitHubLabelsGeneratorPro />
      </div>
  );
}
