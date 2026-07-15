import type { Metadata } from 'next';
import { SshConfigValidatorPro } from '@/components/tools/ssh-config-validator';

export const metadata: Metadata = {
  title: 'SSH Config Validator — DevForge Developer Studio',
  description:
    'Interactive ~/.ssh/config security scanner and syntax linter detecting duplicate Host aliases, wildcard shadowing, Agent Forwarding risks, and formatting issues.',
};

export default function SshConfigValidatorPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <SshConfigValidatorPro />
      </div>
  );
}
