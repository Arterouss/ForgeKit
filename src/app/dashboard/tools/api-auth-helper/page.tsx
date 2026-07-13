import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { ApiAuthHelperPro } from '@/components/tools/api-auth-helper';

export const metadata: Metadata = {
  title: 'API Authentication Helper & Header Generator — DevForge Developer Studio',
  description:
    'Generate HTTP authentication headers (Bearer JWT, Basic Base64, Custom API Keys, OAuth 2.0 Client Credentials), cURL test scripts, and JS fetch snippets.',
};

export default function ApiAuthHelperPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <ApiAuthHelperPro />
      </div>
    </DashboardShell>
  );
}
