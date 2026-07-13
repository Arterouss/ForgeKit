import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { SshConfigBuilderPro } from '@/components/tools/ssh-config-builder';

export const metadata: Metadata = {
  title: 'SSH Config Builder — DevForge Developer Studio',
  description:
    'Visual multi-host generator for ~/.ssh/config supporting ProxyJump bastion routing, IdentityFile selection, LocalForward SSH tunnels, and keep-alive intervals.',
};

export default function SshConfigBuilderPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <SshConfigBuilderPro />
      </div>
    </DashboardShell>
  );
}
