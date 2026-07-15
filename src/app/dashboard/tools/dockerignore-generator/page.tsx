import type { Metadata } from 'next';
import { DockerignoreGeneratorPro } from '@/components/tools/dockerignore-generator';

export const metadata: Metadata = {
  title: '.dockerignore Generator Pro — DevForge Developer Studio',
  description:
    'Generate comprehensive, highly-secure .dockerignore files to prevent secret leakage and optimize build cache.',
};

export default function DockerignoreGeneratorPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <DockerignoreGeneratorPro />
      </div>
  );
}
