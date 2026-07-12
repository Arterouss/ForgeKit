// ==============================================
// DevForge — Nginx Config Builder Pro Utilities
// ==============================================
// Generate production Nginx configurations for reverse
// proxies, SPA hosting, security headers & SSL.
// ==============================================

export type NginxMode = 'reverse_proxy' | 'spa_static' | 'load_balancer';

export interface NginxUpstreamServer {
  host: string;
  port: number;
  weight?: number;
}

export interface NginxConfigOptions {
  mode: NginxMode;
  serverName: string;
  listenPort: number;
  sslEnabled: boolean;
  sslCertPath?: string;
  sslKeyPath?: string;
  proxyPassUrl?: string;
  rootPath?: string;
  gzipEnabled: boolean;
  securityHeadersEnabled: boolean;
  clientMaxBodySize: string;
  upstreams?: NginxUpstreamServer[];
}

export interface NginxValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Generates an Nginx config file based on options.
 */
export function generateNginxConfig(opts: NginxConfigOptions): string {
  const lines: string[] = [];

  // Upstream block if load balancer mode
  if (opts.mode === 'load_balancer' && opts.upstreams && opts.upstreams.length > 0) {
    lines.push('upstream backend_cluster {');
    opts.upstreams.forEach((u) => {
      lines.push(`    server ${u.host}:${u.port}${u.weight ? ` weight=${u.weight}` : ''};`);
    });
    lines.push('}');
    lines.push('');
  }

  lines.push('server {');
  lines.push(`    listen ${opts.listenPort};`);
  lines.push(`    server_name ${opts.serverName};`);
  lines.push(`    client_max_body_size ${opts.clientMaxBodySize || '10M'};`);

  if (opts.sslEnabled) {
    lines.push(`    listen 443 ssl http2;`);
    lines.push(`    ssl_certificate ${opts.sslCertPath || '/etc/nginx/ssl/cert.pem'};`);
    lines.push(`    ssl_certificate_key ${opts.sslKeyPath || '/etc/nginx/ssl/key.pem'};`);
    lines.push(`    ssl_protocols TLSv1.2 TLSv1.3;`);
  }

  if (opts.gzipEnabled) {
    lines.push('');
    lines.push('    gzip on;');
    lines.push('    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;');
  }

  if (opts.securityHeadersEnabled) {
    lines.push('');
    lines.push('    # Security headers');
    lines.push('    add_header X-Frame-Options "SAMEORIGIN" always;');
    lines.push('    add_header X-Content-Type-Options "nosniff" always;');
    lines.push('    add_header X-XSS-Protection "1; mode=block" always;');
    lines.push('    add_header Referrer-Policy "strict-origin-when-cross-origin" always;');
  }

  lines.push('');

  if (opts.mode === 'reverse_proxy') {
    lines.push('    location / {');
    lines.push(`        proxy_pass ${opts.proxyPassUrl || 'http://localhost:3000'};`);
    lines.push('        proxy_http_version 1.1;');
    lines.push('        proxy_set_header Upgrade $http_upgrade;');
    lines.push('        proxy_set_header Connection "upgrade";');
    lines.push('        proxy_set_header Host $host;');
    lines.push('        proxy_set_header X-Real-IP $remote_addr;');
    lines.push('        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;');
    lines.push('        proxy_set_header X-Forwarded-Proto $scheme;');
    lines.push('    }');
  } else if (opts.mode === 'spa_static') {
    lines.push(`    root ${opts.rootPath || '/usr/share/nginx/html'};`);
    lines.push('    index index.html index.htm;');
    lines.push('');
    lines.push('    location / {');
    lines.push('        try_files $uri $uri/ /index.html;');
    lines.push('    }');
    lines.push('');
    lines.push('    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {');
    lines.push('        expires 1y;');
    lines.push('        access_log off;');
    lines.push('        add_header Cache-Control "public, max-age=31536000, immutable";');
    lines.push('    }');
  } else if (opts.mode === 'load_balancer') {
    lines.push('    location / {');
    lines.push('        proxy_pass http://backend_cluster;');
    lines.push('        proxy_set_header Host $host;');
    lines.push('        proxy_set_header X-Real-IP $remote_addr;');
    lines.push('    }');
  }

  lines.push('}');
  return lines.join('\n');
}

/**
 * Validates Nginx config options.
 */
export function validateNginxConfig(opts: NginxConfigOptions): NginxValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!opts.serverName.trim()) {
    errors.push('server_name cannot be empty.');
  }

  if (opts.mode === 'reverse_proxy' && (!opts.proxyPassUrl || !opts.proxyPassUrl.trim())) {
    errors.push('Reverse proxy target URL (proxy_pass) is required.');
  }

  if (opts.sslEnabled && !opts.sslCertPath) {
    warnings.push('SSL certificate path is missing.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export const NGINX_PRESETS: { name: string; description: string; options: NginxConfigOptions }[] = [
  {
    name: 'Next.js / Node.js Reverse Proxy',
    description: 'Reverse proxy forwarder with Gzip, SSL TLSv1.3, and HTTP Upgrade support',
    options: {
      mode: 'reverse_proxy',
      serverName: 'app.devforge.io',
      listenPort: 80,
      sslEnabled: false,
      proxyPassUrl: 'http://localhost:3000',
      gzipEnabled: true,
      securityHeadersEnabled: true,
      clientMaxBodySize: '20M',
    },
  },
  {
    name: 'React / Vue SPA Static Site',
    description: 'SPA HTML5 pushState routing with 1-year immutable cache for static assets',
    options: {
      mode: 'spa_static',
      serverName: 'portal.devforge.io',
      listenPort: 80,
      sslEnabled: false,
      rootPath: '/var/www/dist',
      gzipEnabled: true,
      securityHeadersEnabled: true,
      clientMaxBodySize: '10M',
    },
  },
];
