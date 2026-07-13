'use client';

import { useState, useMemo } from 'react';
import {
  Webhook,
  ShieldCheck,
  AlertTriangle,
  Send,
  KeyRound,
  FileJson,
} from 'lucide-react';
import {
  verifyWebhookSignature,
  generateWebhookReplayCurl,
  WEBHOOK_SAMPLE_EVENTS,
  type WebhookEventLog,
} from '@/lib/webhook-tester-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function WebhookTesterPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [activeLog, setActiveLog] = useState<WebhookEventLog>(
    WEBHOOK_SAMPLE_EVENTS[0]
  );
  const [targetUrl, setTargetUrl] = useState<string>(
    'https://api.devforge.io/webhooks/github'
  );
  const [secretKey, setSecretKey] = useState<string>('my_github_secret_token');
  const [providedSig, setProvidedSig] = useState<string>(
    'sha256=17ca92f1b0a82b9e6df7e0342'
  );

  const verification = useMemo(
    () => verifyWebhookSignature(activeLog.payload, secretKey, providedSig),
    [activeLog.payload, secretKey, providedSig]
  );

  const replayCurl = useMemo(
    () => generateWebhookReplayCurl(targetUrl, activeLog, secretKey),
    [targetUrl, activeLog, secretKey]
  );

  const handleRunVerify = () => {
    addHistoryItem(
      'Webhook Tester',
      `Inspected ${activeLog.provider} webhook event (${activeLog.event})`
    );
  };

  const exportJson = useMemo(
    () =>
      JSON.stringify(
        {
          webhookId: activeLog.id,
          provider: activeLog.provider,
          event: activeLog.event,
          targetUrl,
          headers: activeLog.headers,
          verificationResult: verification,
          payload: JSON.parse(activeLog.payload || '{}'),
          replayCurlCommand: replayCurl,
        },
        null,
        2
      ),
    [activeLog, targetUrl, verification, replayCurl]
  );

  return (
    <ToolPage
      title="Webhook Tester & Payload Simulator"
      description="Simulate webhook deliveries from GitHub, Stripe, and Slack, audit headers, verify HMAC-SHA256 signature hashes, and generate replay cURL commands"
      category="API"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              value={activeLog.id}
              onChange={(e) => {
                const found = WEBHOOK_SAMPLE_EVENTS.find(
                  (evt) => evt.id === e.target.value
                );
                if (found) {
                  setActiveLog(found);
                  setProvidedSig(
                    found.headers['X-Hub-Signature-256'] ||
                      found.headers['Stripe-Signature'] ||
                      found.headers['X-Slack-Signature'] ||
                      'sha256=sample_hash_981'
                  );
                }
              }}
              className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none"
            >
              {WEBHOOK_SAMPLE_EVENTS.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.provider.toUpperCase()} — {evt.event} ({evt.method})
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
              <span>Status:</span>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-emerald-400">
                HTTP {activeLog.status} OK
              </span>
            </div>
          </div>

          <ToolToolbar
            onRun={handleRunVerify}
            runLabel="Verify Webhook Delivery"
            onLoadSample={() => {
              setActiveLog(WEBHOOK_SAMPLE_EVENTS[0]);
              setSecretKey('my_github_secret_token');
            }}
            onClear={() => setTargetUrl('')}
            onCopyOutput={() => copyOutput(replayCurl)}
            canCopy={Boolean(replayCurl)}
            onDownloadOutput={() =>
              downloadFile(
                exportJson,
                `${activeLog.provider}-${activeLog.event}-webhook.json`
              )
            }
            canDownload={Boolean(exportJson)}
          />
        </div>
      }
      statusArea={
        <StatusArea
          status={verification.isValid ? 'success' : 'warning'}
          message={
            verification.isValid
              ? 'HMAC Signature Verified'
              : 'Computed HMAC Digest Ready'
          }
          detail={`Algorithm: HMAC-${verification.algorithm.toUpperCase()}`}
        />
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* Target Endpoint & Secret Key Bar */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground border-b border-border pb-2">
              <Webhook className="h-4 w-4 text-primary" />
              <span>Target Endpoint & HMAC Secret Verification</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Target Endpoint URL
                </label>
                <input
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Webhook Secret Key
                </label>
                <input
                  type="text"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Webhook shared secret..."
                  className="w-full rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground focus:outline-none"
                />
              </div>
            </div>

            {/* Signature Verification Comparison */}
            <div className="rounded-lg border border-border bg-card p-2.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <KeyRound className="h-3.5 w-3.5 text-primary" />
                  <span>HMAC Signature Hash Audit</span>
                </div>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                    verification.isValid
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {verification.isValid ? (
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Valid Signature
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Check Signature
                    </span>
                  )}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                <div>
                  <span className="text-muted-foreground block">
                    Expected Computed HMAC-SHA256:
                  </span>
                  <span className="text-primary break-all font-semibold">
                    {verification.computedSignature}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">
                    Header Provided Signature:
                  </span>
                  <input
                    type="text"
                    value={providedSig}
                    onChange={(e) => setProvidedSig(e.target.value)}
                    className="w-full rounded border border-border bg-background px-2 py-0.5 text-foreground focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Webhook HTTP Headers */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Send className="h-4 w-4 text-primary" />
              <span>Incoming Webhook HTTP Headers</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-xs">
              {Object.entries(activeLog.headers).map(([k, v]) => (
                <div
                  key={k}
                  className="rounded border border-border bg-card px-2.5 py-1.5"
                >
                  <span className="font-bold text-primary">{k}: </span>
                  <span className="text-foreground break-all">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Webhook JSON Payload */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-2 flex-1 flex flex-col">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <FileJson className="h-4 w-4 text-primary" />
              <span>Webhook Event Payload Body ({activeLog.event})</span>
            </div>
            <pre className="overflow-x-auto rounded-lg border border-border bg-card p-3 font-mono text-xs text-foreground">
              {activeLog.payload}
            </pre>
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title="Synthetic Delivery Replay Command (cURL)"
          value={replayCurl}
          language="bash"
        />
      }
    />
  );
}
