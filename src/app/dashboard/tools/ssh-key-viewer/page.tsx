import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { SshKeyViewerPro } from '@/components/tools/ssh-key-viewer';

export const metadata: Metadata = {
  title: 'SSH Key Viewer — DevForge Developer Studio',
  description:
    'Cryptographic inspection tool for SSH public and private keys to identify algorithm, estimate bit strength, verify passphrase protection, and extract email comments.',
};

export default function SshKeyViewerPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <SshKeyViewerPro />
      </div>
    </DashboardShell>
  );
}
