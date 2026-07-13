'use client';

import type { KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Heart,
  Braces,
  FileCode,
  Sparkles,
  Regex,
  Key,
  Database,
  Globe,
  Terminal,
  Wrench,
  ArrowUpRight,
} from 'lucide-react';
import { cardHover } from '@/animations/variants';
import type { ToolMetadata, ToolCategory } from '@/sdk/tool-types';

interface ToolCardProps {
  tool: ToolMetadata;
  isFavorite?: boolean;
  isRecentlyUsed?: boolean;
  onFavoriteToggle?: () => void;
  onClick?: () => void;
  className?: string;
}

function getCategoryIcon(category: ToolCategory | string) {
  switch (category) {
    case 'formatting':
      return <Braces className="h-4.5 w-4.5 text-primary" />;
    case 'encoding':
      return <FileCode className="h-4.5 w-4.5 text-primary" />;
    case 'generators':
      return <Sparkles className="h-4.5 w-4.5 text-primary" />;
    case 'regex':
      return <Regex className="h-4.5 w-4.5 text-primary" />;
    case 'crypto':
      return <Key className="h-4.5 w-4.5 text-primary" />;
    case 'sql':
      return <Database className="h-4.5 w-4.5 text-primary" />;
    case 'network':
      return <Globe className="h-4.5 w-4.5 text-primary" />;
    case 'devops':
      return <Terminal className="h-4.5 w-4.5 text-primary" />;
    case 'api':
      return <FileCode className="h-4.5 w-4.5 text-primary" />;
    default:
      return <Wrench className="h-4.5 w-4.5 text-primary" />;
  }
}

export function ToolCard({
  tool,
  isFavorite = false,
  isRecentlyUsed = false,
  onFavoriteToggle,
  onClick,
  className,
}: ToolCardProps) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <motion.article
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      tabIndex={0}
      role="button"
      aria-label={`Launch ${tool.name} tool`}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      className={cn(
        'group relative flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card/70 p-5 transition-all duration-200 hover:border-primary/40 hover:bg-card hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer select-none',
        className
      )}
    >
      {/* Header Area */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-primary/10 transition-transform duration-200 group-hover:scale-105">
          {getCategoryIcon(tool.category)}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {isRecentlyUsed && (
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              Recent
            </span>
          )}
          {tool.status === 'beta' && (
            <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
              Beta
            </span>
          )}
          {tool.status === 'deprecated' && (
            <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[10px] font-semibold text-rose-400">
              Deprecated
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle?.();
            }}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-transform duration-150 active:scale-125',
                isFavorite ? 'fill-destructive text-destructive' : 'hover:text-foreground'
              )}
            />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
            {tool.name}
          </h3>
          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Footer Area */}
      <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-3">
        <span className="rounded-md bg-muted/60 border border-border/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground capitalize">
          {tool.category}
        </span>
        {tool.shortcut ? (
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            {tool.shortcut}
          </kbd>
        ) : (
          <span className="text-[10px] font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            Launch →
          </span>
        )}
      </div>
    </motion.article>
  );
}
