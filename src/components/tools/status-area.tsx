'use client';

import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StatusAreaType = 'success' | 'warning' | 'error' | 'info' | 'idle';

export interface StatusAreaProps {
  status?: StatusAreaType;
  message?: string | null;
  detail?: string | null;
  className?: string;
}

export function StatusArea({
  status = 'idle',
  message,
  detail,
  className,
}: StatusAreaProps) {
  if (status === 'idle' && !message) {
    return null;
  }

  const getStyle = () => {
    switch (status) {
      case 'success':
        return {
          bg: 'bg-success/10 border-success/30 text-success',
          icon: <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-500',
          icon: <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />,
        };
      case 'error':
        return {
          bg: 'bg-destructive/10 border-destructive/30 text-destructive',
          icon: <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />,
        };
      case 'info':
      default:
        return {
          bg: 'bg-primary/10 border-primary/30 text-primary',
          icon: <Info className="h-4 w-4 shrink-0 text-primary" />,
        };
    }
  };

  const style = getStyle();

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-xl border p-3 text-xs transition-all',
        style.bg,
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        {style.icon}
        <div className="flex flex-col">
          <span className="font-semibold">{message || 'Status Notification'}</span>
          {detail && <span className="text-[11px] opacity-90 mt-0.5">{detail}</span>}
        </div>
      </div>
    </div>
  );
}
