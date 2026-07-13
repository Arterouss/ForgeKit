import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { SshConfigValidatorPro } from '@/components/tools/ssh-config-validator';

export const metadata: Metadata = {
  title: 'SSH Config Validator — DevForge Developer Studio',
  description:
    'Interactive ~/.ssh/config security scanner and syntax linter detecting duplicate Host aliases, wildcard shadowing, Agent Forwarding risks, and formatting issues.',
};

export default function SshConfigValidatorPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <SshConfigValidatorPro />
      </div>
    </DashboardShell>
  );
}
