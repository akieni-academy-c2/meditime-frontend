import { AlertCircle } from 'lucide-react';
import LoadingSkeleton from './LoadingSkeleton.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

export function AuthButton({ children, className = '', ...props }) {
  return <Button className={`auth-button ${className}`} {...props}>{children}</Button>;
}

export function EmailField({ value, onChange, disabled }) {
  return <div className="email-field"><Label className="sr-only" htmlFor="email">Adresse email</Label>
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="3" /><path d="m3 6 9 7 9-7" /></svg>
    <Input id="email" type="email" autoComplete="email" placeholder="votre@email.com" maxLength={254} required value={value} onChange={onChange} disabled={disabled} />
  </div>;
}

export function CodeField({ value, onChange, disabled }) {
  return <div className="code-field"><Label className="sr-only" htmlFor="code">Code de vérification à six chiffres</Label>
    <InputOTP id="code" maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={value} onChange={onChange} disabled={disabled} autoComplete="one-time-code" autoFocus inputMode="numeric" aria-describedby="code-hint" containerClassName="otp-container">
      <InputOTPGroup className="otp-group">{Array.from({ length: 6 }, (_, index) => <InputOTPSlot key={index} index={index} className="otp-slot" />)}</InputOTPGroup>
    </InputOTP><p id="code-hint" className="sr-only">Le code expire dans dix minutes. Vous pouvez coller les six chiffres.</p>
  </div>;
}

export function AuthNotice({ children, error = false }) {
  return <Alert className={`auth-notice ${error ? 'error' : ''}`} role={error ? 'alert' : 'status'}><AlertCircle size={18} /><AlertDescription>{children}</AlertDescription></Alert>;
}

export function AuthLoading() {
  return <LoadingSkeleton layout="screen" label="Chargement de la session" />;
}
