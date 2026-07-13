'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { cardHover } from '@/animations/variants';
import type { CategoryDefinition } from '@/sdk/tool-types';
import {
  Braces,
  FileCode,
  Sparkles,
  Regex,
  Key,
  Database,
  Globe,
  Terminal,
  Wrench,
  ArrowRight,
} from 'lucide-react';

interface CategoryCardProps {
  category: CategoryDefinition;
  toolCount?: number;
  onClick?: () => void;
  className?: string;
}

function getCategoryIcon(categoryId: string, className?: string) {
  switch (categoryId) {
    case 'formatting':
      return <Braces className={className} />;
    case 'encoding':
      return <FileCode className={className} />;
    case 'generators':
      return <Sparkles className={className} />;
    case 'regex':
      return <Regex className={className} />;
    case 'crypto':
      return <Key className={className} />;
    case 'sql':
      return <Database className={className} />;
    case 'network':
      return <Globe className={className} />;
    case 'devops':
      return <Terminal className={className} />;
    case 'api':
      return <FileCode className={className} />;
    default:
      return <Wrench className={className} />;
  }
}

export function CategoryCard({
  category,
  toolCount = 0,
  onClick,
  className,
}: CategoryCardProps) {
  return (
    <motion.button
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      onClick={onClick}
      className={cn(
        'group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card/60 p-5 text-left transition-all hover:border-primary/50 hover:bg-card hover:shadow-xl',
        className
      )}
    >
      {/* Gradient border glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top right, ${category.color}25, transparent 70%)`,
        }}
      />

      <div className="flex items-center justify-between w-full">
        <div
          className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-border/50 shadow-sm transition-transform duration-200 group-hover:scale-105"
          style={{ backgroundColor: `${category.color}18`, color: category.color }}
        >
          {getCategoryIcon(category.id, 'h-5 w-5')}
        </div>

        {toolCount > 0 && (
          <span className="rounded-full border border-border/60 bg-muted/50 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground group-hover:border-primary/30 group-hover:text-foreground transition-colors">
            {toolCount} tools
          </span>
        )}
      </div>

      <div className="relative mt-4 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
        </div>
        <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
          {category.description}
        </p>
      </div>
    </motion.button>
  );
}
