import type { Metadata } from 'next';
import { ApacheBuilderPro } from '@/components/tools/apache-builder';

export const metadata: Metadata = {
  title: 'Apache Virtual Host Builder — DevForge Developer Studio',
  description:
    'Visual generator for Apache 2.4 VirtualHost configurations with SSL/TLS certificates, mod_proxy reverse proxying, AllowOverride .htaccess permissions, and HTTP redirect blocks.',
};

export default function ApacheBuilderPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <ApacheBuilderPro />
      </div>
  );
}
