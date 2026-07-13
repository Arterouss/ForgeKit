// ==============================================
// DevForge — API Authentication Helper Utils
// ==============================================
// Generate HTTP authentication headers, Base64 credentials,
// cURL auth snippets, and OAuth 2.0 token requests.
// ==============================================

export type AuthScheme = 'bearer' | 'basic' | 'apikey_header' | 'apikey_query' | 'oauth2_client';

export interface AuthConfig {
  scheme: AuthScheme;
  token?: string;
  username?: string;
  password?: string;
  headerName?: string;
  apiKey?: string;
  queryParamName?: string;
  oauthTokenUrl?: string;
  clientId?: string;
  clientSecret?: string;
  scope?: string;
}

export interface GeneratedAuthSnippet {
  headerKey?: string;
  headerValue?: string;
  curlSnippet: string;
  jsHeadersSnippet: string;
}

/**
 * Generate HTTP auth headers and cURL snippets for configured auth scheme.
 */
export function generateAuthSnippets(config: AuthConfig, targetUrl = 'https://api.devforge.io/v1/resource'): GeneratedAuthSnippet {
  const url = targetUrl.trim() || 'https://api.devforge.io/v1/resource';

  if (config.scheme === 'bearer') {
    const token = (config.token || 'YOUR_ACCESS_TOKEN').trim();
    const headerVal = `Bearer ${token}`;
    return {
      headerKey: 'Authorization',
      headerValue: headerVal,
      curlSnippet: `curl -H "Authorization: ${headerVal}" "${url}"`,
      jsHeadersSnippet: `const headers = {\n  "Authorization": "${headerVal}"\n};`,
    };
  }

  if (config.scheme === 'basic') {
    const user = config.username || 'admin';
    const pass = config.password || 'secret';
    // Base64 encode user:password
    const encoded = typeof btoa === 'function'
      ? btoa(`${user}:${pass}`)
      : Buffer.from(`${user}:${pass}`).toString('base64');
    const headerVal = `Basic ${encoded}`;
    return {
      headerKey: 'Authorization',
      headerValue: headerVal,
      curlSnippet: `curl -u "${user}:${pass}" "${url}"`,
      jsHeadersSnippet: `const headers = {\n  "Authorization": "${headerVal}"\n};`,
    };
  }

  if (config.scheme === 'apikey_header') {
    const name = (config.headerName || 'X-API-Key').trim();
    const key = (config.apiKey || 'fk_live_99210081').trim();
    return {
      headerKey: name,
      headerValue: key,
      curlSnippet: `curl -H "${name}: ${key}" "${url}"`,
      jsHeadersSnippet: `const headers = {\n  "${name}": "${key}"\n};`,
    };
  }

  if (config.scheme === 'apikey_query') {
    const paramName = (config.queryParamName || 'api_key').trim();
    const key = (config.apiKey || 'fk_live_99210081').trim();
    const separator = url.includes('?') ? '&' : '?';
    const fullUrl = `${url}${separator}${paramName}=${encodeURIComponent(key)}`;
    return {
      curlSnippet: `curl "${fullUrl}"`,
      jsHeadersSnippet: `const url = "${fullUrl}";\nconst response = await fetch(url);`,
    };
  }

  // OAuth 2.0 Client Credentials Grant Token Request
  const tokenUrl = (config.oauthTokenUrl || 'https://auth.devforge.io/oauth/token').trim();
  const clientId = config.clientId || 'client_id_001';
  const clientSecret = config.clientSecret || 'client_secret_xyz';
  const scope = config.scope || 'read:deployments write:config';

  const bodyParams = [
    'grant_type=client_credentials',
    `client_id=${encodeURIComponent(clientId)}`,
    `client_secret=${encodeURIComponent(clientSecret)}`,
    `scope=${encodeURIComponent(scope)}`,
  ].join('&');

  return {
    headerKey: 'Content-Type',
    headerValue: 'application/x-www-form-urlencoded',
    curlSnippet: `curl -X POST "${tokenUrl}" \\\n  -H "Content-Type: application/x-www-form-urlencoded" \\\n  -d "${bodyParams}"`,
    jsHeadersSnippet: `const response = await fetch("${tokenUrl}", {\n  method: "POST",\n  headers: { "Content-Type": "application/x-www-form-urlencoded" },\n  body: "${bodyParams}"\n});`,
  };
}

export const AUTH_SAMPLE_PRESETS: {
  name: string;
  description: string;
  config: AuthConfig;
}[] = [
  {
    name: 'Bearer JWT Access Token',
    description: 'Standard RFC 6750 Bearer authentication token for APIs',
    config: {
      scheme: 'bearer',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMTAwIiwiZXhwIjoxODkwMDAwMDAwfQ.sign123',
    },
  },
  {
    name: 'HTTP Basic Authentication',
    description: 'RFC 7617 username:password credentials encoded in Base64',
    config: {
      scheme: 'basic',
      username: 'devops_lead',
      password: 'StrongSecretPassword!2026',
    },
  },
  {
    name: 'Custom X-API-Key Header',
    description: 'Custom HTTP header commonly used for service-to-service keys',
    config: {
      scheme: 'apikey_header',
      headerName: 'X-Forge-Key',
      apiKey: 'fk_live_89102919ab381c049182',
    },
  },
  {
    name: 'OAuth 2.0 Client Credentials Token Request',
    description: 'Machine-to-machine token exchange request to authorization server',
    config: {
      scheme: 'oauth2_client',
      oauthTokenUrl: 'https://auth.devforge.io/oauth/token',
      clientId: 'fk_client_app_099',
      clientSecret: 'sec_client_secret_9988aabbcc',
      scope: 'api:read api:write',
    },
  },
];
