import { CalendarDays, House, UserRound } from 'lucide-react';
import { Link, Navigate, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { AuthButton, AuthLoading, AuthNotice } from './AuthUI.jsx';
import { Brand } from './Brand.jsx';

export default function AppShell() {
  const { account, loading, error, refresh } = useAuth();
  if (loading) return <AuthLoading />;
  if (error) return <main className="auth-screen status-screen"><Brand /><h1>Le service est indisponible</h1><AuthNotice error>{error}</AuthNotice><AuthButton onClick={() => refresh()}>Réessayer</AuthButton></main>;
  if (!account) return <Navigate to="/connexion" replace />;

  return <div className="app-shell">
    <header className="app-header"><Brand /><Link className="profile-shortcut" to="/profil" aria-label="Ouvrir mon profil"><UserRound size={23} aria-hidden="true" /></Link></header>
    <main className="app-content" id="main-content"><Outlet /></main>
    <nav className="tab-bar" aria-label="Navigation principale">
      {[['/accueil', 'Accueil', House], ['/rendez-vous', 'Rendez-vous', CalendarDays], ['/profil', 'Profil', UserRound]].map(([to, label, Icon]) =>
        <NavLink key={to} to={to}><Icon size={25} aria-hidden="true" /><span>{label}</span></NavLink>)}
    </nav>
  </div>;
}
