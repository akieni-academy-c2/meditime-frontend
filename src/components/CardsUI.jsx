import { ChevronRight, LoaderCircle } from 'lucide-react';
import PersonAvatar from './PersonAvatar.jsx';
import { StatusBadge } from './SchedulingUI.jsx';

export function PersonCard({ name, subtitle, avatarUrl, status, children, onClick }) {
  const content = <><PersonAvatar name={name} avatarUrl={avatarUrl} /><div className="person-details"><div className="person-heading"><h3>{name}</h3>{status && <StatusBadge status={status} />}</div>{subtitle && <p>{subtitle}</p>}{children}</div>{onClick && <ChevronRight className="person-chevron" size={18} aria-hidden="true" />}</>;
  return onClick ? <button type="button" className="person-card" onClick={onClick}>{content}</button> : <article className="person-card">{content}</article>;
}

export function SettingsRow({ icon: Icon, title, description, onClick }) {
  return <button type="button" className="settings-row" onClick={onClick}><Icon size={24} aria-hidden="true" /><span><strong>{title}</strong>{description && <small>{description}</small>}</span><ChevronRight size={18} aria-hidden="true" /></button>;
}

export function EmptyState({ title, description, children }) {
  return <div className="page-placeholder"><h3>{title}</h3><p>{description}</p>{children}</div>;
}

export function LoadingState({ children = 'Chargement…' }) {
  return <p className="loading-state" role="status"><LoaderCircle className="spin" size={20} aria-hidden="true" />{children}</p>;
}
