import { describe, it, expect } from 'vitest';
import {
  generateK8sManifest,
  validateK8sManifest,
  K8S_PRESETS,
} from '@/lib/k8s-utils';

describe('K8s Manifest Utilities (k8s-utils.ts)', () => {
  it('should generate multi-document YAML with Deployment, Service, and Ingress', () => {
    const config = K8S_PRESETS[0].config;
    const yaml = generateK8sManifest(config);

    expect(yaml).toContain('kind: Deployment');
    expect(yaml).toContain('kind: Service');
    expect(yaml).toContain('kind: Ingress');
    expect(yaml).toContain('---');
    expect(yaml).toContain('replicas: 3');
  });

  it('should validate deployment name DNS compliance and replica warnings', () => {
    const res = validateK8sManifest({
      deployment: {
        name: 'Invalid Name With Spaces',
        namespace: 'default',
        replicas: 1,
        image: 'nginx:latest',
        containerPort: 80,
        env: [],
      },
      service: { enabled: false, type: 'ClusterIP', port: 80, targetPort: 80 },
      ingress: { enabled: false, host: 'example.com', path: '/' },
    });

    expect(res.isValid).toBe(false);
    expect(res.errors[0]).toContain('DNS label standard');
    expect(res.warnings.some((w) => w.includes(':latest'))).toBe(true);
  });
});
