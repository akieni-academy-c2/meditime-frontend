import { useId } from 'react';
import { Input } from './ui/input.jsx';
import { Label } from './ui/label.jsx';
import { Textarea } from './ui/textarea.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.jsx';

export function FormField({ label, hint, error, icon: Icon, multiline = false, ...props }) {
  const generatedId = useId();
  const id = props.id || generatedId;
  const Control = multiline ? Textarea : Input;
  return <div className="mt-field"><Label htmlFor={id}>{label}</Label><div className={Icon ? 'mt-input-icon' : ''}>{Icon && <Icon size={20} aria-hidden="true" />}<Control {...props} id={id} aria-invalid={Boolean(error)} aria-describedby={error || hint ? `${id}-hint` : undefined} /></div>
    {(error || hint) && <p id={`${id}-hint`} className={error ? 'field-error' : 'field-hint'} role={error ? 'alert' : undefined}>{error || hint}</p>}
  </div>;
}

export function SelectField({ label, options, placeholder = 'Choisir', ...props }) {
  const id = useId();
  return <div className="mt-field"><Label htmlFor={id}>{label}</Label><Select {...props}><SelectTrigger id={id}><SelectValue placeholder={placeholder} /></SelectTrigger><SelectContent>{options.map(({ value, label: text }) => <SelectItem key={value} value={value}>{text}</SelectItem>)}</SelectContent></Select></div>;
}
