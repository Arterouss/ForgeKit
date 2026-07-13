import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { CertificateViewerPro } from '@/components/tools/certificate-viewer';

export const metadata: Metadata = {
  title: 'X.509 Certificate Viewer & SSL Chain Auditor — DevForge Developer Studio',
  description:
    'Inspect PEM X.509 SSL/TLS certificates to audit expiration dates, issuer authority, SANs, serial numbers, and SHA-256 fingerprints.',
};

export default function CertificateViewerPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <CertificateViewerPro />
      </div>
    </DashboardShell>
  );
}
