// ==============================================
// DevForge — SSH Config Validator Utils
// ==============================================
// Parse and inspect existing ~/.ssh/config files for
// duplicate host aliases, wildcard shadowing, missing
// HostName/User directives, and security best practices.
// ==============================================

export type SshDiagnosticSeverity = 'error' | 'warning' | 'info';

export interface SshConfigDiagnostic {
  line?: number;
  hostAlias?: string;
  severity: SshDiagnosticSeverity;
  title: string;
  message: string;
}

export interface SshConfigInspectionResult {
  isValid: boolean;
  score: number; // 0-100 quality score
  parsedHostCount: number;
  diagnostics: SshConfigDiagnostic[];
  formattedConfig: string;
}

/**
 * Inspects and validates raw `~/.ssh/config` string content.
 */
export function inspectSshConfig(rawConfig: string): SshConfigInspectionResult {
  const lines = rawConfig.split('\n');
  const diagnostics: SshConfigDiagnostic[] = [];
  const hostAliasesSeen = new Map<string, number>();

  let currentHostAlias: string | null = null;
  let currentHostLine = 0;
  let hasHostName = false;
  let hasUser = false;
  let parsedHostCount = 0;
  let wildcardHostSeenLine = -1;

  const formattedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      formattedLines.push(rawLine);
      continue;
    }

    const firstSpace = trimmed.search(/\s/);
    const directive =
      firstSpace === -1
        ? trimmed
        : trimmed.substring(0, firstSpace).toLowerCase();
    const value =
      firstSpace === -1 ? '' : trimmed.substring(firstSpace).trim();

    if (directive === 'host') {
      // Validate previous host
      if (currentHostAlias && currentHostAlias !== '*') {
        if (!hasHostName) {
          diagnostics.push({
            line: currentHostLine,
            hostAlias: currentHostAlias,
            severity: 'error',
            title: 'Missing HostName Directive',
            message: `Host entry "${currentHostAlias}" does not specify a HostName destination address.`,
          });
        }
        if (!hasUser) {
          diagnostics.push({
            line: currentHostLine,
            hostAlias: currentHostAlias,
            severity: 'warning',
            title: 'Missing User Directive',
            message: `Host entry "${currentHostAlias}" relies on the local system user rather than explicitly specifying User.`,
          });
        }
      }

      currentHostAlias = value;
      currentHostLine = lineNum;
      hasHostName = false;
      hasUser = false;
      parsedHostCount++;

      if (value === '*') {
        wildcardHostSeenLine = lineNum;
      } else if (wildcardHostSeenLine !== -1) {
        diagnostics.push({
          line: lineNum,
          hostAlias: value,
          severity: 'info',
          title: 'Host Declared After Wildcard (Host *)',
          message: `Specific host "${value}" appears after "Host *". Ensure more specific rules appear early or are correctly inherited.`,
        });
      }

      if (hostAliasesSeen.has(value) && value !== '*') {
        diagnostics.push({
          line: lineNum,
          hostAlias: value,
          severity: 'error',
          title: 'Duplicate Host Alias',
          message: `Host alias "${value}" was already defined on line ${hostAliasesSeen.get(
            value
          )}. Duplicate entries can shadow settings.`,
        });
      } else {
        hostAliasesSeen.set(value, lineNum);
      }

      formattedLines.push(`Host ${value}`);
    } else {
      formattedLines.push(`  ${directive.charAt(0).toUpperCase() + directive.slice(1)} ${value}`);

      if (directive === 'hostname') {
        hasHostName = true;
      } else if (directive === 'user') {
        hasUser = true;
      } else if (directive === 'forwardagent' && value.toLowerCase() === 'yes') {
        diagnostics.push({
          line: lineNum,
          hostAlias: currentHostAlias ?? undefined,
          severity: 'warning',
          title: 'Agent Forwarding Enabled',
          message: `ForwardAgent yes exposes local SSH credentials to remote host "${currentHostAlias}". Use ProxyJump when possible.`,
        });
      }
    }
  }

  // Validate last host
  if (currentHostAlias && currentHostAlias !== '*') {
    if (!hasHostName) {
      diagnostics.push({
        line: currentHostLine,
        hostAlias: currentHostAlias,
        severity: 'error',
        title: 'Missing HostName Directive',
        message: `Host entry "${currentHostAlias}" does not specify a HostName destination address.`,
      });
    }
  }

  if (parsedHostCount === 0) {
    diagnostics.push({
      severity: 'error',
      title: 'No Host Blocks Found',
      message: 'The provided SSH config contains no valid Host definitions.',
    });
  }

  // Always suggest proper file permissions check
  diagnostics.push({
    severity: 'info',
    title: 'File Permissions Verification',
    message: 'Ensure your ~/.ssh/config file has restricted permissions: run `chmod 600 ~/.ssh/config`.',
  });

  const errorCount = diagnostics.filter((d) => d.severity === 'error').length;
  const warnCount = diagnostics.filter((d) => d.severity === 'warning').length;

  let score = 100 - errorCount * 30 - warnCount * 10;
  if (score < 0) score = 0;

  return {
    isValid: errorCount === 0,
    score,
    parsedHostCount,
    diagnostics,
    formattedConfig: formattedLines.join('\n').trim(),
  };
}

export const SSH_CONFIG_SAMPLES: {
  name: string;
  description: string;
  content: string;
}[] = [
  {
    name: 'Buggy SSH Config (Duplicate Alias & Missing HostName)',
    description: 'Sample file demonstrating duplicate aliases, missing HostName, and Agent Forwarding warning',
    content: [
      'Host prod-server',
      '  User ubuntu',
      '  ForwardAgent yes',
      '',
      'Host staging',
      '  HostName staging.app.com',
      '  User deploy',
      '',
      'Host prod-server',
      '  HostName 203.0.113.88',
      '  User root',
    ].join('\n'),
  },
  {
    name: 'Clean Production Architecture Config',
    description: 'Well-structured multi-host configuration with ProxyJump and explicit HostName/User',
    content: [
      'Host bastion',
      '  HostName bastion.infra.io',
      '  User ubuntu',
      '  Port 2222',
      '  IdentityFile ~/.ssh/id_bastion',
      '',
      'Host app-node-1',
      '  HostName 10.0.10.20',
      '  User deploy',
      '  ProxyJump bastion',
      '  IdentityFile ~/.ssh/id_prod',
    ].join('\n'),
  },
];
