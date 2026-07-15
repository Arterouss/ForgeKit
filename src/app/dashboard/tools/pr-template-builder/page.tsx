import type { Metadata } from 'next';
import { PrTemplateBuilderPro } from '@/components/tools/pr-template-builder';

export const metadata: Metadata = {
  title: 'Pull Request Template Builder — DevForge Developer Studio',
  description:
    'Interactive generator for .github/PULL_REQUEST_TEMPLATE.md with structured review checklists, issue linkage, change type categories, and quality verification steps.',
};

export default function PrTemplateBuilderPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <PrTemplateBuilderPro />
      </div>
  );
}
