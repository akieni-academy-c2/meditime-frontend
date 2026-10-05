import { useEffect } from 'react';
import { CalendarDays, House, UserRound, ClipboardList } from 'lucide-react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { useMode } from '../auth/ModeContext.jsx';
import { AuthButton, AuthLoading, AuthNotice } from './AuthUI.jsx';
import { Brand } from './Brand.jsx';
import { AppHeader, TabBar } from './NavigationUI.jsx';
import { useResource } from '../lib/useResource.js';
import '../business.css';

export default function AppShell() {
  const { account, loading, error, refresh } = useAuth();
  const { mode } = useMode();
  const location = useLocation();
  const dashboard = useResource(account?.user.profileCompleted ? `/me/dashboard?mode=${mode}` : null);
  useEffect(() => { dashboard.reload(); }, [location.pathname, dashboard.reload]);
  if (loading) return <AuthLoading />;
  if (error) return <main className="auth-screen status-screen"><Brand /><h1>Le service est indisponible</h1><AuthNotice error>{error}</AuthNotice><AuthButton onClick={() => refresh()}>Réessayer</AuthButton></main>;
  if (!account) return <Navigate to="/connexion" replace />;
  if (!account.user.profileCompleted && location.pathname !== '/profil/completer') return <Navigate to="/profil/completer" replace />;
  if (location.pathname === '/profil/completer') return <main><Outlet /></main>;

  const showBrand = ['/accueil', '/profil'].includes(location.pathname);
  return <div className={`app-shell business-shell ${showBrand ? 'with-brand' : 'internal-page'}`}>
    {showBrand && <AppHeader user={account.user} />}
    <main className="app-content" id="main-content"><div className="page-content" key={location.pathname}><Outlet context={{ dashboard }} /></div></main>
    <TabBar selectedTo={location.pathname === '/recherche' ? '/accueil' : mode === 'patient' && location.pathname.startsWith('/medecins/') ? '/rendez-vous' : undefined} items={mode === 'doctor' ? [{ to: '/accueil', label: 'Accueil', icon: House }, { to: '/planning', label: 'Planning', icon: CalendarDays }, { to: '/demandes', label: 'Demandes', icon: ClipboardList, count: dashboard.data?.counts.pending }, { to: '/profil', label: 'Profil', icon: UserRound }] : [{ to: '/accueil', label: 'Accueil', icon: House }, { to: '/rendez-vous', label: 'Rendez-vous', icon: CalendarDays }, { to: '/profil', label: 'Profil', icon: UserRound }]} />
  </div>;
}
