import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { JwtDecoderPro } from '@/components/tools/jwt-decoder';

export const metadata: Metadata = {
  title: 'JWT Decoder Pro — DevForge Developer Studio',
  description:
    'Decode, verify structure, and inspect JSON Web Tokens (JWT) locally with timestamp humanization.',
};

export default function JwtDecoderPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <JwtDecoderPro />
      </div>
    </DashboardShell>
  );
}
