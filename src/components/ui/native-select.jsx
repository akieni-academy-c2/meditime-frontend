import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NativeSelect({ className, size = 'default', children, ...props }) {
  return <div data-slot="native-select-wrapper" className="native-select-wrapper group/native-select relative has-[select:disabled]:opacity-50">
    <select data-slot="native-select" data-size={size} className={cn(
      'native-select min-w-0 appearance-none border border-input bg-transparent outline-none transition-[color,box-shadow] disabled:cursor-not-allowed',
      'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
      'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
      className,
    )} {...props}>{children}</select>
    <ChevronDown data-slot="native-select-icon" size={16} aria-hidden="true" />
  </div>;
}

export function NativeSelectOption({ className, ...props }) {
  return <option data-slot="native-select-option" className={cn('bg-[Canvas] text-[CanvasText]', className)} {...props} />;
}

export function NativeSelectOptGroup({ className, ...props }) {
  return <optgroup data-slot="native-select-optgroup" className={cn('bg-[Canvas] text-[CanvasText]', className)} {...props} />;
}
