import { CalendarDays, House, UserRound } from 'lucide-react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { AuthButton, AuthLoading, AuthNotice } from './AuthUI.jsx';
import { Brand } from './Brand.jsx';
import { AppHeader, TabBar } from './NavigationUI.jsx';

export default function AppShell() {
  const { account, loading, error, refresh } = useAuth();
  if (loading) return <AuthLoading />;
  if (error) return <main className="auth-screen status-screen"><Brand /><h1>Le service est indisponible</h1><AuthNotice error>{error}</AuthNotice><AuthButton onClick={() => refresh()}>Réessayer</AuthButton></main>;
  if (!account) return <Navigate to="/connexion" replace />;

  return <div className="app-shell">
    <AppHeader />
    <main className="app-content" id="main-content"><Outlet /></main>
    <TabBar items={[{ to: '/accueil', label: 'Accueil', icon: House }, { to: '/rendez-vous', label: 'Rendez-vous', icon: CalendarDays }, { to: '/profil', label: 'Profil', icon: UserRound }]} />
  </div>;
}
