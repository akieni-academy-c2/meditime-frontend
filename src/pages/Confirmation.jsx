import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle2, Clock, MapPin, FileText } from 'lucide-react';
import { AuthButton } from '../components/AuthUI.jsx';
import { LoadingState, ErrorState } from '../components/States.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { useResource } from '../lib/useResource.js';
import { formatDate, formatTime, personName } from '../lib/dates.js';

export default function Confirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const resource = useResource('/appointments/' + id);
  const appointment = resource.data?.appointment;
  if (resource.loading) return <LoadingState label="Vérification de la demande…" />;
  if (resource.error) return <><ErrorState message={resource.error} onRetry={resource.reload} /><AuthButton onClick={() => navigate('/rendez-vous')}>Voir mes rendez-vous</AuthButton></>;
  if (!appointment) return null;
  const doctor = appointment.slot.doctor;
  return <section className="confirmation-section"><div className="confirmation-symbol" aria-hidden="true"><CheckCircle2 size={48} /></div>
    <h1 className="confirmation-title">{appointment.status === 'pending' ? 'Demande envoyée !' : 'Votre demande'}</h1>
    <p className="confirmation-text">Votre demande auprès du <strong>Dr {personName(doctor.user)}</strong> est enregistrée.</p>
    <p className="confirmation-text confirmation-text-muted">Consultez vos rendez-vous pour suivre la décision du médecin.</p>
    <div className="confirmation-card"><h2 className="confirmation-card-title">Récapitulatif de la demande</h2><StatusBadge status={appointment.status} isPast={appointment.isPast} />
      <p className="confirmation-card-doctor">Dr {personName(doctor.user)}</p><p className="confirmation-card-specialty">{doctor.specialty?.name}</p>
      <div className="confirmation-info"><p className="confirmation-line"><Calendar size={15} />{formatDate(appointment.slot.startsAt, doctor.timezone)}</p><p className="confirmation-line"><Clock size={15} />{formatTime(appointment.slot.startsAt, doctor.timezone)} — {formatTime(appointment.slot.endsAt, doctor.timezone)}</p><p className="confirmation-line"><MapPin size={15} />{[doctor.address, doctor.city].filter(Boolean).join(', ')}</p>{appointment.reason && <p className="confirmation-line"><FileText size={15} />Motif : {appointment.reason}</p>}</div>
    </div><div className="confirmation-actions"><AuthButton onClick={() => navigate('/rendez-vous')}>Voir mes rendez-vous</AuthButton><AuthButton variant="outline" onClick={() => navigate('/accueil')}>Retour à l’accueil</AuthButton></div>
  </section>;
}
