import { describe, it, expect } from 'vitest';
import {
  computeHmacSha256Hex,
  verifyWebhookSignature,
  generateWebhookReplayCurl,
  WEBHOOK_SAMPLE_EVENTS,
} from '@/lib/webhook-tester-utils';

describe('Webhook Tester Utilities (webhook-tester-utils.ts)', () => {
  it('should compute HMAC SHA256 hex signature format correctly', () => {
    const payload = WEBHOOK_SAMPLE_EVENTS[0].payload;
    const secret = 'my_webhook_secret';
    const sig = computeHmacSha256Hex(payload, secret);

    expect(sig).toContain('sha256=');
  });

  it('should verify signature validity when computed signature matches provided header', () => {
    const payload = WEBHOOK_SAMPLE_EVENTS[0].payload;
    const secret = 'my_webhook_secret';
    const expectedSig = computeHmacSha256Hex(payload, secret);

    const check = verifyWebhookSignature(payload, secret, expectedSig);
    expect(check.isValid).toBe(true);
  });

  it('should generate replay cURL command containing headers and payload', () => {
    const log = WEBHOOK_SAMPLE_EVENTS[0];
    const curl = generateWebhookReplayCurl(
      'https://api.devforge.io/webhook',
      log,
      'sec_123'
    );

    expect(curl).toContain('curl -X POST "https://api.devforge.io/webhook"');
    expect(curl).toContain('X-GitHub-Event: push');
    expect(curl).toContain('ForgeKit');
  });
});
