import { useSearchParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { LoadingState, EmptyState, ErrorState } from '../components/States.jsx';
import { AuthButton } from '../components/AuthUI.jsx';
import Pagination from '../components/Pagination.jsx';
import { useResource } from '../lib/useResource.js';
import { formatDate, formatTime, personName } from '../lib/dates.js';

const tabs = [{ key: 'pending', label: 'En attente' }, { key: 'confirmed', label: 'Confirmés' }, { key: 'declined', label: 'Déclinés' }, { key: 'cancelled', label: 'Annulés' }, { key: 'past', label: 'Passés' }];
export default function MesRendezVous() {
  const [params, setParams] = useSearchParams();
  const status = tabs.some(tab => tab.key === params.get('status')) ? params.get('status') : 'pending';
  const page = Math.max(1, Number(params.get('page')) || 1);
  const resource = useResource('/me/appointments?' + new URLSearchParams({ status, page, limit: 12 }));
  return <><div className="section-heading"><h1>Mes rendez-vous</h1><AuthButton variant="ghost" onClick={resource.reload}>Actualiser</AuthButton></div><p className="page-intro">Retrouvez ici vos demandes et leur statut.</p>
    <div className="tabs" role="tablist" aria-label="Statut des demandes">{tabs.map(tab => <button key={tab.key} type="button" role="tab" aria-selected={status === tab.key} className="tab-button" data-active={status === tab.key} onClick={() => setParams({ status: tab.key })}>{tab.label}</button>)}</div>
    {resource.loading && <LoadingState label="Chargement de vos rendez-vous…" />}{resource.error && <ErrorState message={resource.error} onRetry={resource.reload} />}
    {resource.data && <><p className="results-count" role="status">{resource.data.pagination.total} demande(s)</p>{!resource.data.appointments.length && <EmptyState title="Aucun rendez-vous ici" description="Les demandes correspondant à ce statut apparaîtront ici." />}
    <ul className="appointment-list">{resource.data.appointments.map(appointment => { const doctor = appointment.slot.doctor; return <li key={appointment.id}><Link to={'/rendez-vous/' + appointment.id} className="appointment-card">
      <div className="appointment-card-header"><p className="appointment-doctor">Dr {personName(doctor.user)}</p><StatusBadge status={appointment.status} isPast={appointment.isPast} /></div>
      <p className="appointment-specialty">{doctor.specialty?.name}</p><p className="appointment-line"><Calendar size={14} />{formatDate(appointment.slot.startsAt, doctor.timezone)}</p><p className="appointment-line"><Clock size={14} />{formatTime(appointment.slot.startsAt, doctor.timezone)}</p><p className="appointment-line"><MapPin size={14} />{[doctor.address, doctor.city].filter(Boolean).join(', ')}</p>
    </Link></li>; })}</ul><Pagination pagination={resource.data.pagination} onPage={value => setParams({ status, page: value })} /></>}
  </>;
}
