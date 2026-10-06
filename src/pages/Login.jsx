import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { api, configureSession } from '../lib/api.js';
import GoogleButton from '../components/GoogleButton.jsx';
import { Brand, SecurityArtwork } from '../components/Brand.jsx';
import { AuthButton, AuthLoading, AuthNotice, CodeField, EmailField } from '../components/AuthUI.jsx';

export default function Login() {
  const { account, acceptSession, loading, error: sessionError, refresh } = useAuth();
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
    try {
      const authenticated = await api(path, { method: 'POST', body });
      // Keep CSRF available if /me has a transient network error and login is retried.
      configureSession(authenticated.csrfToken);
      // Confirm the cookie is usable before entering the authenticated pages.
      let session;
      try { session = await api('/me'); }
      catch (err) {
        if (err.status === 401) throw new Error('La connexion a été validée, mais votre session n’a pas été conservée par le navigateur. Réessayez ou ouvrez MediTime directement dans Safari ou Chrome.');
        throw err;
      }
      acceptSession(session);
      setCode('');
    }
    catch (err) {
      const googleErrors = {
        EMAIL_VERIFICATION_REQUIRED: 'Une vérification de votre adresse email est nécessaire pour lier ce compte à Google. Vous pouvez vous connecter par code email.',
        INVALID_GOOGLE_TOKEN: 'Votre connexion Google a expiré ou est invalide. Réessayez avec Google.',
        GOOGLE_EMAIL_UNVERIFIED: 'Votre adresse email n’est pas vérifiée par Google. Vérifiez-la dans votre compte Google ou connectez-vous par code email.',
        GOOGLE_EMAIL_MISMATCH: 'Utilisez le compte Google correspondant à votre compte MediTime connecté.',
        GOOGLE_NOT_CONFIGURED: 'La connexion Google est momentanément indisponible. Réessayez plus tard ou connectez-vous par code email.',
      };
      setError(path === '/auth/google' ? googleErrors[err.code] || err.message : err.message);
    } finally { setBusy(false); }
  }

  if (loading) return <AuthLoading />;
  if (sessionError) return <section className="auth-screen status-screen"><Brand /><h1>Le service est indisponible</h1><AuthNotice error>{sessionError}</AuthNotice><AuthButton onClick={() => refresh()}>Réessayer</AuthButton></section>;
  if (account) return <Navigate to="/accueil" replace />;

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
    {step === 'email' && <p className="demo-note">Version de démonstration : envoi email limité à l’adresse autorisée.</p>}
  </section>;
}
