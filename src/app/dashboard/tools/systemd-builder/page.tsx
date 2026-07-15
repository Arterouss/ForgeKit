import type { Metadata } from 'next';
import { SystemdBuilderPro } from '@/components/tools/systemd-builder';

export const metadata: Metadata = {
  title: 'Systemd Service Builder — DevForge Developer Studio',
  description:
    'Visual generator for Linux .service unit files with security hardening flags, environment variables, restart policies, and systemctl lifecycle commands.',
};

export default function SystemdBuilderPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <SystemdBuilderPro />
      </div>
  );
}
