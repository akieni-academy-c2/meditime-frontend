import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, HelpCircle, LogOut, Stethoscope, UserRound, Users } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';
import { useMode } from '../auth/ModeContext.jsx';
import { SettingsRow } from '../components/CardsUI.jsx';
import { AuthButton, AuthNotice } from '../components/AuthUI.jsx';
import BottomSheet from '../components/BottomSheet.jsx';

export default function Profile() {
  const { logout } = useAuth();
  const { mode, allowedModes, changeMode } = useMode();
  const navigate = useNavigate();
  const [sheet, setSheet] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function disconnect() {
    if (busy) return;
    setBusy(true); setError('');
    try { await logout(); navigate('/connexion', { replace: true }); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  return <><h1>Paramètres</h1><p className="page-intro">Gérez votre compte et vos informations.</p>
    <section className="settings-group"><h2>Compte</h2><SettingsRow icon={UserRound} title="Mes informations" description="Nom, email, téléphone" onClick={() => navigate('/profil/informations')} /></section>
    {allowedModes.includes('doctor') && <section className="settings-group"><h2>Médecin</h2><SettingsRow icon={Stethoscope} title="Informations médecin" description="Spécialité, cabinet, adresse" onClick={() => { changeMode('doctor'); navigate('/profil/medecin'); }} /><SettingsRow icon={CalendarDays} title="Configurer le planning" description="Horaires et disponibilités" onClick={() => { changeMode('doctor'); navigate('/planning'); }} /></section>}
    <section className="settings-group"><h2>Assistance</h2><SettingsRow icon={HelpCircle} title="Aide" description="Connexion et rendez-vous" onClick={() => setSheet('help')} /></section>
    <section className="settings-group"><h2>Mode</h2><SettingsRow icon={Users} title={mode === 'doctor' ? 'Mode Médecin' : 'Mode Patient'} description="Utilisez le même compte" onClick={() => setSheet('mode')} /></section>
    {error && <AuthNotice error>{error}</AuthNotice>}<AuthButton className="logout-button" variant="outline" disabled={busy} onClick={disconnect}><LogOut size={20} />{busy ? 'Déconnexion…' : 'Déconnexion'}</AuthButton>
    <BottomSheet open={Boolean(sheet)} onOpenChange={value => { if (!value) setSheet(null); }} title={sheet === 'mode' ? 'Changer de mode' : 'Aide'} description={sheet === 'mode' ? 'Le même compte, deux expériences.' : 'Quelques repères pour utiliser MediTime.'}>
      {sheet === 'mode' ? <><div className="mode-options">{allowedModes.map(value => <button key={value} type="button" aria-pressed={mode === value} onClick={() => { changeMode(value); setSheet(null); navigate('/accueil'); }}>{value === 'doctor' ? <Stethoscope /> : <UserRound />}<span><strong>Mode {value === 'doctor' ? 'Médecin' : 'Patient'}</strong><small>{value === 'doctor' ? 'Gérez votre planning et vos demandes.' : 'Prenez rendez-vous et suivez vos demandes.'}</small></span></button>)}</div>{!allowedModes.includes('doctor') && <p className="page-intro">Le mode médecin nécessite une habilitation de votre compte.</p>}</> : <p className="page-intro">Une demande de rendez-vous reste en attente jusqu’à la décision du médecin. Si une erreur apparaît, vérifiez votre connexion puis réessayez. Le changement de mode conserve le même compte.</p>}
    </BottomSheet>
  </>;
}
