import type { Metadata } from 'next';
import { GraphQlExplorerPro } from '@/components/tools/graphql-explorer';

export const metadata: Metadata = {
  title: 'GraphQL Explorer & Query Builder — DevForge Developer Studio',
  description:
    'Construct GraphQL queries and mutations, format operation syntax, define query variables, and generate HTTP execution cURL scripts.',
};

export default function GraphQlExplorerPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <GraphQlExplorerPro />
      </div>
  );
}
