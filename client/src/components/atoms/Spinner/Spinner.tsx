import { clsx } from 'clsx';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };

export const Spinner = ({ size = 'md', className }: SpinnerProps) => (
  <span
    role="status"
    aria-label="Loading"
    className={clsx(
      'inline-block border-2 border-current border-t-transparent rounded-full animate-spin text-primary-500',
      sizeMap[size],
      className
    )}
  />
);
