import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning';
  className?: string;
}

const variantStyles = {
  default: 'from-muted/50 to-muted/30',
  primary: 'from-primary/20 to-primary/5',
  accent: 'from-accent/20 to-accent/5',
  success: 'from-success/20 to-success/5',
  warning: 'from-warning/20 to-warning/5',
};

const iconVariantStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/20 text-primary',
  accent: 'bg-accent/20 text-accent',
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "glass-card-hover p-6 bg-gradient-to-br",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <motion.p
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-display font-bold"
          >
            {value}
          </motion.p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              "inline-flex items-center gap-1 text-sm font-medium",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground">o'tgan haftaga nisbatan</span>
            </div>
          )}
        </div>
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center",
          iconVariantStyles[variant]
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
};
