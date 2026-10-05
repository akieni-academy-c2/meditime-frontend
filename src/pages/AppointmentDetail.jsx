import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Check, CalendarDays, Clock, MapPin } from 'lucide-react';
import { useResource } from '../lib/useResource.js';
import { PageHeader } from '../components/NavigationUI.jsx';
import { AuthButton, AuthNotice } from '../components/AuthUI.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import { api } from '../lib/api.js';
import ConfirmationSheet from '../components/ConfirmationSheet.jsx';
import PersonAvatar from '../components/PersonAvatar.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { formatCompactDate, formatTime, personName } from '../lib/dates.js';
import ResourceState from '../components/ResourceState.jsx';

const reasons = { REQUEST_EXPIRED: 'Le créneau est passé avant qu’une décision soit prise.', SLOT_BLOCKED: 'Le médecin a rendu ce créneau indisponible.', SLOT_TAKEN: 'Ce créneau a été attribué à une autre demande.' };
function RequestOverview({ appointment, doctorView }) {
  const { slot } = appointment;
  const person = doctorView ? appointment.patient : slot.doctor.user;
  return <section className="appointment-overview"><div className="overview-identity"><PersonAvatar name={personName(person)} avatarUrl={person.avatarUrl} /><div><h2>{doctorView ? '' : 'Dr '}{personName(person)}</h2>{!doctorView && <p>{slot.doctor.specialty?.name}</p>}<StatusBadge status={appointment.status} isPast={appointment.isPast} /></div></div><div className="overview-facts"><p><CalendarDays /><span>{formatCompactDate(slot.startsAt, slot.doctor.timezone)}</span></p><p><Clock /><span>{formatTime(slot.startsAt, slot.doctor.timezone)}</span></p><p><MapPin /><span>{slot.doctor.practiceName}<small>{[slot.doctor.address, slot.doctor.city].filter(Boolean).join(', ')}</small></span></p><p><Clock /><span>Durée de consultation<small>{Math.round((new Date(slot.endsAt) - new Date(slot.startsAt)) / 60000)} minutes</small></span></p></div></section>;
}
function CancelRequest({ appointment }) {
  const { notifyDataChanged } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function cancel() {
    if (busy) return;
    setBusy(true); setError('');
    try {
      await api('/appointments/' + appointment.id + '/cancel', { method: 'PATCH', body: {} });
      setOpen(false); notifyDataChanged();
    } catch (err) { setError(err.message); setOpen(false); notifyDataChanged(); }
    finally { setBusy(false); }
  }
  return <>{error && <AuthNotice error>{error}</AuthNotice>}{appointment.status === 'pending' && <AuthButton variant="outline" disabled={busy} onClick={() => setOpen(true)}>Annuler ma demande</AuthButton>}<ConfirmationSheet open={open} onOpenChange={setOpen} title="Annuler cette demande ?" description="Le médecin ne pourra plus confirmer cette demande." confirmLabel="Annuler la demande" cancelLabel="Conserver la demande" busy={busy} onConfirm={cancel} destructive /></>;
}
export default function AppointmentDetail({ doctorView = false, children }) {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const resource = useResource(`/appointments/${id}`);
  const appointment = resource.data?.appointment;
  const sent = !doctorView && params.get('envoyee') === '1';
  return <><PageHeader title={sent ? 'Récapitulatif de la demande' : 'Détail de la demande'} onBack={() => navigate(doctorView ? '/demandes' : '/rendez-vous')} /><ResourceState resource={resource} />{appointment && <>{sent && <div className="request-success"><div className="success-symbol"><Check size={40} /></div><h1>Demande envoyée !</h1><p>Votre demande a été transmise. Consultez son statut pour suivre la décision du médecin.</p></div>}<RequestOverview appointment={appointment} doctorView={doctorView} /><section className="request-info"><h2>Motif de la demande</h2><p>{appointment.reason || 'Aucun motif renseigné.'}</p></section>{reasons[appointment.decisionCode] && <p className="field-hint">{reasons[appointment.decisionCode]}</p>}{children?.(appointment, resource.reload)}<div className="request-secondary-actions">{!doctorView && <CancelRequest appointment={appointment} />}{sent && <><AuthButton onClick={() => navigate('/rendez-vous')}>Voir mes rendez-vous</AuthButton><Link className="text-action" to="/accueil">Retour à l’accueil</Link></>}</div></>}</>;
}
