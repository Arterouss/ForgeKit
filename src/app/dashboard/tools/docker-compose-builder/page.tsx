import type { Metadata } from 'next';
import { DockerComposeBuilderPro } from '@/components/tools/docker-compose-builder';

export const metadata: Metadata = {
  title: 'Docker Compose Builder Pro — DevForge Developer Studio',
  description:
    'Visual Docker Compose builder with live YAML generation, validation, and production-ready templates.',
};

export default function DockerComposeBuilderPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <DockerComposeBuilderPro />
      </div>
  );
}
