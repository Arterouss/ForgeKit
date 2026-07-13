import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { JwtInspectorPro } from '@/components/tools/jwt-inspector';

export const metadata: Metadata = {
  title: 'JWT Security Auditor & Flaw Inspector — DevForge Developer Studio',
  description:
    'Perform a comprehensive security audit on JSON Web Tokens to detect alg=none flaws, missing exp claims, PII exposure, and calculate security scores.',
};

export default function JwtInspectorPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <JwtInspectorPro />
      </div>
    </DashboardShell>
  );
}
