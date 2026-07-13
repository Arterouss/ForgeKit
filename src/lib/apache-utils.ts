// ==============================================
// DevForge — Apache Virtual Host Builder Utils
// ==============================================
// Generate production-ready Apache 2.4 VirtualHost
// configs supporting SSL/TLS certificates, Directory
// permissions, HTTP->HTTPS redirection, and Reverse Proxy.
// ==============================================

export interface ApacheVirtualHostConfig {
  serverName: string;
  serverAlias: string;
  adminEmail: string;
  port: number;
  enableSsl: boolean;
  sslPort: number;
  sslCertFile: string;
  sslKeyFile: string;
  enableHttpRedirect: boolean;
  mode: 'static' | 'proxy';
  documentRoot: string;
  allowOverride: boolean;
  proxyTargetUrl: string;
  accessLogPath: string;
  errorLogPath: string;
}

export interface ApacheValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Generates formatted Apache 2.4 VirtualHost configuration file content.
 */
export function generateApacheConfig(config: ApacheVirtualHostConfig): string {
  const lines: string[] = [];

  lines.push('# ==============================================');
  lines.push(`# DevForge Generated Apache VirtualHost : ${config.serverName || 'localhost'}`);
  lines.push('# Enable config: sudo a2ensite site.conf && sudo systemctl reload apache2');
  lines.push('# ==============================================');
  lines.push('');

  // Optional HTTP to HTTPS redirect block
  if (config.enableSsl && config.enableHttpRedirect) {
    lines.push(`<VirtualHost *:${config.port || 80}>`);
    lines.push(`    ServerName ${config.serverName || 'localhost'}`);
    if (config.serverAlias.trim()) {
      lines.push(`    ServerAlias ${config.serverAlias.trim()}`);
    }
    lines.push(`    Redirect permanent / https://${config.serverName || 'localhost'}/`);
    lines.push('</VirtualHost>');
    lines.push('');
  }

  const primaryPort = config.enableSsl ? config.sslPort || 443 : config.port || 80;

  lines.push(`<VirtualHost *:${primaryPort}>`);
  lines.push(`    ServerName ${config.serverName || 'localhost'}`);
  if (config.serverAlias.trim()) {
    lines.push(`    ServerAlias ${config.serverAlias.trim()}`);
  }
  if (config.adminEmail.trim()) {
    lines.push(`    ServerAdmin ${config.adminEmail.trim()}`);
  }
  lines.push('');

  if (config.enableSsl) {
    lines.push('    # SSL/TLS Engine & Certificate Paths');
    lines.push('    SSLEngine on');
    lines.push(`    SSLCertificateFile ${config.sslCertFile || '/etc/letsencrypt/live/domain/fullchain.pem'}`);
    lines.push(`    SSLCertificateKeyFile ${config.sslKeyFile || '/etc/letsencrypt/live/domain/privkey.pem'}`);
    lines.push('');
  }

  if (config.mode === 'proxy') {
    lines.push('    # Reverse Proxy configuration (mod_proxy)');
    lines.push('    ProxyPreserveHost On');
    lines.push(`    ProxyPass / ${config.proxyTargetUrl || 'http://127.0.0.1:3000/'}`);
    lines.push(`    ProxyPassReverse / ${config.proxyTargetUrl || 'http://127.0.0.1:3000/'}`);
  } else {
    lines.push(`    DocumentRoot ${config.documentRoot || '/var/www/html'}`);
    lines.push('');
    lines.push(`    <Directory ${config.documentRoot || '/var/www/html'}>`);
    lines.push('        Options -Indexes +FollowSymLinks');
    lines.push(`        AllowOverride ${config.allowOverride ? 'All' : 'None'}`);
    lines.push('        Require all granted');
    lines.push('    </Directory>');
  }

  lines.push('');
  lines.push('    # Logging');
  lines.push(`    ErrorLog ${config.errorLogPath || '${APACHE_LOG_DIR}/error.log'}`);
  lines.push(`    CustomLog ${config.accessLogPath || '${APACHE_LOG_DIR}/access.log'} combined`);
  lines.push('</VirtualHost>');

  return lines.join('\n').trim();
}

/**
 * Validates Apache VirtualHost configuration.
 */
export function validateApacheConfig(
  config: ApacheVirtualHostConfig
): ApacheValidationResult {
  const errors: string[] = [];

  if (!config.serverName.trim()) {
    errors.push('ServerName is required.');
  }

  if (config.enableSsl) {
    if (!config.sslCertFile.trim()) {
      errors.push('SSLCertificateFile path is required when SSL is enabled.');
    }
    if (!config.sslKeyFile.trim()) {
      errors.push('SSLCertificateKeyFile path is required when SSL is enabled.');
    }
  }

  if (config.mode === 'proxy' && !config.proxyTargetUrl.trim()) {
    errors.push('Reverse Proxy Target URL is required in Proxy mode.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export const APACHE_PRESETS: {
  name: string;
  description: string;
  config: ApacheVirtualHostConfig;
}[] = [
  {
    name: 'PHP / WordPress Production Site (SSL + AllowOverride)',
    description: 'Apache 2.4 configuration for CMS applications requiring .htaccess rewrites and SSL certificates',
    config: {
      serverName: 'app.devforge.io',
      serverAlias: 'www.app.devforge.io',
      adminEmail: 'admin@devforge.io',
      port: 80,
      enableSsl: true,
      sslPort: 443,
      sslCertFile: '/etc/letsencrypt/live/app.devforge.io/fullchain.pem',
      sslKeyFile: '/etc/letsencrypt/live/app.devforge.io/privkey.pem',
      enableHttpRedirect: true,
      mode: 'static',
      documentRoot: '/var/www/devforge',
      allowOverride: true,
      proxyTargetUrl: '',
      accessLogPath: '${APACHE_LOG_DIR}/devforge_access.log',
      errorLogPath: '${APACHE_LOG_DIR}/devforge_error.log',
    },
  },
  {
    name: 'Node.js / Next.js Reverse Proxy VirtualHost',
    description: 'Proxy web traffic to local app daemon running on localhost:3000 with TLS termination',
    config: {
      serverName: 'api.devforge.io',
      serverAlias: '',
      adminEmail: 'ops@devforge.io',
      port: 80,
      enableSsl: true,
      sslPort: 443,
      sslCertFile: '/etc/letsencrypt/live/api.devforge.io/fullchain.pem',
      sslKeyFile: '/etc/letsencrypt/live/api.devforge.io/privkey.pem',
      enableHttpRedirect: true,
      mode: 'proxy',
      documentRoot: '/var/www/html',
      allowOverride: false,
      proxyTargetUrl: 'http://127.0.0.1:3000/',
      accessLogPath: '${APACHE_LOG_DIR}/api_access.log',
      errorLogPath: '${APACHE_LOG_DIR}/api_error.log',
    },
  },
  {
    name: 'Static Site with Standard HTTP Block',
    description: 'Simple HTTP-only Apache web root hosting static HTML/CSS/JS files',
    config: {
      serverName: 'docs.devforge.io',
      serverAlias: '',
      adminEmail: 'docs@devforge.io',
      port: 80,
      enableSsl: false,
      sslPort: 443,
      sslCertFile: '',
      sslKeyFile: '',
      enableHttpRedirect: false,
      mode: 'static',
      documentRoot: '/var/www/docs',
      allowOverride: false,
      proxyTargetUrl: '',
      accessLogPath: '${APACHE_LOG_DIR}/docs_access.log',
      errorLogPath: '${APACHE_LOG_DIR}/docs_error.log',
    },
  },
];
