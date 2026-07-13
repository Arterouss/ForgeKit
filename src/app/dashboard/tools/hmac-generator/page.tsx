import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { HmacGeneratorPro } from '@/components/tools/hmac-generator';

export const metadata: Metadata = {
  title: 'HMAC Generator & Signature Verifier — DevForge Developer Studio',
  description:
    'Compute cryptographic HMAC-SHA1, HMAC-SHA256, and HMAC-SHA512 signatures locally, compare webhook digests, and export Hex or Base64 signatures.',
};

export default function HmacGeneratorPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <HmacGeneratorPro />
      </div>
    </DashboardShell>
  );
}
