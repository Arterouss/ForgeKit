// ==============================================
// DevForge — Docker Compose Builder Pro Utilities
// ==============================================
// Visual Docker Compose service builder with
// live YAML generation, validation, and presets.
// ==============================================

import * as yamlLib from 'js-yaml';

const yaml = (yamlLib as unknown as { default?: typeof yamlLib }).default ?? yamlLib;

export interface DockerPort {
  host: string;
  container: string;
}

export interface DockerVolume {
  source: string;
  target: string;
}

export interface DockerEnvVar {
  key: string;
  value: string;
}

export interface DockerService {
  id: string;
  name: string;
  image: string;
  containerName?: string;
  buildContext?: string;
  ports: DockerPort[];
  environment: DockerEnvVar[];
  volumes: DockerVolume[];
  networks: string[];
  restartPolicy: 'no' | 'always' | 'on-failure' | 'unless-stopped';
  dependsOn: string[];
  command?: string;
}

export interface DockerComposeProject {
  version: string;
  services: DockerService[];
  globalNetworks: string[];
  globalVolumes: string[];
}

export interface ComposeValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

export interface DockerPreset {
  name: string;
  description: string;
  services: DockerService[];
}

let serviceIdCounter = 1;

export function generateServiceId(): string {
  return `svc_${Date.now()}_${serviceIdCounter++}`;
}

/**
 * Creates an empty Docker service with sensible defaults.
 */
export function createEmptyService(name = 'app'): DockerService {
  return {
    id: generateServiceId(),
    name,
    image: '',
    ports: [],
    environment: [],
    volumes: [],
    networks: [],
    restartPolicy: 'unless-stopped',
    dependsOn: [],
  };
}

/**
 * Generates a docker-compose.yml YAML string from the project state.
 */
export function generateComposeYaml(project: DockerComposeProject): string {
  const compose: Record<string, unknown> = {
    version: project.version,
    services: {} as Record<string, unknown>,
  };

  const services = compose.services as Record<string, unknown>;

  for (const svc of project.services) {
    const svcObj: Record<string, unknown> = {};

    if (svc.image) svcObj.image = svc.image;
    if (svc.buildContext) svcObj.build = svc.buildContext;
    if (svc.containerName) svcObj.container_name = svc.containerName;
    if (svc.command) svcObj.command = svc.command;

    if (svc.ports.length > 0) {
      svcObj.ports = svc.ports.map((p) => `${p.host}:${p.container}`);
    }

    if (svc.environment.length > 0) {
      const env: Record<string, string> = {};
      for (const e of svc.environment) {
        env[e.key] = e.value;
      }
      svcObj.environment = env;
    }

    if (svc.volumes.length > 0) {
      svcObj.volumes = svc.volumes.map((v) => `${v.source}:${v.target}`);
    }

    if (svc.networks.length > 0) {
      svcObj.networks = svc.networks;
    }

    if (svc.restartPolicy !== 'no') {
      svcObj.restart = svc.restartPolicy;
    }

    if (svc.dependsOn.length > 0) {
      svcObj.depends_on = svc.dependsOn;
    }

    services[svc.name] = svcObj;
  }

  if (project.globalVolumes.length > 0) {
    const volObj: Record<string, null> = {};
    for (const v of project.globalVolumes) {
      volObj[v] = null;
    }
    compose.volumes = volObj;
  }

  if (project.globalNetworks.length > 0) {
    const netObj: Record<string, null> = {};
    for (const n of project.globalNetworks) {
      netObj[n] = null;
    }
    compose.networks = netObj;
  }

  return yaml.dump(compose, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
    sortKeys: false,
  });
}

/**
 * Validates Docker Compose project for common errors.
 */
