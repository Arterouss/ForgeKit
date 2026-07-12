import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { EnvBuilderPro } from '@/components/tools/env-builder';

export const metadata: Metadata = {
  title: 'Environment (.env) Builder Pro — DevForge Developer Studio',
  description:
    'Visual .env file editor with secret masking, .env.example generator, validation, and Docker Compose integration.',
};

export default function EnvBuilderPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <EnvBuilderPro />
      </div>
    </DashboardShell>
  );
}
