// ==============================================
// DevForge — Environment (.env) Builder Pro Utilities
// ==============================================
// Parse, generate, validate .env and .env.example
// files with cross-tool Docker Compose helper.
// ==============================================

export interface EnvVariable {
  id: string;
  key: string;
  value: string;
  comment?: string;
  isSecret?: boolean;
}

export interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

let envIdCounter = 1;
export function generateEnvId(): string {
  return `env_${Date.now()}_${envIdCounter++}`;
}

/**
 * Generates formatted .env file content.
 */
export function generateEnvContent(variables: EnvVariable[]): string {
  const lines: string[] = [];

  variables.forEach((v) => {
    if (v.comment) {
      lines.push(`# ${v.comment}`);
    }
    lines.push(`${v.key}=${v.value}`);
  });

  return lines.join('\n');
}

/**
 * Generates safe .env.example file content masking secret values.
 */
export function generateEnvExampleContent(variables: EnvVariable[]): string {
  const lines: string[] = [];

  variables.forEach((v) => {
    if (v.comment) {
      lines.push(`# ${v.comment}`);
    }
    const displayValue = v.isSecret ? 'CHANGEME_SECRET_VALUE' : v.value;
    lines.push(`${v.key}=${displayValue}`);
  });

  return lines.join('\n');
}

/**
 * Validates environment variable definitions.
 */
export function validateEnvVariables(variables: EnvVariable[]): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const seenKeys = new Set<string>();

  variables.forEach((v, idx) => {
    const trimmedKey = v.key.trim();
    if (!trimmedKey) {
      errors.push(`Row #${idx + 1}: Key name cannot be empty.`);
    } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmedKey)) {
      errors.push(`Row #${idx + 1}: Key "${trimmedKey}" contains invalid characters.`);
    }

    if (seenKeys.has(trimmedKey)) {
      errors.push(`Duplicate environment key "${trimmedKey}".`);
    }
    seenKeys.add(trimmedKey);

    if (v.isSecret && (v.value === 'changeme' || v.value === 'secret' || v.value === '123456')) {
      warnings.push(`Key "${trimmedKey}" is marked secret but uses a weak/default placeholder.`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Cross-Tool Integration: creates standard stack .env template presets.
 */
export const ENV_PRESETS: { name: string; description: string; variables: EnvVariable[] }[] = [
  {
    name: 'Fullstack App (Postgres + Redis + Auth)',
    description: 'Production-ready stack generated for Docker Compose / Next.js',
    variables: [
      { id: generateEnvId(), key: 'NODE_ENV', value: 'production', comment: 'Application runtime environment' },
      { id: generateEnvId(), key: 'PORT', value: '3000' },
      { id: generateEnvId(), key: 'DATABASE_URL', value: 'postgresql://postgres:securepass@postgres:5432/devforge', isSecret: true, comment: 'Primary PostgreSQL DSN' },
      { id: generateEnvId(), key: 'REDIS_URL', value: 'redis://redis:6379', isSecret: false, comment: 'Redis cache endpoint' },
      { id: generateEnvId(), key: 'NEXTAUTH_SECRET', value: 'replace_with_32_byte_hex_secret', isSecret: true, comment: 'JWT signing secret' },
      { id: generateEnvId(), key: 'NEXTAUTH_URL', value: 'https://devforge.app' },
    ],
  },
  {
    name: 'Python Microservice API',
    description: 'FastAPI / Django REST API environment variables',
    variables: [
      { id: generateEnvId(), key: 'APP_ENV', value: 'production' },
      { id: generateEnvId(), key: 'DEBUG', value: 'false' },
      { id: generateEnvId(), key: 'SECRET_KEY', value: 'replace_with_secret_key_here', isSecret: true },
      { id: generateEnvId(), key: 'ALLOWED_HOSTS', value: 'api.devforge.app,localhost' },
    ],
  },
];
