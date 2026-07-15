'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

export default function FeedbackPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [type, setType] = useState('feature');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setFeedback('');
    }, 1000);
  };

  return (
    <div className="space-y-8 pb-16 max-w-2xl mx-auto">
      <div className="space-y-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="rounded-3xl border border-border/80 bg-card/70 p-8 shadow-md space-y-6">
          <div className="space-y-1">
            <h1 className="font-heading text-2xl font-extrabold text-foreground">
              Send Feedback & Requests
            </h1>
            <p className="text-sm text-muted-foreground">
              Have a tool idea or found a bug? Let us know below.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-2">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-foreground">Thank you for your feedback!</h3>
              <p className="text-xs text-muted-foreground">
                Your feedback has been logged locally and helps us improve DevForge.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 text-xs font-semibold text-primary hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Feedback Type
                </label>
                <div className="flex gap-3">
                  {['feature', 'bug', 'general'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition-all ${
                        type === t
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {t === 'feature' ? 'New Tool Request' : t === 'bug' ? 'Report Bug' : 'General'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Your Message
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Describe your idea or report..."
                  rows={5}
                  required
                  className="w-full rounded-xl border border-border bg-background p-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 shadow-md transition-all"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit Feedback</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
