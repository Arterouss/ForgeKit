// ==============================================
// DevForge — chown Command Builder Utils
// ==============================================
// Generate production-ready Linux chown and chgrp
// commands with ownership syntax rules, recursive
// traversal flags, and reference file options.
// ==============================================

export interface ChownConfig {
  owner: string;
  group: string;
  separator: ':' | '.';
  targetPaths: string[];
  recursive: boolean;
  preserveRoot: boolean;
  noDereference: boolean;
  verboseMode: 'none' | 'verbose' | 'changes';
  referenceFile?: string;
  useReference: boolean;
}

export interface ChownValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Generates the ownership specification string (e.g. "www-data:www-data" or ":deploy").
 */
export function generateOwnershipSpec(config: ChownConfig): string {
  if (config.useReference && config.referenceFile?.trim()) {
    return `--reference=${config.referenceFile.trim()}`;
  }

  const owner = config.owner.trim();
  const group = config.group.trim();

  if (owner && group) {
    return `${owner}${config.separator}${group}`;
  }
  if (!owner && group) {
    return `:${group}`;
  }
  return owner || 'root:root';
}

/**
 * Generates the full `chown` CLI command.
 */
export function generateChownCommand(config: ChownConfig): string {
  const flags: string[] = [];

  if (config.recursive) {
    flags.push('-R');
  }
  if (config.noDereference) {
    flags.push('-h');
  }
  if (config.preserveRoot && config.recursive) {
    flags.push('--preserve-root');
  }
  if (config.verboseMode === 'verbose') {
    flags.push('-v');
  } else if (config.verboseMode === 'changes') {
    flags.push('-c');
  }

  const flagStr = flags.length > 0 ? `${flags.join(' ')} ` : '';
  const spec = generateOwnershipSpec(config);

  const targets =
    config.targetPaths.filter((t) => t.trim().length > 0).join(' ') ||
    '/path/to/file';

  return `chown ${flagStr}${spec} ${targets}`.trim();
}

/**
 * Validates chown configuration.
 */
export function validateChownConfig(
  config: ChownConfig
): ChownValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config.useReference && !config.owner.trim() && !config.group.trim()) {
    errors.push('At least an owner or a group must be specified.');
  }

  if (config.useReference && !config.referenceFile?.trim()) {
    errors.push('Reference file path is required when --reference is enabled.');
  }

  if (config.targetPaths.filter((t) => t.trim().length > 0).length === 0) {
    errors.push('At least one target path must be provided.');
  }

  if (
    config.recursive &&
    config.targetPaths.some((p) => p.trim() === '/' || p.trim() === '/*') &&
    !config.preserveRoot
  ) {
    warnings.push(
      'WARNING: Running recursive chown on root directory without --preserve-root is extremely dangerous.'
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export const CHOWN_PRESETS: {
  name: string;
  description: string;
  config: ChownConfig;
}[] = [
  {
    name: 'Nginx / Apache Web Root (www-data)',
    description: 'Assign web folder ownership recursively to www-data user and group',
    config: {
      owner: 'www-data',
      group: 'www-data',
      separator: ':',
      targetPaths: ['/var/www/html'],
      recursive: true,
      preserveRoot: true,
      noDereference: false,
      verboseMode: 'changes',
      useReference: false,
    },
  },
  {
    name: 'Secure SSH Directory (owner only)',
    description: 'Assign ownership of ~/.ssh directory to current deployment user',
    config: {
      owner: 'deploy',
      group: 'deploy',
      separator: ':',
      targetPaths: ['/home/deploy/.ssh'],
      recursive: true,
      preserveRoot: true,
      noDereference: true,
      verboseMode: 'none',
      useReference: false,
    },
  },
  {
    name: 'Docker Volume Storage Root',
    description: 'Set container UID/GID ownership (e.g. 1000:1000) for bind mounts',
    config: {
      owner: '1000',
      group: '1000',
      separator: ':',
      targetPaths: ['/mnt/docker-data'],
      recursive: true,
      preserveRoot: true,
      noDereference: false,
      verboseMode: 'verbose',
      useReference: false,
    },
  },
  {
    name: 'Clone Ownership from Existing File (--reference)',
    description: 'Copy exact owner and group from a reference configuration file',
    config: {
      owner: '',
      group: '',
      separator: ':',
      targetPaths: ['/etc/nginx/sites-available/app.conf'],
      recursive: false,
      preserveRoot: true,
      noDereference: false,
      verboseMode: 'none',
      useReference: true,
      referenceFile: '/etc/nginx/nginx.conf',
    },
  },
];
