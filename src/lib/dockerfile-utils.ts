// ==============================================
// DevForge — Dockerfile Builder Pro Utilities
// ==============================================
// Visual Dockerfile multi-stage builder, live
// generator, validator, and stack templates.
// ==============================================

export type InstructionType =
  | 'FROM'
  | 'WORKDIR'
  | 'COPY'
  | 'RUN'
  | 'ENV'
  | 'EXPOSE'
  | 'USER'
  | 'CMD'
  | 'ENTRYPOINT'
  | 'HEALTHCHECK';

export interface DockerfileStep {
  id: string;
  type: InstructionType;
  value: string;
  comment?: string;
}

export interface DockerfileStage {
  id: string;
  name?: string;
  baseImage: string;
  steps: DockerfileStep[];
}

export interface DockerfileConfig {
  stages: DockerfileStage[];
}

export interface DockerfileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface DockerfilePreset {
  name: string;
  description: string;
  config: DockerfileConfig;
  suggestedDockerignore: string[];
}

let stepIdCounter = 1;
export function generateStepId(): string {
  return `step_${Date.now()}_${stepIdCounter++}`;
}

/**
 * Generates a complete Dockerfile string from config stages.
 */
export function generateDockerfile(config: DockerfileConfig): string {
  if (!config.stages || config.stages.length === 0) {
    return '# Empty Dockerfile config';
  }

  const lines: string[] = [];

  config.stages.forEach((stage, stageIndex) => {
    if (stageIndex > 0) lines.push('');

    const fromLine = stage.name
      ? `FROM ${stage.baseImage} AS ${stage.name}`
      : `FROM ${stage.baseImage}`;
    lines.push(fromLine);

    stage.steps.forEach((step) => {
      if (step.comment) {
        lines.push(`# ${step.comment}`);
      }
      lines.push(`${step.type} ${step.value}`);
    });
  });

  return lines.join('\n');
}

/**
 * Validates a Dockerfile config for syntax & best practices.
 */
