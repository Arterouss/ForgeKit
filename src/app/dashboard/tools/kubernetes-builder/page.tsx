import type { Metadata } from 'next';
import { KubernetesBuilderPro } from '@/components/tools/kubernetes-builder';

export const metadata: Metadata = {
  title: 'Kubernetes Manifest Builder Pro — DevForge Developer Studio',
  description:
    'Visual Kubernetes Deployment, Service, and Ingress manifest generator with resource limits, TLS, and multi-document YAML export.',
};

export default function KubernetesBuilderPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <KubernetesBuilderPro />
      </div>
  );
}
