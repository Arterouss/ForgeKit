// ==============================================
// DevForge — HTTP Header Inspector Utils
// ==============================================
// Parse HTTP response headers, audit security posture
// (HSTS, CSP, X-Frame-Options, nosniff), detect information
// leakage (Server, X-Powered-By), and grade security rating.
// ==============================================

export type SecurityGrade = 'A+' | 'A' | 'B' | 'C' | 'F';

export interface SecurityHeaderCheck {
  headerName: string;
  isPresent: boolean;
  value?: string;
  status: 'pass' | 'warn' | 'fail';
  explanation: string;
  recommendation: string;
}

export interface HttpHeaderInspectionResult {
  grade: SecurityGrade;
  parsedHeaders: Record<string, string>;
  securityChecks: SecurityHeaderCheck[];
  leakedHeaders: { headerName: string; value: string; risk: string }[];
  summaryMessage: string;
}

/**
 * Parses raw HTTP header text block into key-value dictionary.
 */
export function parseRawHeaders(rawText: string): Record<string, string> {
  const result: Record<string, string> = {};

  rawText
    .trim()
    .split('\n')
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('HTTP/')) return;

      const colonIdx = trimmed.indexOf(':');
      if (colonIdx > 0) {
        const key = trimmed.substring(0, colonIdx).trim().toLowerCase();
        const value = trimmed.substring(colonIdx + 1).trim();
        result[key] = value;
      }
    });

  return result;
}

/**
 * Inspect and grade parsed HTTP response headers.
 */
export function inspectHttpHeaders(rawHeadersText: string): HttpHeaderInspectionResult {
  const headers = parseRawHeaders(rawHeadersText);

  const checks: SecurityHeaderCheck[] = [];
  const leakedHeaders: { headerName: string; value: string; risk: string }[] = [];

  // 1. Strict-Transport-Security (HSTS)
  const hsts = headers['strict-transport-security'];
  if (hsts) {
    checks.push({
      headerName: 'Strict-Transport-Security (HSTS)',
      isPresent: true,
      value: hsts,
      status: 'pass',
      explanation: 'Enforces secure HTTPS transport over TLS.',
      recommendation: 'Good. Ensure max-age is at least 31536000 (1 year).',
    });
  } else {
    checks.push({
      headerName: 'Strict-Transport-Security (HSTS)',
      isPresent: false,
      status: 'fail',
      explanation: 'Missing HSTS header leaves users vulnerable to SSL stripping attacks.',
      recommendation: 'Add header: Strict-Transport-Security: max-age=31536000; includeSubDomains',
    });
  }

  // 2. Content-Security-Policy (CSP)
  const csp = headers['content-security-policy'];
  if (csp) {
    checks.push({
      headerName: 'Content-Security-Policy (CSP)',
      isPresent: true,
      value: csp,
      status: 'pass',
      explanation: 'Restricts script and resource origins to mitigate Cross-Site Scripting (XSS).',
      recommendation: 'Good CSP policy detected.',
    });
  } else {
    checks.push({
      headerName: 'Content-Security-Policy (CSP)',
      isPresent: false,
      status: 'warn',
      explanation: 'No Content-Security-Policy defined; browser will allow execution of scripts from any origin.',
      recommendation: "Add CSP header restricting default-src 'self' or trusted domains.",
    });
  }

  // 3. X-Frame-Options
  const xfo = headers['x-frame-options'];
  if (xfo && ['deny', 'sameorigin'].includes(xfo.toLowerCase())) {
    checks.push({
      headerName: 'X-Frame-Options',
      isPresent: true,
      value: xfo,
      status: 'pass',
      explanation: 'Prevents the site from being embedded in frames, blocking Clickjacking attacks.',
      recommendation: 'Clickjacking protection is active.',
    });
  } else {
    checks.push({
      headerName: 'X-Frame-Options',
      isPresent: false,
      status: 'fail',
      explanation: 'Missing X-Frame-Options allows attackers to frame the website for Clickjacking.',
      recommendation: 'Add header: X-Frame-Options: DENY or SAMEORIGIN',
    });
  }

  // 4. X-Content-Type-Options: nosniff
  const nosniff = headers['x-content-type-options'];
  if (nosniff && nosniff.toLowerCase() === 'nosniff') {
    checks.push({
      headerName: 'X-Content-Type-Options',
      isPresent: true,
      value: nosniff,
      status: 'pass',
      explanation: 'Prevents MIME-sniffing exploits by forcing declared Content-Type.',
      recommendation: 'MIME-sniffing protection is active.',
    });
  } else {
    checks.push({
      headerName: 'X-Content-Type-Options',
      isPresent: false,
      status: 'fail',
      explanation: 'Browser may guess Content-Type and execute non-script files as JavaScript.',
      recommendation: 'Add header: X-Content-Type-Options: nosniff',
    });
  }

  // 5. Referrer-Policy
  const referrer = headers['referrer-policy'];
  if (referrer) {
    checks.push({
      headerName: 'Referrer-Policy',
      isPresent: true,
      value: referrer,
      status: 'pass',
      explanation: 'Controls how much referrer information is sent with outbound requests.',
      recommendation: 'Referrer privacy policy is configured.',
    });
  } else {
    checks.push({
      headerName: 'Referrer-Policy',
      isPresent: false,
      status: 'warn',
      explanation: 'Missing Referrer-Policy may leak URL path details to third-party servers.',
      recommendation: 'Add header: Referrer-Policy: strict-origin-when-cross-origin',
    });
  }

  // Check information leakage
  if (headers['server']) {
    leakedHeaders.push({
      headerName: 'Server',
      value: headers['server'],
      risk: 'Exposes exact server software version which helps attackers target known CVE vulnerabilities.',
    });
  }

  if (headers['x-powered-by']) {
    leakedHeaders.push({
      headerName: 'X-Powered-By',
      value: headers['x-powered-by'],
      risk: 'Exposes internal backend runtime technology (PHP, Express, ASP.NET).',
    });
  }

  // Grade calculation
  const passedCount = checks.filter((c) => c.status === 'pass').length;
  const failedCount = checks.filter((c) => c.status === 'fail').length;

  let grade: SecurityGrade = 'C';
  if (passedCount >= 4 && failedCount === 0 && leakedHeaders.length === 0) {
    grade = 'A+';
  } else if (passedCount >= 4 && failedCount === 0) {
    grade = 'A';
  } else if (passedCount >= 3 && failedCount <= 1) {
    grade = 'B';
  } else if (failedCount >= 3) {
    grade = 'F';
  }

  return {
    grade,
    parsedHeaders: headers,
    securityChecks: checks,
    leakedHeaders,
    summaryMessage: `${passedCount} of ${checks.length} OWASP security headers passed. Grade: ${grade}`,
  };
}

