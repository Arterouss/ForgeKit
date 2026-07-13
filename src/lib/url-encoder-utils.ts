// ==============================================
// DevForge — URL Encoder / Decoder Utils
// ==============================================
// Perform RFC 3986 URI component or full URI encoding
// and decoding, parse URL components (protocol, host,
// path, query params), and inspect encoded entities.
// ==============================================

export type UrlEncodingMode = 'component' | 'full' | 'form';

export interface ParsedUrlComponents {
  isValid: boolean;
  protocol?: string;
  host?: string;
  pathname?: string;
  search?: string;
  hash?: string;
  queryParams: { key: string; value: string }[];
  errorMessage?: string;
}

/**
 * Encodes text according to chosen mode.
 */
export function encodeUrlText(input: string, mode: UrlEncodingMode): string {
  if (!input) return '';
  try {
    if (mode === 'full') {
      return encodeURI(input);
    }
    if (mode === 'form') {
      return encodeURIComponent(input).replace(/%20/g, '+');
    }
    return encodeURIComponent(input);
  } catch {
    return 'Error: Malformed URI sequence encountered during encoding.';
  }
}

/**
 * Decodes encoded URL text according to chosen mode.
 */
export function decodeUrlText(input: string, mode: UrlEncodingMode): string {
  if (!input) return '';
  try {
    const normalized = mode === 'form' ? input.replace(/\+/g, '%20') : input;
    if (mode === 'full') {
      return decodeURI(normalized);
    }
    return decodeURIComponent(normalized);
  } catch {
    return 'Error: Malformed URI sequence encountered during decoding.';
  }
}

/**
 * Parses full URL string into protocol, host, path, query params.
 */
export function parseUrlComponents(input: string): ParsedUrlComponents {
  const trimmed = input.trim();
  if (!trimmed) {
    return { isValid: false, queryParams: [] };
  }

  try {
    const url = new URL(trimmed);
    const queryParams: { key: string; value: string }[] = [];
    url.searchParams.forEach((value, key) => {
      queryParams.push({ key, value });
    });

    return {
      isValid: true,
      protocol: url.protocol,
      host: url.host,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      queryParams,
    };
  } catch {
    return {
      isValid: false,
      queryParams: [],
      errorMessage: 'Input is not a valid absolute URL with protocol (e.g., https://...).',
    };
  }
}

export const URL_ENCODER_PRESETS: {
  name: string;
  description: string;
  content: string;
}[] = [
  {
    name: 'OAuth 2.0 Authorization Callback URL',
    description: 'URL containing nested callback URI and state token parameters',
    content:
      'https://auth.devforge.io/oauth/authorize?client_id=forge_app_01&redirect_uri=https://app.devforge.io/callback/oauth&scope=read:user write:repo&state=sec_token_9910a+b=c',
  },
  {
    name: 'Complex Search Query with Symbols & Emojis',
    description: 'Query parameter string containing spaces, slashes, brackets, and emojis',
    content:
      'https://api.devforge.io/v1/search?query=DevForge Pro [v1.0] &filter=tag:devops/linux&sort=asc&mood=🚀🔥',
  },
  {
    name: 'Pre-Encoded URI Component String',
    description: 'Encoded string suitable for decoding testing',
    content:
      'https%3A%2F%2Fapi.devforge.io%2Fv1%2Fusers%3Ffilter%3Dactive%20%26%20verified%3Dtrue',
  },
];
