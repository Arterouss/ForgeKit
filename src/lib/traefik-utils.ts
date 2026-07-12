// ==============================================
// DevForge — Traefik Config Builder Pro Utilities
// ==============================================
// Generate production Traefik v3 YAML static and
// dynamic configurations with Let's Encrypt TLS.
// ==============================================

export interface TraefikRouterRule {
  id: string;
  name: string;
  hostRule: string;
  serviceTargetUrl: string;
  tlsEnabled: boolean;
}

export interface TraefikConfigOptions {
  apiDashboardEnabled: boolean;
  dockerProviderEnabled: boolean;
  httpPort: number;
  httpsPort: number;
  letsEncryptEnabled: boolean;
  acmeEmail?: string;
  routers: TraefikRouterRule[];
}

export interface TraefikValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

let traefikRouterCounter = 1;
export function generateTraefikRouterId(): string {
  return `tr_${Date.now()}_${traefikRouterCounter++}`;
}

/**
 * Generates Traefik static + dynamic YAML configuration.
 */
export function generateTraefikConfig(opts: TraefikConfigOptions): string {
  const lines: string[] = [];

  lines.push('# Traefik Static Configuration (traefik.yml)');
  if (opts.apiDashboardEnabled) {
    lines.push('api:');
    lines.push('  dashboard: true');
    lines.push('  insecure: true');
    lines.push('');
  }

  lines.push('entryPoints:');
  lines.push('  web:');
  lines.push(`    address: ":${opts.httpPort}"`);
  lines.push('  websecure:');
  lines.push(`    address: ":${opts.httpsPort}"`);
  lines.push('');

  lines.push('providers:');
  if (opts.dockerProviderEnabled) {
    lines.push('  docker:');
    lines.push('    endpoint: "unix:///var/run/docker.sock"');
    lines.push('    exposedByDefault: false');
  }
  lines.push('  file:');
  lines.push('    directory: "/etc/traefik/dynamic"');
  lines.push('    watch: true');
  lines.push('');

  if (opts.letsEncryptEnabled && opts.acmeEmail) {
    lines.push('certificatesResolvers:');
    lines.push('  letsencrypt:');
    lines.push('    acme:');
    lines.push(`      email: "${opts.acmeEmail}"`);
    lines.push('      storage: "/acme.json"');
    lines.push('      httpChallenge:');
    lines.push('        entryPoint: web');
    lines.push('');
  }

  if (opts.routers && opts.routers.length > 0) {
    lines.push('# Traefik Dynamic Configuration (dynamic/routers.yml)');
    lines.push('http:');
    lines.push('  routers:');
    opts.routers.forEach((r) => {
      lines.push(`    ${r.name}:`);
      lines.push(`      rule: "Host(\`${r.hostRule}\`)"`);
      lines.push(`      service: "${r.name}-svc"`);
      lines.push(`      entryPoints:`);
      lines.push(`        - ${r.tlsEnabled ? 'websecure' : 'web'}`);
      if (r.tlsEnabled) {
        lines.push(`      tls:`);
        if (opts.letsEncryptEnabled) {
          lines.push(`        certResolver: letsencrypt`);
        } else {
          lines.push(`        {}`);
        }
      }
    });

    lines.push('');
    lines.push('  services:');
    opts.routers.forEach((r) => {
      lines.push(`    ${r.name}-svc:`);
      lines.push(`      loadBalancer:`);
      lines.push(`        servers:`);
      lines.push(`          - url: "${r.serviceTargetUrl}"`);
    });
  }

  return lines.join('\n');
}

/**
 * Validates Traefik configuration.
 */
export function validateTraefikConfig(opts: TraefikConfigOptions): TraefikValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (opts.letsEncryptEnabled && (!opts.acmeEmail || !opts.acmeEmail.includes('@'))) {
    errors.push('A valid ACME email address is required when Let\'s Encrypt is enabled.');
  }

  opts.routers.forEach((r, idx) => {
    if (!r.hostRule.trim()) {
      errors.push(`Router #${idx + 1}: Host domain is required.`);
    }
    if (!r.serviceTargetUrl.trim()) {
      errors.push(`Router #${idx + 1}: Target service URL is required.`);
    }
  });

  if (opts.apiDashboardEnabled) {
    warnings.push('API Dashboard is exposed in insecure mode. Ensure proper authentication in production.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export const TRAEFIK_PRESETS: { name: string; description: string; options: TraefikConfigOptions }[] = [
  {
    name: 'Traefik v3 Docker Reverse Proxy + ACME TLS',
    description: 'Auto-discovery via Docker socket + Let\'s Encrypt certificate resolver',
    options: {
      apiDashboardEnabled: true,
      dockerProviderEnabled: true,
      httpPort: 80,
      httpsPort: 443,
      letsEncryptEnabled: true,
      acmeEmail: 'devops@devforge.io',
      routers: [
        {
          id: generateTraefikRouterId(),
          name: 'webapp-router',
          hostRule: 'app.devforge.io',
          serviceTargetUrl: 'http://nextjs-app:3000',
          tlsEnabled: true,
        },
      ],
    },
  },
  {
    name: 'API Gateway Load Balancer',
    description: 'Manual file dynamic routes forwarding traffic to internal services',
    options: {
      apiDashboardEnabled: false,
      dockerProviderEnabled: false,
      httpPort: 80,
      httpsPort: 443,
      letsEncryptEnabled: false,
      routers: [
        {
          id: generateTraefikRouterId(),
          name: 'auth-service',
          hostRule: 'auth.devforge.io',
          serviceTargetUrl: 'http://localhost:8081',
          tlsEnabled: false,
        },
        {
          id: generateTraefikRouterId(),
          name: 'api-service',
          hostRule: 'api.devforge.io',
          serviceTargetUrl: 'http://localhost:8082',
          tlsEnabled: false,
        },
      ],
    },
  },
];
