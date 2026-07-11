'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { cardHover } from '@/animations/variants';
import type { CategoryDefinition } from '@/sdk/tool-types';

interface CategoryCardProps {
  category: CategoryDefinition;
  toolCount?: number;
  onClick?: () => void;
  className?: string;
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
        'group relative flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:border-primary/30',
        className
      )}
    >
      {/* Gradient border glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${category.color}15, transparent 60%)`,
        }}
      />

      <div
        className="relative flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${category.color}20` }}
      >
        <span className="text-lg" style={{ color: category.color }}>
          {/* Icon placeholder — will be replaced with Lucide icon in Sprint v0.3+ */}
          ⚡
        </span>
      </div>

      <div className="relative">
        <h3 className="text-sm font-semibold text-foreground">
          {category.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
          {category.description}
        </p>
      </div>

      {toolCount > 0 && (
        <span className="relative text-xs text-muted-foreground">
          {toolCount} tools
        </span>
      )}
    </motion.button>
  );
}
