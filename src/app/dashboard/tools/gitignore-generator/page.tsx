import type { Metadata } from 'next';
import { GitIgnoreGeneratorPro } from '@/components/tools/gitignore-generator';

export const metadata: Metadata = {
  title: 'GitIgnore Generator Pro — DevForge Developer Studio',
  description:
    'Generate production-ready .gitignore files for any technology stack with smart deduplication and preset combos.',
};

export default function GitIgnoreGeneratorPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <GitIgnoreGeneratorPro />
      </div>
  );
}
