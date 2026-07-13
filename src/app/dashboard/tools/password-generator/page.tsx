import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { PasswordGeneratorPro } from '@/components/tools/password-generator';

export const metadata: Metadata = {
  title: 'Password & Passphrase Generator Pro — DevForge Developer Studio',
  description:
    'Generate cryptographically secure random passwords and word passphrases locally with entropy bits calculation and crack resistance scoring.',
};

export default function PasswordGeneratorPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <PasswordGeneratorPro />
      </div>
    </DashboardShell>
  );
}
