import type { Metadata } from 'next';
import { WebhookTesterPro } from '@/components/tools/webhook-tester';

export const metadata: Metadata = {
  title: 'Webhook Tester & Payload Simulator — DevForge Developer Studio',
  description:
    'Simulate webhook deliveries from GitHub, Stripe, and Slack, audit headers, verify HMAC-SHA256 signature hashes, and generate replay cURL commands.',
};

export default function WebhookTesterPage() {
  return (
      <div className="flex flex-1 flex-col p-6">
        <WebhookTesterPro />
      </div>
  );
}
