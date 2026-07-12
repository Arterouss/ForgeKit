'use client';

import { useState, useMemo } from 'react';
import { Shield, KeyRound, Clock, Copy, Check } from 'lucide-react';
import { decodeJwt, SAMPLE_JWT } from '@/lib/jwt-utils';
import { useClipboard } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  InputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function JwtDecoderPro() {
  const { addHistoryItem } = useWorkspace();
  const [token, setToken] = useState<string>(SAMPLE_JWT);
  const [activeTab, setActiveTab] = useState<'payload' | 'header' | 'claims'>('payload');

  const { copied: headerCopied, copyToClipboard: copyHeader } = useClipboard();
  const { copied: payloadCopied, copyToClipboard: copyPayload } = useClipboard();
  const { copyToClipboard: copyFull } = useClipboard();

  const decoded = useMemo(() => {
    return decodeJwt(token);
  }, [token]);

  const handleRunDecode = () => {
    const res = decodeJwt(token);
    if (res.isValid) {
      addHistoryItem(
        'JWT Decoder Pro',
        `Decoded JWT (${res.header?.alg ?? 'Token'})`,
        res.payload?.sub ? `Subject: ${String(res.payload.sub)}` : undefined
      );
    }
  };

  const handleLoadSample = () => {
    setToken(SAMPLE_JWT);
  };

  const handleClear = () => {
    setToken('');
  };

  const fullJsonString = useMemo(() => {
    if (!decoded.isValid) return '';
    return JSON.stringify(
      {
        header: decoded.header,
        payload: decoded.payload,
        signature: decoded.signature,
      },
      null,
      2
    );
  }, [decoded]);

  return (
    <ToolPage
      title="JWT Decoder Pro"
      description="Inspect, verify structure, and decode JSON Web Tokens (JWT) locally with human-readable claim inspection"
      category="Security"
      splitView={true}
      toolbar={
        <div className="space-y-2.5">
          <ToolToolbar
            onRun={handleRunDecode}
            runLabel="Inspect Token"
            onLoadSample={handleLoadSample}
            onClear={handleClear}
            onCopyOutput={() => copyFull(fullJsonString)}
            canCopy={decoded.isValid}
          />

          {/* Local Security & Privacy Banner */}
          <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs text-primary">
            <Shield className="h-4 w-4 shrink-0" />
            <span className="font-medium">
              100% Client-Side Privacy: Tokens are decoded locally in your browser and never transmitted to any server.
            </span>
          </div>
        </div>
      }
      statusArea={
        decoded.isValid ? (
          <StatusArea
            status={decoded.isExpired ? 'warning' : 'success'}
            message={
              decoded.isExpired
                ? 'Token Expired'
                : decoded.isNotYetValid
                  ? 'Token Not Yet Valid'
                  : 'Valid JWT Structure'
            }
            detail={
              decoded.isExpired
                ? 'The "exp" timestamp on this token is in the past.'
                : `Algorithm: ${String(decoded.header?.alg ?? 'Unknown')}`
            }
          />
        ) : token.trim() ? (
          <StatusArea status="error" message="Invalid JWT Structure" detail={decoded.error} />
        ) : undefined
      }
      inputPanel={
        <InputPanel
          title="Encoded JWT Token"
          value={token}
          onChange={setToken}
          language="JWT"
          onClear={handleClear}
        />
      }
      outputPanel={
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card/60">
          {/* Header Strip with Tabs */}
          <div className="flex flex-wrap items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('payload')}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                  activeTab === 'payload'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                Payload
              </button>
              <button
                onClick={() => setActiveTab('header')}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                  activeTab === 'header'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                Header
              </button>
              <button
                onClick={() => setActiveTab('claims')}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                  activeTab === 'claims'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                Claims & Timestamps
              </button>
            </div>

            {decoded.isValid && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    activeTab === 'header'
                      ? copyHeader(decoded.rawHeader)
                      : copyPayload(decoded.rawPayload)
                  }
                  className="flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {headerCopied || payloadCopied ? (
                    <>
                      <Check className="h-3 w-3 text-success" />
                      <span className="text-success">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy {activeTab === 'header' ? 'Header' : 'Payload'}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs">
            {!decoded.isValid ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                <KeyRound className="mb-2 h-8 w-8 text-muted-foreground/50" />
                <p>Enter a valid JWT token to inspect its header, payload, and claims.</p>
              </div>
            ) : activeTab === 'payload' ? (
              <pre className="whitespace-pre-wrap break-all text-foreground">
                {decoded.rawPayload}
              </pre>
            ) : activeTab === 'header' ? (
              <pre className="whitespace-pre-wrap break-all text-foreground">
                {decoded.rawHeader}
              </pre>
            ) : (
              <div className="space-y-3">
                <div className="text-xs font-sans font-semibold text-muted-foreground mb-2">
                  Standard JWT Claims & Timestamps
                </div>
                {decoded.claims.length === 0 ? (
                  <p className="text-muted-foreground italic">No standard registered claims found.</p>
                ) : (
                  <div className="grid gap-2">
                    {decoded.claims.map((claim) => (
                      <div
                        key={claim.key}
                        className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-border bg-background/50 p-2.5 font-sans"
                      >
                        <div>
                          <span className="font-semibold text-foreground">{claim.label}</span>
                          <div className="font-mono text-xs text-primary mt-0.5 break-all">
                            {String(claim.value)}
                          </div>
                        </div>
                        {claim.humanReadable && (
                          <div className="flex items-center gap-1.5 mt-1 sm:mt-0 text-xs">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span
                              className={
                                claim.isExpired ? 'text-destructive font-semibold' : 'text-muted-foreground'
                              }
                            >
                              {claim.humanReadable}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      }
    />
  );
}
