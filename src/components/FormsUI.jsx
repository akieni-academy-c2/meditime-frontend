import { useId } from 'react';
import { Input } from './ui/input.jsx';
import { Label } from './ui/label.jsx';
import { Textarea } from './ui/textarea.jsx';
import { NativeSelect, NativeSelectOption } from './ui/native-select.jsx';

export function NativeSelectField({ label, options, placeholder = 'Choisir', ...props }) {
  const generatedId = useId();
  const id = props.id || generatedId;
  const showPlaceholder = props.value === undefined && props.defaultValue === undefined;
  return <div className="mt-field"><Label htmlFor={id}>{label}</Label><NativeSelect {...(showPlaceholder && { defaultValue: '' })} {...props} id={id}>{showPlaceholder && <NativeSelectOption value="" disabled>{placeholder}</NativeSelectOption>}{options.map(({ value, label: text }) => <NativeSelectOption key={value} value={value}>{text}</NativeSelectOption>)}</NativeSelect></div>;
}

export function FormField({ label, hint, error, icon: Icon, multiline = false, ...props }) {
  const generatedId = useId();
  const id = props.id || generatedId;
  const Control = multiline ? Textarea : Input;
  return <div className="mt-field"><Label htmlFor={id}>{label}</Label><div className={Icon ? 'mt-input-icon' : ''}>{Icon && <Icon size={20} aria-hidden="true" />}<Control {...props} id={id} aria-invalid={Boolean(error)} aria-describedby={error || hint ? `${id}-hint` : undefined} /></div>
    {(error || hint) && <p id={`${id}-hint`} className={error ? 'field-error' : 'field-hint'} role={error ? 'alert' : undefined}>{error || hint}</p>}
  </div>;
}
