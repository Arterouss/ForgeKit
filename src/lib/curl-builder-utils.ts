// ==============================================
// DevForge — cURL Command Builder Utils
// ==============================================
// Construct multi-line and single-line cURL CLI
// commands with headers, authentication, SSL options,
// redirects, and payload data.
// ==============================================

export type CurlMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface CurlHeader {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface CurlBuilderConfig {
  method: CurlMethod;
  url: string;
  headers: CurlHeader[];
  dataPayload: string;
  authType: 'none' | 'bearer' | 'basic';
  authToken: string;
  basicUser: string;
  basicPass: string;
  followRedirects: boolean;
  insecureSsl: boolean;
  includeResponseHeaders: boolean;
  verbose: boolean;
}

export interface CurlBuilderOutputs {
  multiline: string;
  singleline: string;
  fetchSnippet: string;
}

/**
 * Generate multi-line, single-line cURL commands and fetch equivalent.
 */
export function generateCurlCommand(config: CurlBuilderConfig): CurlBuilderOutputs {
  const url = config.url.trim() || 'https://api.devforge.io/v1/resource';
  const flags: string[] = [];
  const headerArgs: string[] = [];

  if (config.method !== 'GET') {
    flags.push(`-X ${config.method}`);
  }

  if (config.followRedirects) flags.push('-L');
  if (config.insecureSsl) flags.push('-k');
  if (config.includeResponseHeaders) flags.push('-i');
  if (config.verbose) flags.push('-v');

  if (config.authType === 'bearer' && config.authToken.trim()) {
    headerArgs.push(`-H "Authorization: Bearer ${config.authToken.trim()}"`);
  } else if (config.authType === 'basic' && (config.basicUser.trim() || config.basicPass.trim())) {
    flags.push(`-u "${config.basicUser.trim()}:${config.basicPass.trim()}"`);
  }

  config.headers
    .filter((h) => h.enabled && h.key.trim())
    .forEach((h) => {
      headerArgs.push(`-H "${h.key.trim()}: ${h.value.trim()}"`);
    });

  const payloadArgs: string[] = [];
  if (config.dataPayload.trim() && ['POST', 'PUT', 'PATCH'].includes(config.method)) {
    payloadArgs.push(`-d '${config.dataPayload.trim().replace(/'/g, "'\\''")}'`);
  }

  const allParts = ['curl', ...flags, `"${url}"`, ...headerArgs, ...payloadArgs];

  const singleline = allParts.join(' ');
  const multilineParts = ['curl', ...flags, `"${url}"`, ...headerArgs, ...payloadArgs];
  const multiline = multilineParts.join(' \\\n  ');

  // Generate equivalent JS fetch
  const headerRecord: Record<string, string> = {};
  if (config.authType === 'bearer' && config.authToken.trim()) {
    headerRecord['Authorization'] = `Bearer ${config.authToken.trim()}`;
  }
  config.headers
    .filter((h) => h.enabled && h.key.trim())
    .forEach((h) => {
      headerRecord[h.key.trim()] = h.value.trim();
    });

  const fetchLines: string[] = [
    `const response = await fetch("${url}", {`,
    `  method: "${config.method}",`,
  ];
  if (Object.keys(headerRecord).length > 0) {
    fetchLines.push('  headers: {');
    Object.entries(headerRecord).forEach(([k, v]) => {
      fetchLines.push(`    "${k}": "${v}",`);
    });
    fetchLines.push('  },');
  }
  if (payloadArgs.length > 0) {
    fetchLines.push(`  body: JSON.stringify(${config.dataPayload.trim() || '""'}),`);
  }
  fetchLines.push('});');

  return {
    multiline,
    singleline,
    fetchSnippet: fetchLines.join('\n'),
  };
}

export const CURL_BUILDER_PRESETS: {
  name: string;
  description: string;
  config: CurlBuilderConfig;
}[] = [
  {
    name: 'POST JSON API with Bearer Token & Follow Redirects',
    description: 'RESTful POST sending structured JSON payload with Bearer authorization',
    config: {
      method: 'POST',
      url: 'https://api.devforge.io/v1/deployments/create',
      headers: [
        { id: 'h1', key: 'Content-Type', value: 'application/json', enabled: true },
        { id: 'h2', key: 'Accept', value: 'application/json', enabled: true },
      ],
      dataPayload: JSON.stringify(
        {
          service: 'api-gateway',
          replicas: 3,
          region: 'us-east-1',
        },
        null,
        2
      ),
      authType: 'bearer',
      authToken: 'df_live_sec_token_98210',
      basicUser: '',
      basicPass: '',
      followRedirects: true,
      insecureSsl: false,
      includeResponseHeaders: true,
      verbose: false,
    },
  },
  {
    name: 'GET Authenticated Endpoint with SSL Insecure Bypass (-k)',
    description: 'Useful for testing internal staging endpoints with self-signed SSL certificates',
    config: {
      method: 'GET',
      url: 'https://staging.internal.devforge.local:8443/health',
      headers: [
        { id: 'h1', key: 'X-Requested-With', value: 'DevForgeCLI', enabled: true },
      ],
      dataPayload: '',
      authType: 'basic',
      authToken: '',
      basicUser: 'admin',
      basicPass: 'secretDevOps2026',
      followRedirects: false,
      insecureSsl: true,
      includeResponseHeaders: true,
      verbose: true,
    },
  },
];
