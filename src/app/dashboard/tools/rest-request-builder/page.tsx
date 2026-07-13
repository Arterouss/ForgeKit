import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { RestRequestBuilderPro } from '@/components/tools/rest-request-builder';

export const metadata: Metadata = {
  title: 'REST Request Builder — DevForge Developer Studio',
  description:
    'Interactive REST API client configuration tool generating multi-language code snippets (cURL, fetch, Axios, Python) with query parameter builder and live response simulator.',
};

export default function RestRequestBuilderPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <RestRequestBuilderPro />
      </div>
    </DashboardShell>
  );
}
