import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';

interface KPINumberProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  animate?: boolean;
}

export const KPINumber = ({
  value,
  suffix = '',
  prefix = '',
  className,
  animate = true,
}: KPINumberProps) => {
  const [displayed, setDisplayed] = useState(animate ? 0 : value);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!animate) {
      setDisplayed(value);
      return;
    }

    const duration = 800;
    const start = performance.now();
    const from = 0;

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setDisplayed(Math.round(from + (value - from) * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    };

    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, animate]);

  return (
    <span className={clsx('font-bold tabular-nums', className)}>
      {prefix}
      {displayed.toLocaleString()}
      {suffix}
    </span>
  );
};
