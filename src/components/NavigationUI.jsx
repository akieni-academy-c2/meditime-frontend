import { ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Brand } from './Brand.jsx';
import PersonAvatar from './PersonAvatar.jsx';
import { useBack } from '../lib/useBack.js';

export function AppHeader({ user }) {
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email?.split('@')[0];
  return <header className="app-header"><Brand /><Link className="profile-shortcut" to="/profil" aria-label="Ouvrir mon profil"><PersonAvatar name={name} avatarUrl={user?.avatarUrl} className="header-avatar" /></Link></header>;
}
export function PageHeader({ title, onBack, action, fallback }) {
  const back = useBack(fallback);
  if (fallback) onBack = back;
  return <header className={`page-header ${onBack ? 'has-back' : 'no-back'} ${action ? 'has-action' : ''}`}>{onBack && <button type="button" onClick={onBack} aria-label="Retour"><ArrowLeft size={24} /></button>}<h1>{title}</h1>{action}</header>;
}
export function TabBar({ items, selectedTo }) {
  const { pathname } = useLocation();
  return <nav className="tab-bar" aria-label="Navigation principale" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>{items.map(({ to, label, icon: Icon, count }) => <Link key={to} to={to} aria-current={pathname === to || pathname.startsWith(to + '/') || selectedTo === to ? 'page' : undefined}><span className="nav-icon"><Icon size={25} aria-hidden="true" />{count > 0 && <span className="nav-count">{count}</span>}</span><span>{label}{count > 0 && <span className="sr-only">, {count} à traiter</span>}</span></Link>)}</nav>;
}
export function StepIndicator({ current, total }) {
  return <div className="step-indicator" aria-label={`Étape ${current} sur ${total}`}><div aria-hidden="true">{Array.from({ length: total }, (_, i) => <span key={i} className={i < current ? 'complete' : ''} />)}</div><p>Étape {current} sur {total}</p></div>;
}