export function validateComposeProject(
  project: DockerComposeProject
): ComposeValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (project.services.length === 0) {
    errors.push('At least one service is required.');
    return { isValid: false, errors, warnings };
  }

  const usedPorts = new Set<string>();
  const serviceNames = new Set<string>();

  for (const svc of project.services) {
    // Duplicate service names
    if (serviceNames.has(svc.name)) {
      errors.push(`Duplicate service name "${svc.name}".`);
    }
    serviceNames.add(svc.name);

    // Missing image or build
    if (!svc.image && !svc.buildContext) {
      errors.push(
        `Service "${svc.name}" has no image or build context specified.`
      );
    }

    // Duplicate host ports
    for (const port of svc.ports) {
      if (usedPorts.has(port.host)) {
        errors.push(
          `Host port ${port.host} is already mapped by another service (conflict in "${svc.name}").`
        );
      }
      usedPorts.add(port.host);

      // Invalid port range
      const hostNum = parseInt(port.host, 10);
      const containerNum = parseInt(port.container, 10);
      if (isNaN(hostNum) || isNaN(containerNum) || hostNum <= 0 || containerNum <= 0) {
        errors.push(
          `Service "${svc.name}" has invalid port mapping ${port.host}:${port.container}.`
        );
      }
    }

    // Depends-on references valid services
    for (const dep of svc.dependsOn) {
      if (!project.services.some((s) => s.name === dep && s.name !== svc.name)) {
        warnings.push(
          `Service "${svc.name}" depends_on "${dep}" which is not defined.`
        );
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// ===== Service Presets =====

function makePostgresService(): DockerService {
  return {
    id: generateServiceId(),
    name: 'postgres',
    image: 'postgres:16-alpine',
    ports: [{ host: '5432', container: '5432' }],
    environment: [
      { key: 'POSTGRES_DB', value: 'devforge' },
      { key: 'POSTGRES_USER', value: 'postgres' },
      { key: 'POSTGRES_PASSWORD', value: 'changeme' },
    ],
    volumes: [{ source: 'pgdata', target: '/var/lib/postgresql/data' }],
    networks: [],
    restartPolicy: 'unless-stopped',
    dependsOn: [],
  };
}

function makeRedisService(): DockerService {
  return {
    id: generateServiceId(),
    name: 'redis',
    image: 'redis:7-alpine',
    ports: [{ host: '6379', container: '6379' }],
    environment: [],
    volumes: [],
    networks: [],
    restartPolicy: 'unless-stopped',
    dependsOn: [],
  };
}

function makeNginxService(): DockerService {
  return {
    id: generateServiceId(),
    name: 'nginx',
    image: 'nginx:alpine',
    ports: [{ host: '80', container: '80' }],
    environment: [],
    volumes: [{ source: './nginx.conf', target: '/etc/nginx/nginx.conf' }],
    networks: [],
    restartPolicy: 'always',
    dependsOn: [],
  };
}

function makeNextjsService(): DockerService {
  return {
    id: generateServiceId(),
    name: 'nextjs',
    image: '',
    buildContext: '.',
    ports: [{ host: '3000', container: '3000' }],
    environment: [
      { key: 'NODE_ENV', value: 'production' },
      { key: 'DATABASE_URL', value: 'postgresql://postgres:changeme@postgres:5432/devforge' },
    ],
    volumes: [],
    networks: [],
    restartPolicy: 'unless-stopped',
    dependsOn: ['postgres'],
  };
}

export const DOCKER_PRESETS: DockerPreset[] = [
  {
    name: 'Next.js + PostgreSQL',
    description: 'Fullstack Next.js app with PostgreSQL database',
    services: [makeNextjsService(), makePostgresService()],
  },
  {
    name: 'Node API + Redis',
    description: 'Node.js API server with Redis cache',
    services: [
      {
        id: generateServiceId(),
        name: 'api',
        image: '',
        buildContext: '.',
        ports: [{ host: '4000', container: '4000' }],
        environment: [
          { key: 'REDIS_URL', value: 'redis://redis:6379' },
          { key: 'NODE_ENV', value: 'production' },
        ],
        volumes: [],
        networks: [],
        restartPolicy: 'unless-stopped',
        dependsOn: ['redis'],
      },
      makeRedisService(),
    ],
  },
  {
    name: 'WordPress + MySQL',
    description: 'WordPress CMS with MySQL database',
    services: [
      {
        id: generateServiceId(),
        name: 'wordpress',
        image: 'wordpress:latest',
        ports: [{ host: '8080', container: '80' }],
        environment: [
          { key: 'WORDPRESS_DB_HOST', value: 'mysql:3306' },
          { key: 'WORDPRESS_DB_NAME', value: 'wordpress' },
          { key: 'WORDPRESS_DB_USER', value: 'wp_user' },
          { key: 'WORDPRESS_DB_PASSWORD', value: 'changeme' },
        ],
        volumes: [{ source: 'wp_data', target: '/var/www/html' }],
        networks: [],
        restartPolicy: 'always',
        dependsOn: ['mysql'],
      },
      {
        id: generateServiceId(),
        name: 'mysql',
        image: 'mysql:8.0',
        ports: [{ host: '3306', container: '3306' }],
        environment: [
          { key: 'MYSQL_DATABASE', value: 'wordpress' },
          { key: 'MYSQL_USER', value: 'wp_user' },
          { key: 'MYSQL_PASSWORD', value: 'changeme' },
          { key: 'MYSQL_ROOT_PASSWORD', value: 'rootpassword' },
        ],
        volumes: [{ source: 'mysql_data', target: '/var/lib/mysql' }],
        networks: [],
        restartPolicy: 'unless-stopped',
        dependsOn: [],
      },
    ],
  },
  {
    name: 'Nginx Reverse Proxy',
    description: 'Nginx as a reverse proxy in front of app',
    services: [makeNginxService()],
  },
];
