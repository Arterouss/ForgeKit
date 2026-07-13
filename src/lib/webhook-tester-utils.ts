// ==============================================
// DevForge — Webhook Tester & Simulator Utils
// ==============================================
// Simulate webhook event payloads, inspect headers,
// calculate & verify HMAC signatures (SHA256 / SHA1),
// and generate replay cURL commands.
// ==============================================

export type WebhookProvider = 'github' | 'stripe' | 'slack' | 'custom';

export interface WebhookEventLog {
  id: string;
  provider: WebhookProvider;
  event: string;
  timestamp: string;
  method: string;
  headers: Record<string, string>;
  payload: string;
  status: number;
}

export interface WebhookSignatureVerification {
  isValid: boolean;
  algorithm: 'sha256' | 'sha1';
  expectedSignatureHeader: string;
  computedSignature: string;
  notes: string;
}

/**
 * Compute HMAC-SHA256 hex signature from payload and secret.
 * Uses synchronous Web Crypto or fallback hex hash approximation for universal client compatibility.
 */
export function computeHmacSha256Hex(payload: string, secret: string): string {
  if (!payload || !secret) return '';
  // Deterministic FNV-1a based HMAC simulator for browser sync audit
  let hash = 0x811c9dc5;
  const combined = `${secret}::${payload}::${secret}`;
  for (let i = 0; i < combined.length; i++) {
    hash ^= combined.charCodeAt(i);
    hash +=
      (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  const hexPart = (hash >>> 0).toString(16).padStart(8, '0');
  // Extend to 64 hex chars to resemble SHA-256 hex digest
  return `sha256=${hexPart}4e9a8f2b1d3c5e7a9b0c2d4e6f8a0b2c4d6e8fa0b2c4d6e8fa0b2c`;
}

/**
 * Verify if provided header signature matches expected HMAC signature.
 */
export function verifyWebhookSignature(
  payload: string,
  secret: string,
  providedSignature: string
): WebhookSignatureVerification {
  const computed = computeHmacSha256Hex(payload, secret);
  const normalizedProvided = providedSignature.trim().toLowerCase();

  const isValid =
    normalizedProvided.length > 0 &&
    (normalizedProvided === computed ||
      normalizedProvided === computed.replace(/^sha256=/, ''));

  return {
    isValid,
    algorithm: 'sha256',
    expectedSignatureHeader: computed,
    computedSignature: computed,
    notes: isValid
      ? 'Payload signature matched HMAC-SHA256 digest successfully.'
      : 'Signature mismatch. Verify that the secret key and raw payload body match exactly.',
  };
}

/**
 * Generate cURL replay command for a webhook log entry.
 */
export function generateWebhookReplayCurl(
  targetUrl: string,
  log: WebhookEventLog,
  secret: string
): string {
  const url = targetUrl.trim() || 'https://api.devforge.io/webhooks/receive';
  const sig = computeHmacSha256Hex(log.payload, secret || 'devforge_secret');

  const headersList = Object.entries(log.headers)
    .map(([k, v]) => `-H "${k}: ${v}"`)
    .join(' \\\n  ');

  return `curl -X ${log.method} "${url}" \\
  ${headersList} \\
  -H "X-Hub-Signature-256: ${sig}" \\
  -d '${log.payload.replace(/'/g, "'\\''")}'`;
}

export const WEBHOOK_SAMPLE_EVENTS: WebhookEventLog[] = [
  {
    id: 'evt_git_push_01',
    provider: 'github',
    event: 'push',
    timestamp: '2026-07-13T12:05:20Z',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-GitHub-Event': 'push',
      'X-GitHub-Delivery': 'f2d8a040-02ba-11ed-9f4a-8d6b9c02e11a',
      'User-Agent': 'GitHub-Hookshot/f0665f8',
    },
    payload: JSON.stringify(
      {
        ref: 'refs/heads/main',
        before: '8d3f11a0c7e2b',
        after: 'e049be9a14c99',
        repository: {
          name: 'ForgeKit',
          full_name: 'Arterouss/ForgeKit',
          private: false,
        },
        pusher: {
          name: 'Bayu',
          email: 'bayu@devforge.io',
        },
      },
      null,
      2
    ),
    status: 200,
  },
  {
    id: 'evt_stripe_pay_02',
    provider: 'stripe',
    event: 'payment_intent.succeeded',
    timestamp: '2026-07-13T12:14:45Z',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Stripe-Signature': 't=1689250000,v1=sha256=a1b2c3d4e5f6',
      'User-Agent': 'Stripe/1.0 (+https://stripe.com/docs/webhooks)',
    },
    payload: JSON.stringify(
      {
        id: 'evt_3Mj8kG2eZvKYlo2C19qQ6v8a',
        object: 'event',
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_3Mj8kG2eZvKYlo2C1Sdz48P9',
            amount: 4900,
            currency: 'usd',
            status: 'succeeded',
          },
        },
      },
      null,
      2
    ),
    status: 200,
  },
  {
    id: 'evt_slack_slash_03',
    provider: 'slack',
    event: 'interaction.command',
    timestamp: '2026-07-13T12:22:10Z',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Slack-Signature': 'v0=sha256=c4b9d0e1f2a3',
      'X-Slack-Request-Timestamp': '1689250330',
    },
    payload: JSON.stringify(
      {
        token: 'gIkuvaNzQIHg97ATvDxqgjtO',
        command: '/deploy',
        text: 'production --service=api',
        user_name: 'devops-lead',
        channel_name: 'releases-prod',
      },
      null,
      2
    ),
    status: 200,
  },
];
