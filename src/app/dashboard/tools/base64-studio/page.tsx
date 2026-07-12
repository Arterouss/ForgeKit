import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Base64StudioPro } from '@/components/tools/base64-studio';

export const metadata: Metadata = {
  title: 'Base64 Studio Pro — DevForge Developer Studio',
  description:
    'Encode, decode, and inspect Base64 text, images, JSON, and binary files with URL-safe formatting.',
};

export default function Base64StudioPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <Base64StudioPro />
      </div>
    </DashboardShell>
  );
}
