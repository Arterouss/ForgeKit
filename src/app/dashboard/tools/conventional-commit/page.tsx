import type { Metadata } from 'next';
import { ConventionalCommitPro } from '@/components/tools/conventional-commit';

export const metadata: Metadata = {
  title: 'Conventional Commit Assistant — DevForge Developer Studio',
  description:
    'Interactive specification builder for standardized git commit messages with semantic versioning triggers, breaking change flags, and issue reference footers.',
};

export default function ConventionalCommitPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <ConventionalCommitPro />
      </div>
  );
}
