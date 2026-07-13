import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { HexPro } from '@/components/tools/hex-encoder-decoder';

export const metadata: Metadata = {
  title: 'Hexadecimal Encoder / Decoder & Memory Byte Dump Viewer — DevForge Developer Studio',
  description:
    'Encode UTF-8 strings into Hex bytes with custom delimiters (space, colon, 0x), decode Hex payloads, and inspect 16-byte memory hex dumps.',
};

export default function HexPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <HexPro />
      </div>
    </DashboardShell>
  );
}
