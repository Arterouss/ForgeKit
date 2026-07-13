// ==============================================
// DevForge — REST Request Builder Utils
// ==============================================
// Generate production-ready HTTP request snippets
// (cURL, fetch, axios, Python requests) from structured
// REST method, URL, headers, and body parameters.
// ==============================================

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
export type RequestBodyType = 'none' | 'json' | 'form-data' | 'raw';

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface RestRequestConfig {
  method: HttpMethod;
  url: string;
  queryParams: KeyValuePair[];
  headers: KeyValuePair[];
  bodyType: RequestBodyType;
  jsonBody: string;
}

export interface RestCodeSnippets {
  curl: string;
  fetch: string;
  axios: string;
  python: string;
}

/**
 * Build full target URL including enabled query parameters.
 */
export function buildFullUrl(url: string, queryParams: KeyValuePair[]): string {
  const trimmedUrl = url.trim() || 'https://api.devforge.io/v1/endpoint';
  const enabledParams = queryParams.filter((p) => p.enabled && p.key.trim());

  if (enabledParams.length === 0) {
    return trimmedUrl;
  }

  const separator = trimmedUrl.includes('?') ? '&' : '?';
  const queryString = enabledParams
    .map(
      (p) =>
        `${encodeURIComponent(p.key.trim())}=${encodeURIComponent(p.value.trim())}`
    )
    .join('&');

  return `${trimmedUrl}${separator}${queryString}`;
}

/**
 * Generates cURL command snippet.
 */
export function generateCurlSnippet(config: RestRequestConfig): string {
  const fullUrl = buildFullUrl(config.url, config.queryParams);
  const lines: string[] = [`curl -X ${config.method} "${fullUrl}"`];

  const enabledHeaders = config.headers.filter((h) => h.enabled && h.key.trim());
  enabledHeaders.forEach((h) => {
    lines.push(`  -H "${h.key.trim()}: ${h.value.trim()}"`);
  });

  if (
    config.bodyType === 'json' &&
    config.jsonBody.trim() &&
    ['POST', 'PUT', 'PATCH'].includes(config.method)
  ) {
    if (!enabledHeaders.some((h) => h.key.toLowerCase() === 'content-type')) {
      lines.push('  -H "Content-Type: application/json"');
    }
    lines.push(`  -d '${config.jsonBody.trim().replace(/'/g, "'\\''")}'`);
  }

  return lines.join(' \\\n');
}

/**
 * Generates JavaScript/TypeScript fetch() snippet.
 */
export function generateFetchSnippet(config: RestRequestConfig): string {
  const fullUrl = buildFullUrl(config.url, config.queryParams);
  const enabledHeaders = config.headers.filter((h) => h.enabled && h.key.trim());

  const headerObj: Record<string, string> = {};
  enabledHeaders.forEach((h) => {
    headerObj[h.key.trim()] = h.value.trim();
  });

  const hasJsonBody =
    config.bodyType === 'json' &&
    config.jsonBody.trim() &&
    ['POST', 'PUT', 'PATCH'].includes(config.method);

  if (hasJsonBody && !headerObj['Content-Type']) {
    headerObj['Content-Type'] = 'application/json';
  }

  const lines: string[] = [
    `const response = await fetch("${fullUrl}", {`,
    `  method: "${config.method}",`,
  ];

  if (Object.keys(headerObj).length > 0) {
    lines.push('  headers: {');
    Object.entries(headerObj).forEach(([k, v]) => {
      lines.push(`    "${k}": "${v}",`);
    });
    lines.push('  },');
  }

  if (hasJsonBody) {
    lines.push(`  body: JSON.stringify(${config.jsonBody.trim()}),`);
  }

  lines.push('});');
  lines.push('const data = await response.json();');
  lines.push('console.log(data);');

  return lines.join('\n');
}

/**
 * Generates Axios TypeScript snippet.
 */
