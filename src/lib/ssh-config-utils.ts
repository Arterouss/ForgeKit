// ==============================================
// DevForge — SSH Config Builder Utils
// ==============================================
// Generate ~/.ssh/config files with multi-host entries,
// ProxyJump bastion routing, IdentityFile selection,
// SSH port forwarding rules, and keep-alive intervals.
// ==============================================

export interface SshHostEntry {
  id: string;
  hostAlias: string;
  hostname: string;
  user: string;
  port?: number;
  identityFile?: string;
  forwardAgent: boolean;
  proxyJump?: string;
  localForward?: string;
  serverAliveInterval?: number;
}

export interface SshConfigDocument {
  includeGlobalDefaults: boolean;
  globalServerAliveInterval: number;
  hosts: SshHostEntry[];
}

export interface SshConfigValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Generates formatted `~/.ssh/config` file content.
 */
export function generateSshConfig(doc: SshConfigDocument): string {
  const lines: string[] = [];

  lines.push('# ==============================================');
  lines.push('# DevForge Generated ~/.ssh/config');
  lines.push('# Ensure proper file permissions: chmod 600 ~/.ssh/config');
  lines.push('# ==============================================');
  lines.push('');

  if (doc.includeGlobalDefaults) {
    lines.push('Host *');
    lines.push(`  ServerAliveInterval ${doc.globalServerAliveInterval || 60}`);
    lines.push('  ServerAliveCountMax 3');
    lines.push('  AddKeysToAgent yes');
    lines.push('');
  }

  doc.hosts.forEach((host) => {
    lines.push(`Host ${host.hostAlias.trim() || 'unnamed-host'}`);
    lines.push(`  HostName ${host.hostname.trim() || 'localhost'}`);
    lines.push(`  User ${host.user.trim() || 'root'}`);

    if (host.port && host.port !== 22) {
      lines.push(`  Port ${host.port}`);
    }

    if (host.identityFile?.trim()) {
      lines.push(`  IdentityFile ${host.identityFile.trim()}`);
    }

    if (host.forwardAgent) {
      lines.push('  ForwardAgent yes');
    }

    if (host.proxyJump?.trim()) {
      lines.push(`  ProxyJump ${host.proxyJump.trim()}`);
    }

    if (host.localForward?.trim()) {
      lines.push(`  LocalForward ${host.localForward.trim()}`);
    }

    if (host.serverAliveInterval && host.serverAliveInterval > 0) {
      lines.push(`  ServerAliveInterval ${host.serverAliveInterval}`);
    }

    lines.push('');
  });

  return lines.join('\n').trim();
}

/**
 * Validates SSH configuration document.
 */
export function validateSshConfig(
  doc: SshConfigDocument
): SshConfigValidationResult {
  const errors: string[] = [];

  if (doc.hosts.length === 0) {
    errors.push('At least one Host entry must be configured.');
  }

  const aliasSet = new Set<string>();
  doc.hosts.forEach((h, idx) => {
    if (!h.hostAlias.trim()) {
      errors.push(`Host entry #${idx + 1} is missing a Host alias.`);
    } else if (aliasSet.has(h.hostAlias.trim())) {
      errors.push(`Duplicate Host alias detected: "${h.hostAlias.trim()}"`);
    } else {
      aliasSet.add(h.hostAlias.trim());
    }

    if (!h.hostname.trim()) {
      errors.push(`Host "${h.hostAlias || `#${idx + 1}`}" requires a HostName (IP or domain).`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export const SSH_PRESETS: {
  name: string;
  description: string;
  document: SshConfigDocument;
}[] = [
  {
    name: 'Bastion / Jump Host Multi-Tier Architecture',
    description: 'Secure private subnet access routing through external SSH jump server',
    document: {
      includeGlobalDefaults: true,
      globalServerAliveInterval: 60,
      hosts: [
        {
          id: 'bastion-1',
          hostAlias: 'bastion',
          hostname: 'bastion.infra.devforge.io',
          user: 'ubuntu',
          port: 2222,
          identityFile: '~/.ssh/id_ed25519_bastion',
          forwardAgent: true,
        },
        {
          id: 'app-prod-1',
          hostAlias: 'prod-app-01',
          hostname: '10.0.10.45',
          user: 'deploy',
          port: 22,
          identityFile: '~/.ssh/id_ed25519_prod',
          forwardAgent: false,
          proxyJump: 'bastion',
        },
        {
          id: 'db-prod-1',
          hostAlias: 'prod-db-tunnel',
          hostname: '10.0.20.15',
          user: 'deploy',
          port: 22,
          identityFile: '~/.ssh/id_ed25519_prod',
          forwardAgent: false,
          proxyJump: 'bastion',
          localForward: '5432 localhost:5432',
        },
      ],
    },
  },
  {
    name: 'GitHub Multiple Accounts Setup (Personal & Work)',
    description: 'Route git pushes cleanly between personal and corporate GitHub credentials',
    document: {
      includeGlobalDefaults: true,
      globalServerAliveInterval: 120,
      hosts: [
        {
          id: 'gh-personal',
          hostAlias: 'github.com',
          hostname: 'github.com',
          user: 'git',
          identityFile: '~/.ssh/id_ed25519_personal',
          forwardAgent: false,
        },
        {
          id: 'gh-work',
          hostAlias: 'github-work',
          hostname: 'github.com',
          user: 'git',
          identityFile: '~/.ssh/id_ed25519_corporate',
          forwardAgent: false,
        },
      ],
    },
  },
  {
    name: 'AWS EC2 Web Server with Port Forwarding',
    description: 'Direct SSH access to cloud instance with tunnel for remote database administration',
    document: {
      includeGlobalDefaults: false,
      globalServerAliveInterval: 60,
      hosts: [
        {
          id: 'aws-ec2-1',
          hostAlias: 'cloud-web',
          hostname: 'ec2-54-210-99-12.compute-1.amazonaws.com',
          user: 'ec2-user',
          port: 22,
          identityFile: '~/.ssh/aws-production-key.pem',
          forwardAgent: false,
          localForward: '8080 localhost:80',
          serverAliveInterval: 30,
        },
      ],
    },
  },
];
