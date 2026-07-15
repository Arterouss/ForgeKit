import type { Metadata } from 'next';
import { GitHookBuilderPro } from '@/components/tools/git-hook-builder';

export const metadata: Metadata = {
  title: 'Git Hook Builder (Husky / Lefthook) — DevForge Developer Studio',
  description:
    'Interactive generator for Husky v9+, Lefthook YAML workflows, and raw git hook scripts covering pre-commit linting, commit-msg checks, and pre-push validation.',
};

export default function GitHookBuilderPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <GitHookBuilderPro />
      </div>
  );
}
