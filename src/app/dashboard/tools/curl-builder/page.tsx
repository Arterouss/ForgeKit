import type { Metadata } from 'next';
import { CurlBuilderPro } from '@/components/tools/curl-builder';

export const metadata: Metadata = {
  title: 'cURL Command Builder — DevForge Developer Studio',
  description:
    'Construct multi-line or single-line cURL CLI commands and JS fetch() snippets with headers, authentication, payload body, SSL bypass (-k), and redirect flags (-L).',
};

export default function CurlBuilderPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <CurlBuilderPro />
      </div>
  );
}
