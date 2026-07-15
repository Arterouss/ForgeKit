import type { Metadata } from 'next';
import { GitAttributesGeneratorPro } from '@/components/tools/gitattributes-generator';

export const metadata: Metadata = {
  title: '.gitattributes Generator — DevForge Developer Studio',
  description:
    'Visual builder for Git repository normalization covering line ending conversions (LF/CRLF), Git LFS large asset tracking, and GitHub Linguist stats override rules.',
};

export default function GitAttributesGeneratorPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <GitAttributesGeneratorPro />
      </div>
  );
}
