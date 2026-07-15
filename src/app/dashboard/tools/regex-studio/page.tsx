import type { Metadata } from 'next';
import { RegexStudioPro } from '@/components/tools/regex-studio';

export const metadata: Metadata = {
  title: 'Regex Studio Pro — DevForge Developer Studio',
  description:
    'Design, test, and debug regular expressions with live group captures, flag toggles, and preset library.',
};

export default function RegexStudioPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <RegexStudioPro />
      </div>
  );
}
