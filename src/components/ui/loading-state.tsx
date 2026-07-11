'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

interface LoadingStateProps {
  message?: string;
  children?: ReactNode;
  className?: string;
}

export function LoadingState({
  message = 'Loading...',
  children,
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-16',
        className
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
      {children}
    </div>
  );
}
