// ==============================================
// DevForge — Docker Run Command Builder Pro Utilities
// ==============================================
// Generate production ready docker run CLI commands
// with flags, volume mounts, env vars & network rules.
// ==============================================

export interface DockerPortMapping {
  hostPort: number;
  containerPort: number;
}

export interface DockerVolumeMount {
  hostPath: string;
  containerPath: string;
}

export interface DockerEnvMapping {
  key: string;
  value: string;
}

export interface DockerRunConfig {
  containerName: string;
  image: string;
  tag: string;
  detach: boolean;
  interactiveTty: boolean;
  removeOnExit: boolean;
  restartPolicy: 'no' | 'always' | 'unless-stopped' | 'on-failure';
  network?: string;
  ports: DockerPortMapping[];
  volumes: DockerVolumeMount[];
  env: DockerEnvMapping[];
  customCommand?: string;
}

export interface DockerRunValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Generates formatted `docker run` command string.
 */
export function generateDockerRunCommand(config: DockerRunConfig): string {
  const flags: string[] = ['docker run'];

  if (config.detach) flags.push('-d');
  if (config.interactiveTty) flags.push('-it');
  if (config.removeOnExit) flags.push('--rm');

  if (config.containerName.trim()) {
    flags.push(`--name ${config.containerName.trim()}`);
  }

  if (config.restartPolicy && config.restartPolicy !== 'no' && !config.removeOnExit) {
    flags.push(`--restart ${config.restartPolicy}`);
  }

  if (config.network && config.network.trim()) {
    flags.push(`--network ${config.network.trim()}`);
  }

  config.ports.forEach((p) => {
    flags.push(`-p ${p.hostPort}:${p.containerPort}`);
  });

  config.volumes.forEach((v) => {
    flags.push(`-v "${v.hostPath}:${v.containerPath}"`);
  });

  config.env.forEach((e) => {
    flags.push(`-e ${e.key}="${e.value}"`);
  });

  const fullImage = `${config.image.trim() || 'nginx'}:${config.tag.trim() || 'latest'}`;
  flags.push(fullImage);

  if (config.customCommand && config.customCommand.trim()) {
    flags.push(config.customCommand.trim());
  }

  // Format nicely across lines if more than 4 flags
  if (flags.length > 5) {
    const first = flags[0];
    const rest = flags.slice(1);
    return [first, ...rest.map((f) => `  ${f}`)].join(' \\\n');
  }

  return flags.join(' ');
}

/**
 * Validates docker run configuration.
 */
export function validateDockerRunConfig(config: DockerRunConfig): DockerRunValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config.image.trim()) {
    errors.push('Docker image repository name is required.');
  }

  if (config.removeOnExit && config.restartPolicy !== 'no') {
    warnings.push('--rm and --restart cannot be combined in standard Docker execution.');
  }

  if (config.tag === 'latest') {
    warnings.push('Pinning a specific image version tag instead of "latest" is recommended.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export const DOCKER_RUN_PRESETS: {
  name: string;
  description: string;
  config: DockerRunConfig;
}[] = [
  {
    name: 'PostgreSQL 16 Persistent Database Server',
    description: 'Background daemon with host volume mount and POSTGRES_PASSWORD secret',
    config: {
      containerName: 'postgres-db',
      image: 'postgres',
      tag: '16-alpine',
      detach: true,
      interactiveTty: false,
      removeOnExit: false,
      restartPolicy: 'unless-stopped',
      ports: [{ hostPort: 5432, containerPort: 5432 }],
      volumes: [{ hostPath: 'pgdata', containerPath: '/var/lib/postgresql/data' }],
      env: [
        { key: 'POSTGRES_USER', value: 'devforge' },
        { key: 'POSTGRES_PASSWORD', value: 'SecureSecretPassword123' },
        { key: 'POSTGRES_DB', value: 'devforge_production' },
      ],
    },
  },
  {
    name: 'Redis 7 In-Memory Cache Server',
    description: 'Fast lightweight Redis cache running on port 6379',
    config: {
      containerName: 'redis-cache',
      image: 'redis',
      tag: '7-alpine',
      detach: true,
      interactiveTty: false,
      removeOnExit: false,
      restartPolicy: 'unless-stopped',
      ports: [{ hostPort: 6379, containerPort: 6379 }],
      volumes: [],
      env: [],
    },
  },
  {
    name: 'Interactive Ubuntu Debug Sandbox',
    description: 'Ephemeral container with bash terminal and auto-cleanup (--rm)',
    config: {
      containerName: 'debug-sandbox',
      image: 'ubuntu',
      tag: '24.04',
      detach: false,
      interactiveTty: true,
      removeOnExit: true,
      restartPolicy: 'no',
      ports: [],
      volumes: [],
      env: [],
      customCommand: '/bin/bash',
    },
  },
];
