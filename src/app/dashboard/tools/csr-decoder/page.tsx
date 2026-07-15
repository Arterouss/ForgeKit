import type { Metadata } from 'next';
import { CsrDecoderPro } from '@/components/tools/csr-decoder';

export const metadata: Metadata = {
  title: 'X.509 Certificate Signing Request (CSR) Decoder — DevForge Developer Studio',
  description:
    'Inspect PEM-encoded PKCS#10 Certificate Signing Requests to verify Common Name (CN), SANs, Organization fields, and RSA/ECDSA key size.',
};

export default function CsrDecoderPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <CsrDecoderPro />
      </div>
  );
}
