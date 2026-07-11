'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { cardHover } from '@/animations/variants';
import type { ToolMetadata } from '@/sdk/tool-types';

interface ToolCardProps {
  tool: ToolMetadata;
  isFavorite?: boolean;
  isRecentlyUsed?: boolean;
  onFavoriteToggle?: () => void;
  onClick?: () => void;
  className?: string;
}

export function ToolCard({
  tool,
  isFavorite = false,
  isRecentlyUsed = false,
  onFavoriteToggle,
  onClick,
  className,
}: ToolCardProps) {
  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      className={cn(
        'group relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/30',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <span className="text-sm text-primary">⚡</span>
        </div>
        <div className="flex items-center gap-2">
          {isRecentlyUsed && (
            <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
              Recent
            </span>
          )}
          {tool.status === 'beta' && (
            <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-medium text-warning">
              Beta
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle?.();
            }}
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:text-destructive"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={cn('h-4 w-4', isFavorite && 'fill-destructive text-destructive')}
            />
          </button>
        </div>
      </div>

      <button onClick={onClick} className="flex flex-col gap-1 text-left">
        <h3 className="text-sm font-semibold text-foreground">{tool.name}</h3>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {tool.description}
        </p>
      </button>

      <div className="mt-auto flex items-center justify-between">
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground capitalize">
          {tool.category}
        </span>
        {tool.shortcut && (
          <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            {tool.shortcut}
          </kbd>
        )}
      </div>
    </motion.div>
  );
}
