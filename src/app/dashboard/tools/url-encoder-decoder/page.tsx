import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { UrlEncoderDecoderPro } from '@/components/tools/url-encoder-decoder';

export const metadata: Metadata = {
  title: 'URL Encoder / Decoder — DevForge Developer Studio',
  description:
    'Encode and decode URLs, URI components, and query parameters with RFC 3986 and form-data (+) modes, plus interactive URL structure and query parameter inspection.',
};

export default function UrlEncoderDecoderPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <UrlEncoderDecoderPro />
      </div>
    </DashboardShell>
  );
}