export const HTTP_HEADER_SAMPLES: {
  name: string;
  description: string;
  content: string;
}[] = [
  {
    name: 'OWASP Hardened Production Response (Grade A+)',
    description: 'Fully secured response headers enforcing HSTS, CSP, X-Frame-Options, and zero leaks',
    content: [
      'HTTP/2 200 OK',
      'Content-Type: text/html; charset=utf-8',
      'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload',
      "Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; script-src 'self'",
      'X-Frame-Options: DENY',
      'X-Content-Type-Options: nosniff',
      'Referrer-Policy: strict-origin-when-cross-origin',
      'Permissions-Policy: geolocation=(), microphone=()',
      'Cache-Control: no-cache, no-store, must-revalidate',
    ].join('\n'),
  },
  {
    name: 'Insecure Legacy PHP Site (Grade F + Info Leakage)',
    description: 'Missing security headers and leaking Apache/Ubuntu and PHP version banners',
    content: [
      'HTTP/1.1 200 OK',
      'Server: Apache/2.4.41 (Ubuntu)',
      'X-Powered-By: PHP/8.1.2',
      'Content-Type: text/html',
      'Set-Cookie: PHPSESSID=abcdef1234567890; path=/',
      'Connection: close',
    ].join('\n'),
  },
  {
    name: 'Standard Cloudflare API Edge Response (Grade B)',
    description: 'Modern API gateway headers with partial OWASP security protection',
    content: [
      'HTTP/2 200 OK',
      'Date: Mon, 13 Jul 2026 10:00:00 GMT',
      'Content-Type: application/json',
      'Strict-Transport-Security: max-age=15552000',
      'X-Content-Type-Options: nosniff',
      'CF-RAY: 8a4b12345678-SIN',
      'Server: cloudflare',
    ].join('\n'),
  },
];
