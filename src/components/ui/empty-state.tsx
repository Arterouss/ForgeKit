'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/animations/variants';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-16 px-6 text-center rounded-3xl border-2 border-dashed border-cyan-500/40 bg-[#0c091f]/80 backdrop-blur-xl font-mono shadow-[0_0_30px_rgba(0,240,255,0.15)]',
        className
      )}
    >
      {icon && (
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
          {icon}
        </div>
      )}
      <div className="space-y-1.5 max-w-md">
        <h3 className="font-heading text-lg font-black uppercase text-white tracking-wider">{title}</h3>
        {description && (
          <p className="text-xs text-cyan-200/70 font-sans leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-3">{action}</div>}
    </motion.div>
  );
}
