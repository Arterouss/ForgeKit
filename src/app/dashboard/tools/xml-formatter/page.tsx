import type { Metadata } from 'next';
import { XmlFormatterPro } from '@/components/tools/xml-formatter';

export const metadata: Metadata = {
  title: 'XML Formatter Pro — DevForge Developer Studio',
  description:
    'Beautify, minify, validate, and inspect XML documents with interactive tree view and SOAP/RSS/Maven templates.',
};

export default function XmlFormatterPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <XmlFormatterPro />
      </div>
  );
}