export function generateAxiosSnippet(config: RestRequestConfig): string {
  const fullUrl = buildFullUrl(config.url, config.queryParams);
  const enabledHeaders = config.headers.filter((h) => h.enabled && h.key.trim());

  const headerObj: Record<string, string> = {};
  enabledHeaders.forEach((h) => {
    headerObj[h.key.trim()] = h.value.trim();
  });

  const hasJsonBody =
    config.bodyType === 'json' &&
    config.jsonBody.trim() &&
    ['POST', 'PUT', 'PATCH'].includes(config.method);

  const lines: string[] = [
    "import axios from 'axios';",
    '',
    'const response = await axios({',
    `  method: '${config.method.toLowerCase()}',`,
    `  url: '${fullUrl}',`,
  ];

  if (Object.keys(headerObj).length > 0) {
    lines.push('  headers: {');
    Object.entries(headerObj).forEach(([k, v]) => {
      lines.push(`    '${k}': '${v}',`);
    });
    lines.push('  },');
  }

  if (hasJsonBody) {
    lines.push(`  data: ${config.jsonBody.trim()},`);
  }

  lines.push('});');
  lines.push('console.log(response.data);');

  return lines.join('\n');
}

/**
 * Generates Python requests snippet.
 */
export function generatePythonSnippet(config: RestRequestConfig): string {
  const fullUrl = buildFullUrl(config.url, config.queryParams);
  const enabledHeaders = config.headers.filter((h) => h.enabled && h.key.trim());

  const lines: string[] = ['import requests', ''];

  const hasHeaders = enabledHeaders.length > 0;
  if (hasHeaders) {
    lines.push('headers = {');
    enabledHeaders.forEach((h) => {
      lines.push(`    "${h.key.trim()}": "${h.value.trim()}",`);
    });
    lines.push('}');
  }

  const hasJsonBody =
    config.bodyType === 'json' &&
    config.jsonBody.trim() &&
    ['POST', 'PUT', 'PATCH'].includes(config.method);

  if (hasJsonBody) {
    lines.push(`payload = ${config.jsonBody.trim()}`);
  }

  const args: string[] = [`"${fullUrl}"`];
  if (hasHeaders) args.push('headers=headers');
  if (hasJsonBody) args.push('json=payload');

  lines.push(`response = requests.request("${config.method}", ${args.join(', ')})`);
  lines.push('print(response.json())');

  return lines.join('\n');
}

/**
 * Generate all REST client snippets at once.
 */
export function generateRestSnippets(config: RestRequestConfig): RestCodeSnippets {
  return {
    curl: generateCurlSnippet(config),
    fetch: generateFetchSnippet(config),
    axios: generateAxiosSnippet(config),
    python: generatePythonSnippet(config),
  };
}

export const REST_REQUEST_PRESETS: {
  name: string;
  description: string;
  config: RestRequestConfig;
}[] = [
  {
    name: 'GET Authenticated User Profile (Bearer Token)',
    description: 'Standard GET request with Authorization header and query parameters',
    config: {
      method: 'GET',
      url: 'https://api.devforge.io/v1/users/profile',
      queryParams: [
        { id: 'q1', key: 'include_roles', value: 'true', enabled: true },
        { id: 'q2', key: 'format', value: 'extended', enabled: true },
      ],
      headers: [
        { id: 'h1', key: 'Authorization', value: 'Bearer df_live_token_sample_9841', enabled: true },
        { id: 'h2', key: 'Accept', value: 'application/json', enabled: true },
      ],
      bodyType: 'none',
      jsonBody: '',
    },
  },
  {
    name: 'POST Create New Deployment Resource',
    description: 'POST request sending JSON payload to trigger an application build',
    config: {
      method: 'POST',
      url: 'https://api.devforge.io/v1/deployments',
      queryParams: [],
      headers: [
        { id: 'h1', key: 'Authorization', value: 'Bearer df_live_token_sample_9841', enabled: true },
        { id: 'h2', key: 'Content-Type', value: 'application/json', enabled: true },
      ],
      bodyType: 'json',
      jsonBody: JSON.stringify(
        {
          project: 'devforge-webapp',
          environment: 'production',
          branch: 'master',
          autoPromote: true,
        },
        null,
        2
      ),
    },
  },
  {
    name: 'DELETE Revoke API Key',
    description: 'RESTful DELETE call removing a resource by ID',
    config: {
      method: 'DELETE',
      url: 'https://api.devforge.io/v1/keys/key_01jh8820',
      queryParams: [{ id: 'q1', key: 'force', value: 'true', enabled: true }],
      headers: [
        { id: 'h1', key: 'Authorization', value: 'Bearer df_live_token_sample_9841', enabled: true },
      ],
      bodyType: 'none',
      jsonBody: '',
    },
  },
];
