import type { Metadata } from 'next';
import { NginxBuilderPro } from '@/components/tools/nginx-builder';

export const metadata: Metadata = {
  title: 'Nginx Config Builder Pro — DevForge Developer Studio',
  description:
    'Visual Nginx server block builder for reverse proxies, SPA static site routing, SSL TLSv1.3, and Gzip compression.',
};

export default function NginxBuilderPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <NginxBuilderPro />
      </div>
  );
}
