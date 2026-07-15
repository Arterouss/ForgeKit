import type { Metadata } from 'next';
import { HttpHeaderInspectorPro } from '@/components/tools/http-header-inspector';

export const metadata: Metadata = {
  title: 'HTTP Header Inspector — DevForge Developer Studio',
  description:
    'Analyze raw HTTP response headers, evaluate OWASP security posture (HSTS, CSP, X-Frame-Options, nosniff), detect technology stack leaks, and grade security rating.',
};

export default function HttpHeaderInspectorPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <HttpHeaderInspectorPro />
      </div>
  );
}
