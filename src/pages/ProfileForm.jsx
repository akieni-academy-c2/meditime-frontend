import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, UserRound } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';
import { api } from '../lib/api.js';
import { FormField } from '../components/FormsUI.jsx';
import { AuthButton, AuthNotice } from '../components/AuthUI.jsx';
import { Brand } from '../components/Brand.jsx';
import { PageHeader, StepIndicator } from '../components/NavigationUI.jsx';
import PersonAvatar from '../components/PersonAvatar.jsx';

export default function ProfileForm({ onboarding = false, embedded = false, onSaved, onBusyChange }) {
  const { account, acceptSession } = useAuth();
  const user = account.user;
  const navigate = useNavigate();
  const [values, setValues] = useState({ firstName: user.firstName || '', lastName: user.lastName || '', phone: user.phone || '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const field = key => ({ value: values[key], onChange: event => setValues({ ...values, [key]: event.target.value }) });
  async function save(event) {
    event.preventDefault(); if (busy) return;
    setBusy(true); onBusyChange?.(true); setError('');
    try {
      acceptSession(await api('/me', { method: 'PATCH', body: { firstName: values.firstName.trim(), lastName: values.lastName.trim(), phone: values.phone.trim() || null } }));
      if (embedded) onSaved?.();
      else navigate(onboarding ? '/accueil' : '/profil', { replace: onboarding });
    } catch (err) { setError(err.message); } finally { setBusy(false); onBusyChange?.(false); }
  }
  return <section className={onboarding ? 'auth-screen onboarding-screen' : 'profile-form'}>
    {onboarding ? <><StepIndicator current={2} total={2} /><Brand /><div className="auth-heading"><h1>Créer votre profil</h1><p className="auth-intro">Quelques informations pour personnaliser votre expérience.</p></div></> : <>{!embedded && <PageHeader title="Mes informations" fallback="/profil" />}<div className="profile-identity"><PersonAvatar name={`${user.firstName || ''} ${user.lastName || ''}`} avatarUrl={user.avatarUrl} /><p>{user.email}</p></div></>}
    <form onSubmit={save} className="profile-fields"><FormField label="Prénom" icon={UserRound} required maxLength={80} autoComplete="given-name" {...field('firstName')} /><FormField label="Nom" icon={UserRound} required maxLength={80} autoComplete="family-name" {...field('lastName')} /><FormField label="Téléphone (facultatif)" icon={Phone} type="tel" maxLength={30} autoComplete="tel" {...field('phone')} />{error && <AuthNotice error>{error}</AuthNotice>}<AuthButton type="submit" disabled={busy}>{busy ? 'Enregistrement…' : onboarding ? 'Terminer' : 'Enregistrer les modifications'}</AuthButton></form>
  </section>;
}
