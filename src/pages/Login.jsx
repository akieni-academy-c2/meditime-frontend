import { useEffect, useState } from 'react';
import { ArrowLeft, Check, LogOut } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';
import { api } from '../lib/api.js';
import GoogleButton from '../components/GoogleButton.jsx';
import { Brand, SecurityArtwork } from '../components/Brand.jsx';
import { AuthButton, AuthLoading, AuthNotice, CodeField, EmailField } from '../components/AuthUI.jsx';

export default function Login() {
  const { account, acceptSession, loading, error: sessionError, refresh, logout } = useAuth();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [resendAt, setResendAt] = useState(0);
  const [expiresAt, setExpiresAt] = useState(0);
  const [now, setNow] = useState(Date.now());
  const remaining = Math.max(0, Math.ceil((resendAt - now) / 1000));
  const expired = expiresAt > 0 && now >= expiresAt;

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  async function requestCode(event) {
    event?.preventDefault();
    if (busy || remaining) return;
    setBusy(true); setError(''); setNotice('');
    setResending(step === 'code');
    try {
      const result = await api('/auth/email/request', { method: 'POST', body: { email: email.trim().toLowerCase() } });
      setEmail(email.trim().toLowerCase()); setCode(''); setStep('code');
      setNow(Date.now()); setResendAt(Date.now() + (result.resendAfter || 60) * 1000);
      setExpiresAt(Date.now() + (result.expiresIn || 600) * 1000);
      if (step === 'code') setNotice('Un nouveau code a été envoyé.');
    } catch (err) {
      setError(err.message);
      if (err.retryAfter || err.status === 429) setResendAt(Date.now() + (err.retryAfter || 60) * 1000);
    } finally { setBusy(false); setResending(false); }
  }

  async function signIn(path, body) {
    if (busy) return;
    setBusy(true); setError(''); setNotice('');
    try { acceptSession(await api(path, { method: 'POST', body })); setCode(''); }
    catch (err) {
      setError(err.code === 'EMAIL_VERIFICATION_REQUIRED' ? 'Utilisez le code email pour vous connecter à ce compte. La liaison Google sera disponible dans une prochaine version.' : err.message);
    } finally { setBusy(false); }
  }

  async function disconnect() {
    setBusy(true); setError('');
    try { await logout(); setStep('email'); setCode(''); setNotice(''); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  if (loading) return <AuthLoading />;
  if (sessionError) return <section className="auth-screen status-screen"><Brand /><h1>Le service est indisponible</h1><AuthNotice error>{sessionError}</AuthNotice><AuthButton onClick={() => refresh()}>Réessayer</AuthButton></section>;
  if (account) return <section className="auth-screen status-screen"><Brand /><div className="success-symbol"><Check size={36} /></div><h1>Vous êtes connecté !</h1><p className="auth-intro">Votre connexion à MediTime a réussi. Les autres écrans seront disponibles dans une prochaine version.</p>
    {error && <AuthNotice error>{error}</AuthNotice>}<AuthButton variant="outline" disabled={busy} onClick={disconnect}><LogOut size={18} />{busy ? 'Déconnexion…' : 'Se déconnecter'}</AuthButton>
  </section>;

  return <section className={`auth-screen ${step === 'code' ? 'code-screen' : 'email-screen'}`}>
    {step === 'code' && <button className="back-button" aria-label="Modifier mon email" disabled={busy} onClick={() => { setStep('email'); setCode(''); setError(''); setNotice(''); }}><ArrowLeft size={24} /></button>}
    <Brand />
    <header className="auth-heading"><h1>{step === 'email' ? <>Continuer avec<br />votre email</> : 'Vérifier votre email'}</h1>
      <p className="auth-intro">{step === 'email' ? <>Accédez à MediTime simplement<br />et en toute sécurité.</> : <>Nous avons envoyé un code de vérification<br className="wide-only" /> à <strong>{email}</strong></>}</p>
    </header>
    {error && <AuthNotice error>{error}</AuthNotice>}{notice && <AuthNotice>{notice}</AuthNotice>}
    {step === 'email' ? <div className="auth-actions">
      <form onSubmit={requestCode}><EmailField value={email} onChange={(e) => setEmail(e.target.value)} disabled={busy} /><AuthButton disabled={busy || remaining > 0}>{busy ? 'Envoi en cours…' : remaining ? `Réessayer dans ${remaining} s` : 'Continuer'}</AuthButton></form>
      <div className="auth-divider"><span>ou</span></div><GoogleButton disabled={busy} onCredential={(credential) => signIn('/auth/google', { credential })} />
    </div> : <form className="auth-actions" onSubmit={(e) => { e.preventDefault(); if (!expired && code.length === 6) signIn('/auth/email/verify', { email, code }); }}>
      <CodeField value={code} onChange={setCode} disabled={busy} />
      {expired && <AuthNotice error>Ce code a expiré. Demandez un nouveau code.</AuthNotice>}
      <button className="resend-button" type="button" disabled={busy || remaining > 0} onClick={requestCode}>{resending ? 'Envoi en cours…' : remaining ? `Renvoyer le code dans ${remaining} s` : 'Renvoyer le code'}</button>
      <AuthButton disabled={busy || code.length !== 6 || expired}>{busy && !resending ? 'Vérification…' : 'Continuer'}</AuthButton>
    </form>}
    <div className="security-section"><SecurityArtwork email={step === 'code'} /><p><strong>{step === 'code' ? 'Un accès plus simple' : 'Vos données sont protégées'}</strong><br />{step === 'code' ? 'Sans mot de passe, plus rapide, plus sûr.' : 'Connexion sécurisée et sans mot de passe.'}</p></div>
    {step === 'email' && <p className="demo-note">Version de démonstration : envoi email limité à l’adresse autorisée. Google en cours de validation.</p>}
  </section>;
}
