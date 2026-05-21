import { clsx } from 'clsx';
import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'language';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  dotColor?: string;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 dark:bg-surface-700 text-gray-600 dark:text-gray-300',
  success: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  warning: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  danger: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  info: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  language: 'bg-gray-100 dark:bg-surface-700 text-gray-700 dark:text-gray-200',
};

export const Badge = ({
  children,
  variant = 'default',
  dot,
  dotColor,
  className,
}: BadgeProps) => (
  <span
    className={clsx(
      'badge',
      variantClasses[variant],
      className
    )}
  >
    {dot && (
      <span
        className="lang-dot mr-1.5"
        style={{ backgroundColor: dotColor ?? 'currentColor' }}
      />
    )}
    {children}
  </span>
);
