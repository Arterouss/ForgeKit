import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Base32Pro } from '@/components/tools/base32-encoder-decoder';

export const metadata: Metadata = {
  title: 'RFC 4648 Base32 Encoder / Decoder & TOTP Secret Formatter — DevForge Developer Studio',
  description:
    'Encode UTF-8 text into standard RFC 4648 Base32 alphabet (A-Z2-7), decode Base32 secrets, and format 4-character TOTP blocks for Authenticator apps.',
};

export default function Base32Page() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <Base32Pro />
      </div>
    </DashboardShell>
  );
}
