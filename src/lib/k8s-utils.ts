// ==============================================
// DevForge — Kubernetes Manifest Builder Pro Utilities
// ==============================================
// Generate production-ready Kubernetes YAML manifests
// (Deployment, Service, ConfigMap, Ingress) with
// cross-tool Docker Compose conversion helper.
// ==============================================

export interface K8sContainerEnv {
  name: string;
  value: string;
}

export interface K8sDeploymentConfig {
  name: string;
  namespace: string;
  replicas: number;
  image: string;
  containerPort: number;
  cpuLimit?: string;
  memoryLimit?: string;
  env: K8sContainerEnv[];
}

export interface K8sServiceConfig {
  enabled: boolean;
  type: 'ClusterIP' | 'NodePort' | 'LoadBalancer';
  port: number;
  targetPort: number;
}

export interface K8sIngressConfig {
  enabled: boolean;
  host: string;
  path: string;
  tlsEnabled?: boolean;
}

export interface K8sManifestConfig {
  deployment: K8sDeploymentConfig;
  service: K8sServiceConfig;
  ingress: K8sIngressConfig;
}

export interface K8sValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Generates multi-document Kubernetes YAML manifest.
 */
export function generateK8sManifest(config: K8sManifestConfig): string {
  const docs: string[] = [];

  // 1. Deployment
  const envYaml =
    config.deployment.env && config.deployment.env.length > 0
      ? `\n          env:\n` +
        config.deployment.env
          .map((e) => `            - name: ${e.name}\n              value: "${e.value}"`)
          .join('\n')
      : '';

  const resourcesYaml =
    config.deployment.cpuLimit || config.deployment.memoryLimit
      ? `\n          resources:\n            limits:\n` +
        (config.deployment.cpuLimit ? `              cpu: "${config.deployment.cpuLimit}"\n` : '') +
        (config.deployment.memoryLimit ? `              memory: "${config.deployment.memoryLimit}"` : '')
      : '';

  const deploymentYaml = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${config.deployment.name}
  namespace: ${config.deployment.namespace || 'default'}
  labels:
    app: ${config.deployment.name}
spec:
  replicas: ${config.deployment.replicas}
  selector:
    matchLabels:
      app: ${config.deployment.name}
  template:
    metadata:
      labels:
        app: ${config.deployment.name}
    spec:
      containers:
        - name: ${config.deployment.name}
          image: ${config.deployment.image}
          ports:
            - containerPort: ${config.deployment.containerPort}${envYaml}${resourcesYaml}`;

  docs.push(deploymentYaml.trim());

  // 2. Service
  if (config.service.enabled) {
    const serviceYaml = `apiVersion: v1
kind: Service
metadata:
  name: ${config.deployment.name}-service
  namespace: ${config.deployment.namespace || 'default'}
metadata:
  labels:
    app: ${config.deployment.name}
spec:
  type: ${config.service.type}
  selector:
    app: ${config.deployment.name}
  ports:
    - protocol: TCP
      port: ${config.service.port}
      targetPort: ${config.service.targetPort}`;
    docs.push(serviceYaml.trim());
  }

  // 3. Ingress
  if (config.ingress.enabled) {
    const tlsYaml = config.ingress.tlsEnabled
      ? `\n  tls:\n    - hosts:\n        - ${config.ingress.host}\n      secretName: ${config.deployment.name}-tls`
      : '';
    const ingressYaml = `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ${config.deployment.name}-ingress
  namespace: ${config.deployment.namespace || 'default'}
spec:${tlsYaml}
  rules:
    - host: ${config.ingress.host}
      http:
        paths:
          - path: ${config.ingress.path}
            pathType: Prefix
            backend:
              service:
                name: ${config.deployment.name}-service
                port:
                  number: ${config.service.port}`;
    docs.push(ingressYaml.trim());
  }

  return docs.join('\n---\n');
}

/**
 * Validates Kubernetes configuration.
 */
export function validateK8sManifest(config: K8sManifestConfig): K8sValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config.deployment.name.trim()) {
    errors.push('Deployment metadata.name is required.');
  } else if (!/^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/.test(config.deployment.name)) {
    errors.push('Deployment name must follow DNS label standard (lowercase, hyphens).');
  }

  if (!config.deployment.image.trim()) {
    errors.push('Container image is required.');
  } else if (config.deployment.image.endsWith(':latest')) {
    warnings.push('Using ":latest" image tag is discouraged in production.');
  }

  if (config.deployment.replicas < 1) {
    errors.push('Replicas must be at least 1.');
  } else if (config.deployment.replicas === 1) {
    warnings.push('Running 1 replica provides no high availability during rolling updates.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export const K8S_PRESETS: { name: string; description: string; config: K8sManifestConfig }[] = [
  {
    name: 'Next.js HA Production Stack',
    description: '3 Replicas + ClusterIP Service + TLS Ingress Rule',
    config: {
      deployment: {
        name: 'nextjs-app',
        namespace: 'production',
        replicas: 3,
        image: 'ghcr.io/org/nextjs-app:v1.0.0',
        containerPort: 3000,
        cpuLimit: '500m',
        memoryLimit: '512Mi',
        env: [
          { name: 'NODE_ENV', value: 'production' },
          { name: 'PORT', value: '3000' },
        ],
      },
      service: {
        enabled: true,
        type: 'ClusterIP',
        port: 80,
        targetPort: 3000,
      },
      ingress: {
        enabled: true,
        host: 'app.devforge.io',
        path: '/',
        tlsEnabled: true,
      },
    },
  },
  {
    name: 'Node.js Express Microservice',
    description: '2 Replicas + ClusterIP Service without Ingress',
    config: {
      deployment: {
        name: 'user-service',
        namespace: 'backend',
        replicas: 2,
        image: 'org/user-service:v2.1.0',
        containerPort: 8080,
        cpuLimit: '250m',
        memoryLimit: '256Mi',
        env: [{ name: 'LOG_LEVEL', value: 'info' }],
      },
      service: {
        enabled: true,
        type: 'ClusterIP',
        port: 8080,
        targetPort: 8080,
      },
      ingress: {
        enabled: false,
        host: 'api.devforge.io',
        path: '/users',
      },
    },
  },
];
