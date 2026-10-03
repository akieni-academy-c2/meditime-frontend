import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';
import { AuthButton, AuthNotice } from '../components/AuthUI.jsx';

export default function Placeholder({ title, description, profile = false }) {
  const { logout } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function disconnect() {
    setBusy(true); setError('');
    try { await logout(); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <><h1>{title}</h1><p className="page-intro">{description}</p><div className="page-placeholder"><h2>Page en préparation</h2><p>La navigation est en place. Le contenu de cette page sera ajouté ensuite.</p></div>
    {profile && <><AuthButton variant="outline" disabled={busy} onClick={disconnect}><LogOut size={18} aria-hidden="true" />{busy ? 'Déconnexion…' : 'Se déconnecter'}</AuthButton>{error && <AuthNotice error>{error}</AuthNotice>}</>}
  </>;
}
