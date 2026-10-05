import { useSearchParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ChevronRight, RefreshCw } from 'lucide-react';
import PersonAvatar from '../components/PersonAvatar.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { LoadingState, EmptyState, ErrorState } from '../components/States.jsx';
import Pagination from '../components/Pagination.jsx';
import { useResource } from '../lib/useResource.js';
import { formatCompactDate, formatTime, personName } from '../lib/dates.js';

const tabs = [{ key: 'pending', label: 'En attente' }, { key: 'confirmed', label: 'Confirmés' }, { key: 'declined', label: 'Déclinés' }, { key: 'cancelled', label: 'Annulés' }, { key: 'past', label: 'Passés' }];
export default function MesRendezVous() {
  const [params, setParams] = useSearchParams();
  const status = tabs.some(tab => tab.key === params.get('status')) ? params.get('status') : 'pending';
  const page = Math.max(1, Number(params.get('page')) || 1);
  const resource = useResource('/me/appointments?' + new URLSearchParams({ status, page, limit: 12 }));
  return <><header className="list-page-title"><h1>Mes rendez-vous</h1><button type="button" aria-label="Actualiser les rendez-vous" disabled={resource.loading} onClick={resource.reload}><RefreshCw size={18} /></button></header>
    <div className="tabs" role="tablist" aria-label="Statut des demandes">{tabs.map(tab => <button key={tab.key} type="button" role="tab" aria-selected={status === tab.key} className="tab-button" data-active={status === tab.key} onClick={() => setParams({ status: tab.key })}>{tab.label}</button>)}</div>
    {resource.loading && <LoadingState label="Chargement de vos rendez-vous…" />}{resource.error && <ErrorState message={resource.error} onRetry={resource.reload} />}
    {resource.data && <><h2 className="results-count" role="status">{tabs.find(tab => tab.key === status).label} ({resource.data.pagination.total})</h2>{!resource.data.appointments.length && <EmptyState title="Aucun rendez-vous ici" description="Les demandes correspondant à ce statut apparaîtront ici." />}
    <ul className="appointment-list">{resource.data.appointments.map(appointment => { const doctor = appointment.slot.doctor; return <li key={appointment.id}><Link to={'/rendez-vous/' + appointment.id} className="appointment-card">
      <PersonAvatar name={personName(doctor.user)} avatarUrl={doctor.user.avatarUrl} /><div className="appointment-card-body"><div className="appointment-card-header"><p className="appointment-doctor">Dr {personName(doctor.user)}</p><StatusBadge status={appointment.status} isPast={appointment.isPast} /></div>
      <p className="appointment-specialty">{doctor.specialty?.name}</p><p className="appointment-line"><Calendar size={16} />{formatCompactDate(appointment.slot.startsAt, doctor.timezone)}</p><p className="appointment-line"><Clock size={16} />{formatTime(appointment.slot.startsAt, doctor.timezone)}</p><p className="appointment-line"><MapPin size={16} /><span>{doctor.practiceName}<small>{[doctor.address, doctor.city].filter(Boolean).join(', ')}</small></span></p></div><ChevronRight className="appointment-chevron" size={17} />
    </Link></li>; })}</ul><Pagination pagination={resource.data.pagination} onPage={value => setParams({ status, page: value })} /></>}
  </>;
}
