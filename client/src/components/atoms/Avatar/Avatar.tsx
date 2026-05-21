import { clsx } from 'clsx';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

export const Avatar = ({ src, alt, size = 'md', className }: AvatarProps) => (
  <img
    src={src}
    alt={alt}
    className={clsx(
      'rounded-full object-cover flex-shrink-0 ring-2 ring-gray-100 dark:ring-surface-700',
      sizeMap[size],
      className
    )}
    loading="lazy"
  />
);
