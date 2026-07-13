import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { HashGeneratorPro } from '@/components/tools/hash-generator';

export const metadata: Metadata = {
  title: 'Cryptographic Hash Generator (SHA-1 / SHA-256 / SHA-512) — DevForge Developer Studio',
  description:
    'Compute locally-secure SHA digests via Web Crypto API, compare verification checksums, and export formatted hexadecimal hashes.',
};

export default function HashGeneratorPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <HashGeneratorPro />
      </div>
    </DashboardShell>
  );
}
