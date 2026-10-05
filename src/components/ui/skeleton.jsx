import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }) {
  return <div data-slot="skeleton" className={cn('skeleton', className)} {...props} />;
}
