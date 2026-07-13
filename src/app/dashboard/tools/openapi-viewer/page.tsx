import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { OpenApiViewerPro } from '@/components/tools/openapi-viewer';

export const metadata: Metadata = {
  title: 'OpenAPI / Swagger Viewer — DevForge Developer Studio',
  description:
    'Inspect OpenAPI 3.0 and Swagger API specifications, browse endpoint routes, view parameter schemas, and generate cURL test commands.',
};

export default function OpenApiViewerPage() {
  return (
    <DashboardShell>
      <div className="flex flex-1 flex-col p-6">
        <OpenApiViewerPro />
      </div>
    </DashboardShell>
  );
}
