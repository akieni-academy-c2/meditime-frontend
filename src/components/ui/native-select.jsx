import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NativeSelect({ className, children, ...props }) {
  return <div className="native-select-wrapper"><select data-slot="native-select" className={cn('native-select', className)} {...props}>{children}</select><ChevronDown size={16} aria-hidden="true" /></div>;
}

export function NativeSelectOption(props) {
  return <option {...props} />;
}
