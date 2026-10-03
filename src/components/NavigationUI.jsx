import { ArrowLeft, UserRound } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { Brand } from './Brand.jsx';

export function AppHeader() {
  return <header className="app-header"><Brand /><Link className="profile-shortcut" to="/profil" aria-label="Ouvrir mon profil"><UserRound size={23} aria-hidden="true" /></Link></header>;
}
export function PageHeader({ title, onBack, action }) {
  return <header className="page-header">{onBack && <button type="button" onClick={onBack} aria-label="Retour"><ArrowLeft size={24} /></button>}<h1>{title}</h1>{action}</header>;
}
export function TabBar({ items }) {
  return <nav className="tab-bar" aria-label="Navigation principale" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>{items.map(({ to, label, icon: Icon, count }) => <NavLink key={to} to={to}><span className="nav-icon"><Icon size={25} aria-hidden="true" />{count > 0 && <span className="nav-count">{count}</span>}</span><span>{label}{count > 0 && <span className="sr-only">, {count} à traiter</span>}</span></NavLink>)}</nav>;
}
export function StepIndicator({ current, total }) {
  return <div className="step-indicator" aria-label={`Étape ${current} sur ${total}`}><div aria-hidden="true">{Array.from({ length: total }, (_, i) => <span key={i} className={i < current ? 'complete' : ''} />)}</div><p>Étape {current} sur {total}</p></div>;
}
