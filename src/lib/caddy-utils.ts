// ==============================================
// DevForge — Caddy Config Builder Utils
// ==============================================
// Generate modern Caddyfile configurations with
// automatic Let's Encrypt HTTPS, reverse proxy routing,
// static file hosting, compression, and security headers.
// ==============================================

export interface CaddySiteConfig {
  domain: string;
  adminEmail: string;
  mode: 'reverse_proxy' | 'file_server' | 'api_gateway';
  proxyTarget: string;
  staticRoot: string;
  enableCompression: boolean;
  enableSecurityHeaders: boolean;
  customDirectives: string;
}

export interface CaddyValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Generates formatted Caddyfile content.
 */
export function generateCaddyfile(config: CaddySiteConfig): string {
  const lines: string[] = [];

  lines.push('# ==============================================');
  lines.push(`# DevForge Generated Caddyfile : ${config.domain || 'localhost'}`);
  lines.push('# Validate & reload: caddy validate && caddy reload');
  lines.push('# ==============================================');
  lines.push('');

  if (config.adminEmail.trim()) {
    lines.push('{');
    lines.push(`  email ${config.adminEmail.trim()}`);
    lines.push('}');
    lines.push('');
  }

  lines.push(`${config.domain || 'localhost'} {`);

  if (config.enableCompression) {
    lines.push('  # Response Compression');
    lines.push('  encode gzip zstd');
    lines.push('');
  }

  if (config.enableSecurityHeaders) {
    lines.push('  # Security Hardening Headers');
    lines.push('  header {');
    lines.push('    X-Frame-Options "DENY"');
    lines.push('    X-Content-Type-Options "nosniff"');
    lines.push('    Referrer-Policy "strict-origin-when-cross-origin"');
    lines.push('  }');
    lines.push('');
  }

  if (config.mode === 'reverse_proxy') {
    lines.push('  # Automatic Reverse Proxy with WebSockets support');
    lines.push(`  reverse_proxy ${config.proxyTarget || 'localhost:3000'}`);
  } else if (config.mode === 'file_server') {
    lines.push('  # Static SPA / File Server');
    lines.push(`  root * ${config.staticRoot || '/var/www/html'}`);
    lines.push('  file_server');
    lines.push('  try_files {path} /index.html');
  } else if (config.mode === 'api_gateway') {
    lines.push('  # Path-based API Gateway Routing');
    lines.push('  handle_path /api/* {');
    lines.push(`    reverse_proxy ${config.proxyTarget || 'localhost:4000'}`);
    lines.push('  }');
    lines.push('  handle {');
    lines.push(`    root * ${config.staticRoot || '/var/www/html'}`);
    lines.push('    file_server');
    lines.push('  }');
  }

  if (config.customDirectives.trim()) {
    lines.push('');
    lines.push('  # Custom Directives');
    config.customDirectives
      .trim()
      .split('\n')
      .forEach((cd) => {
        lines.push(`  ${cd}`);
      });
  }

  lines.push('}');

  return lines.join('\n').trim();
}

/**
 * Validates Caddyfile configuration.
 */
export function validateCaddyConfig(
  config: CaddySiteConfig
): CaddyValidationResult {
  const errors: string[] = [];

  if (!config.domain.trim()) {
    errors.push('Domain address is required.');
  }

  if (
    (config.mode === 'reverse_proxy' || config.mode === 'api_gateway') &&
    !config.proxyTarget.trim()
  ) {
    errors.push('Reverse Proxy Target is required.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export const CADDY_PRESETS: {
  name: string;
  description: string;
  config: CaddySiteConfig;
}[] = [
  {
    name: 'Automatic HTTPS Reverse Proxy to Local App',
    description: 'Zero-config Let\'s Encrypt TLS terminating reverse proxy for Node.js / Go / Docker apps',
    config: {
      domain: 'app.devforge.io',
      adminEmail: 'admin@devforge.io',
      mode: 'reverse_proxy',
      proxyTarget: '127.0.0.1:3000',
      staticRoot: '/var/www/html',
      enableCompression: true,
      enableSecurityHeaders: true,
      customDirectives: 'log {\n    output file /var/log/caddy/access.log\n  }',
    },
  },
  {
    name: 'SPA / Static File Server with Gzip & Zstd',
    description: 'High-performance React/Vue/Next static export hosting with fallback to index.html',
    config: {
      domain: 'cdn.devforge.io',
      adminEmail: 'ops@devforge.io',
      mode: 'file_server',
      proxyTarget: '',
      staticRoot: '/var/www/frontend/dist',
      enableCompression: true,
      enableSecurityHeaders: true,
      customDirectives: '',
    },
  },
  {
    name: 'Multi-Service API Gateway Router',
    description: 'Route /api/* calls to backend microservice and serve static frontend on root handle',
    config: {
      domain: 'platform.devforge.io',
      adminEmail: 'platform@devforge.io',
      mode: 'api_gateway',
      proxyTarget: '127.0.0.1:8080',
      staticRoot: '/var/www/platform/build',
      enableCompression: true,
      enableSecurityHeaders: true,
      customDirectives: '',
    },
  },
];
