import type { Metadata } from 'next';
import { JsonSchemaBuilderPro } from '@/components/tools/json-schema-builder';

export const metadata: Metadata = {
  title: 'JSON Schema Builder & Validator — DevForge Developer Studio',
  description:
    'Infer JSON Schema Draft-07 automatically from sample JSON data, generate TypeScript Interface definitions, and structurally validate JSON instances.',
};

export default function JsonSchemaBuilderPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <JsonSchemaBuilderPro />
      </div>
  );
}
