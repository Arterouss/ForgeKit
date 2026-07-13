// ==============================================
// DevForge — Systemd Service Builder Utils
// ==============================================
// Generate production-ready Linux systemd unit files
// (.service) with Unit, Service, and Install sections,
// security hardening rules, and systemctl CLI commands.
// ==============================================

export type SystemdServiceType =
  | 'simple'
  | 'exec'
  | 'forking'
  | 'oneshot'
  | 'notify';

export type SystemdRestartPolicy =
  | 'no'
  | 'always'
  | 'on-success'
  | 'on-failure'
  | 'on-abnormal';

export interface SystemdEnvVar {
  key: string;
  value: string;
}

export interface SystemdServiceConfig {
  name: string;
  description: string;
  afterTargets: string[];
  serviceType: SystemdServiceType;
  user: string;
  group: string;
  workingDirectory: string;
  execStart: string;
  execReload?: string;
  execStop?: string;
  restartPolicy: SystemdRestartPolicy;
  restartSec: number;
  environmentVars: SystemdEnvVar[];
  environmentFile?: string;
  protectSystem: boolean;
  privateTmp: boolean;
  wantedBy: string;
}

export interface SystemdValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Generates formatted Systemd `.service` file content.
 */
export function generateSystemdUnitFile(config: SystemdServiceConfig): string {
  const lines: string[] = [];

  // [Unit]
  lines.push('[Unit]');
  lines.push(`Description=${config.description.trim()}`);
  if (config.afterTargets.length > 0) {
    lines.push(`After=${config.afterTargets.join(' ')}`);
  }
  lines.push('');

  // [Service]
  lines.push('[Service]');
  lines.push(`Type=${config.serviceType}`);
  if (config.user.trim()) {
    lines.push(`User=${config.user.trim()}`);
  }
  if (config.group.trim()) {
    lines.push(`Group=${config.group.trim()}`);
  }
  if (config.workingDirectory.trim()) {
    lines.push(`WorkingDirectory=${config.workingDirectory.trim()}`);
  }
  lines.push(`ExecStart=${config.execStart.trim()}`);
  if (config.execReload?.trim()) {
    lines.push(`ExecReload=${config.execReload.trim()}`);
  }
  if (config.execStop?.trim()) {
    lines.push(`ExecStop=${config.execStop.trim()}`);
  }

  lines.push(`Restart=${config.restartPolicy}`);
  if (config.restartPolicy !== 'no') {
    lines.push(`RestartSec=${config.restartSec}s`);
  }

  config.environmentVars.forEach((ev) => {
    if (ev.key.trim() && ev.value.trim()) {
      lines.push(`Environment="${ev.key.trim()}=${ev.value.trim()}"`);
    }
  });

  if (config.environmentFile?.trim()) {
    lines.push(`EnvironmentFile=${config.environmentFile.trim()}`);
  }

  if (config.protectSystem) {
    lines.push('ProtectSystem=full');
  }
  if (config.privateTmp) {
    lines.push('PrivateTmp=true');
  }

  lines.push('');

  // [Install]
  lines.push('[Install]');
  lines.push(`WantedBy=${config.wantedBy.trim() || 'multi-user.target'}`);

  return lines.join('\n').trim();
}

/**
 * Generates `systemctl` installation & lifecycle commands.
 */
export function generateSystemctlCommands(config: SystemdServiceConfig): string {
  const name = config.name.trim().endsWith('.service')
    ? config.name.trim()
    : `${config.name.trim() || 'app'}.service`;

  return [
    `# 1. Install unit file to systemd directory`,
    `sudo cp ${name} /etc/systemd/system/${name}`,
    `sudo chmod 644 /etc/systemd/system/${name}`,
    ``,
    `# 2. Reload systemd daemon to discover new unit`,
    `sudo systemctl daemon-reload`,
    ``,
    `# 3. Enable start on boot and launch immediately`,
    `sudo systemctl enable --now ${name}`,
    ``,
    `# 4. Check live service status and journal logs`,
    `sudo systemctl status ${name}`,
    `sudo journalctl -u ${name} -f`,
  ].join('\n');
}

/**
 * Validates systemd configuration.
 */
export function validateSystemdConfig(
  config: SystemdServiceConfig
): SystemdValidationResult {
  const errors: string[] = [];

  if (!config.name.trim()) {
    errors.push('Service Name is required.');
  }
  if (!config.description.trim()) {
    errors.push('Unit Description is required.');
  }
  if (!config.execStart.trim()) {
    errors.push('ExecStart binary/script command is required.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export const SYSTEMD_PRESETS: {
  name: string;
  description: string;
  config: SystemdServiceConfig;
}[] = [
  {
    name: 'Node.js / Next.js Production Web Service',
    description: 'Managed daemon for Next.js web application server with automatic restart',
    config: {
      name: 'devforge-app',
      description: 'DevForge Next.js Web Application Server',
      afterTargets: ['network.target'],
      serviceType: 'simple',
      user: 'www-data',
      group: 'www-data',
      workingDirectory: '/var/www/devforge',
      execStart: '/usr/bin/node /var/www/devforge/node_modules/next/dist/bin/next start -p 3000',
      execReload: '/bin/kill -s HUP $MAINPID',
      restartPolicy: 'always',
      restartSec: 5,
      environmentVars: [
        { key: 'NODE_ENV', value: 'production' },
        { key: 'PORT', value: '3000' },
      ],
      protectSystem: true,
      privateTmp: true,
      wantedBy: 'multi-user.target',
    },
  },
  {
    name: 'Python FastAPI / Uvicorn API Worker',
    description: 'Systemd managed Python API server running virtualenv uvicorn',
    config: {
      name: 'api-worker',
      description: 'FastAPI Production Microservice Worker',
      afterTargets: ['network.target', 'postgresql.service'],
      serviceType: 'simple',
      user: 'deploy',
      group: 'deploy',
      workingDirectory: '/home/deploy/api',
      execStart: '/home/deploy/api/.venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4',
      restartPolicy: 'on-failure',
      restartSec: 3,
      environmentVars: [{ key: 'PYTHONUNBUFFERED', value: '1' }],
      protectSystem: true,
      privateTmp: true,
      wantedBy: 'multi-user.target',
    },
  },
  {
    name: 'One-shot Boot Setup Script',
    description: 'Runs once during system initialization without persistent daemon process',
    config: {
      name: 'boot-setup',
      description: 'System Initialization One-Shot Script',
      afterTargets: ['network-online.target'],
      serviceType: 'oneshot',
      user: 'root',
      group: 'root',
      workingDirectory: '/root',
      execStart: '/usr/local/bin/init-network-rules.sh',
      restartPolicy: 'no',
      restartSec: 0,
      environmentVars: [],
      protectSystem: false,
      privateTmp: false,
      wantedBy: 'multi-user.target',
    },
  },
];
