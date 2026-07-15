import type { Metadata } from 'next';
import { JsonFormatterPro } from '@/components/tools/json-formatter';

export const metadata: Metadata = {
  title: 'JSON Formatter Pro — DevForge Developer Studio',
  description:
    'Beautify, validate, minify, and inspect JSON documents with interactive Tree View and JSON Path explorer.',
};

export default function JsonFormatterPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <JsonFormatterPro />
      </div>
  );
}