export function validateDockerfile(config: DockerfileConfig): DockerfileValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config.stages || config.stages.length === 0) {
    errors.push('At least one FROM stage is required.');
    return { isValid: false, errors, warnings };
  }

  config.stages.forEach((stage, idx) => {
    const stageLabel = stage.name ? `Stage "${stage.name}"` : `Stage ${idx + 1}`;
    if (!stage.baseImage || !stage.baseImage.trim()) {
      errors.push(`${stageLabel}: Base image is missing.`);
    } else if (stage.baseImage === 'latest' || stage.baseImage.endsWith(':latest')) {
      warnings.push(`${stageLabel}: Using "latest" tag is not recommended for production.`);
    }

    const hasUser = stage.steps.some((s) => s.type === 'USER' && s.value.trim() !== 'root');
    if (!hasUser && idx === config.stages.length - 1) {
      warnings.push('Final runtime stage runs as root. Consider adding a non-root USER instruction.');
    }
  });

  const lastStage = config.stages[config.stages.length - 1];
  const hasCmdOrEntry = lastStage?.steps.some(
    (s) => s.type === 'CMD' || s.type === 'ENTRYPOINT'
  );

  if (!hasCmdOrEntry) {
    warnings.push('Final stage has no CMD or ENTRYPOINT defined.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Cross-tool integration: returns suggested .dockerignore rules based on base image / stack.
 */
export function suggestDockerignoreRules(baseImage: string): string[] {
  const lower = baseImage.toLowerCase();
  const common = ['.git', '.gitignore', 'README.md', 'Dockerfile', '.dockerignore'];

  if (lower.includes('node') || lower.includes('next')) {
    return [
      ...common,
      'node_modules',
      'npm-debug.log',
      'yarn-error.log',
      'pnpm-lock.yaml',
      '.next',
      '.env*.local',
    ];
  }

  if (lower.includes('python')) {
    return [
      ...common,
      '__pycache__',
      '*.pyc',
      '*.pyo',
      '*.pyd',
      '.Python',
      'env',
      'venv',
      '.venv',
      '*.egg-info',
    ];
  }

  if (lower.includes('golang')) {
    return [...common, '*.exe', '*.test', 'vendor'];
  }

  return common;
}

export const DOCKERFILE_PRESETS: DockerfilePreset[] = [
  {
    name: 'Next.js 15 Standalone Multi-Stage',
    description: 'Optimized production build for Next.js App Router using output: standalone',
    suggestedDockerignore: [
      'node_modules',
      '.next',
      '.git',
      'README.md',
      'Dockerfile',
      '.dockerignore',
    ],
    config: {
      stages: [
        {
          id: 'stage_deps',
          name: 'deps',
          baseImage: 'node:20-alpine',
          steps: [
            { id: generateStepId(), type: 'WORKDIR', value: '/app' },
            { id: generateStepId(), type: 'COPY', value: 'package*.json ./', comment: 'Install dependencies' },
            { id: generateStepId(), type: 'RUN', value: 'npm ci' },
          ],
        },
        {
          id: 'stage_builder',
          name: 'builder',
          baseImage: 'node:20-alpine',
          steps: [
            { id: generateStepId(), type: 'WORKDIR', value: '/app' },
            { id: generateStepId(), type: 'COPY', value: '--from=deps /app/node_modules ./node_modules' },
            { id: generateStepId(), type: 'COPY', value: '. .' },
            { id: generateStepId(), type: 'ENV', value: 'NEXT_TELEMETRY_DISABLED=1' },
            { id: generateStepId(), type: 'RUN', value: 'npm run build' },
          ],
        },
        {
          id: 'stage_runner',
          name: 'runner',
          baseImage: 'node:20-alpine',
          steps: [
            { id: generateStepId(), type: 'WORKDIR', value: '/app' },
            { id: generateStepId(), type: 'ENV', value: 'NODE_ENV=production' },
            { id: generateStepId(), type: 'RUN', value: 'addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs' },
            { id: generateStepId(), type: 'COPY', value: '--from=builder /app/public ./public' },
            { id: generateStepId(), type: 'COPY', value: '--from=builder --chown=nextjs:nodejs /app/.next/standalone ./' },
            { id: generateStepId(), type: 'COPY', value: '--from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static' },
            { id: generateStepId(), type: 'USER', value: 'nextjs' },
            { id: generateStepId(), type: 'EXPOSE', value: '3000' },
            { id: generateStepId(), type: 'ENV', value: 'PORT=3000' },
            { id: generateStepId(), type: 'CMD', value: '["node", "server.js"]' },
          ],
        },
      ],
    },
  },
  {
    name: 'Node.js Express Production API',
    description: 'Clean single-stage or multi-stage Express API server with non-root user',
    suggestedDockerignore: ['node_modules', 'dist', '.git', '.env'],
    config: {
      stages: [
        {
          id: 'stage_api',
          baseImage: 'node:20-alpine',
          steps: [
            { id: generateStepId(), type: 'WORKDIR', value: '/app' },
            { id: generateStepId(), type: 'COPY', value: 'package*.json ./' },
            { id: generateStepId(), type: 'RUN', value: 'npm ci --only=production' },
            { id: generateStepId(), type: 'COPY', value: '. .' },
            { id: generateStepId(), type: 'USER', value: 'node' },
            { id: generateStepId(), type: 'EXPOSE', value: '8080' },
            { id: generateStepId(), type: 'CMD', value: '["node", "dist/index.js"]' },
          ],
        },
      ],
    },
  },
  {
    name: 'Python FastAPI Microservice',
    description: 'FastAPI server running with Uvicorn worker process',
    suggestedDockerignore: ['__pycache__', 'venv', '.git', '.env'],
    config: {
      stages: [
        {
          id: 'stage_py',
          baseImage: 'python:3.12-slim',
          steps: [
            { id: generateStepId(), type: 'WORKDIR', value: '/app' },
            { id: generateStepId(), type: 'COPY', value: 'requirements.txt .' },
            { id: generateStepId(), type: 'RUN', value: 'pip install --no-cache-dir -r requirements.txt' },
            { id: generateStepId(), type: 'COPY', value: '. .' },
            { id: generateStepId(), type: 'EXPOSE', value: '8000' },
            { id: generateStepId(), type: 'CMD', value: '["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]' },
          ],
        },
      ],
    },
  },
  {
    name: 'Golang Static Binary Build',
    description: 'Minimal scratch container holding pure Go compiled binary',
    suggestedDockerignore: ['*.exe', 'vendor', '.git'],
    config: {
      stages: [
        {
          id: 'stage_go_build',
          name: 'builder',
          baseImage: 'golang:1.22-alpine',
          steps: [
            { id: generateStepId(), type: 'WORKDIR', value: '/src' },
            { id: generateStepId(), type: 'COPY', value: 'go.mod go.sum ./' },
            { id: generateStepId(), type: 'RUN', value: 'go mod download' },
            { id: generateStepId(), type: 'COPY', value: '. .' },
            { id: generateStepId(), type: 'RUN', value: 'CGO_ENABLED=0 GOOS=linux go build -o /app/server .' },
          ],
        },
        {
          id: 'stage_go_run',
          baseImage: 'alpine:latest',
          steps: [
            { id: generateStepId(), type: 'WORKDIR', value: '/app' },
            { id: generateStepId(), type: 'COPY', value: '--from=builder /app/server /app/server' },
            { id: generateStepId(), type: 'EXPOSE', value: '8080' },
            { id: generateStepId(), type: 'ENTRYPOINT', value: '["/app/server"]' },
          ],
        },
      ],
    },
  },
];
