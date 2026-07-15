import type { Metadata } from 'next';
import { JwtDecoderPro } from '@/components/tools/jwt-decoder';

export const metadata: Metadata = {
  title: 'JWT Decoder Pro — DevForge Developer Studio',
  description:
    'Decode, verify structure, and inspect JSON Web Tokens (JWT) locally with timestamp humanization.',
};

export default function JwtDecoderPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <JwtDecoderPro />
      </div>
  );
}
