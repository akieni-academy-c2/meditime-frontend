import { useState } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Stethoscope } from 'lucide-react';
import { PageHeader } from '../components/PageHeader.jsx';
import { AuthButton, AuthNotice } from '../components/AuthUI.jsx';
import { LoadingState, ErrorState } from '../components/States.jsx';
import PersonAvatar from '../components/PersonAvatar.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import { useResource } from '../lib/useResource.js';
import { createAppointment } from '../lib/appointments.js';
import { doctorForView } from '../lib/doctors.js';
import { dateInZone, formatDate, formatTime, personName } from '../lib/dates.js';

function RequestForm({ doctor, slotId, date }) {
  const { account, notifyDataChanged } = useAuth();
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const slots = useResource('/doctors/' + doctor.id + '/slots?' + new URLSearchParams({ from: date || dateInZone(new Date(), doctor.timezone), to: date || dateInZone(new Date(), doctor.timezone) }));
  const slot = slots.data?.slots.find(item => item.id === slotId && item.status === 'available');
  async function send(event) {
    event.preventDefault();
    if (!slot || busy) return;
    setBusy(true); setError('');
    try {
      const appointment = await createAppointment({ slotId: slot.id, reason });
      notifyDataChanged();
      navigate('/rendez-vous/confirmation/' + appointment.id, { replace: true });
    } catch (err) {
      setError(err.message);
      if (err.status === 409) { slots.reload(); notifyDataChanged(); }
    } finally { setBusy(false); }
  }
  return <section className="form-section"><h1 className="form-title">Demander un rendez-vous</h1>
    <div className="form-doctor-card"><div className="form-doctor-avatar"><PersonAvatar name={personName(doctor)} avatarUrl={doctor.photoUrl} /></div><div><p className="form-doctor-name">Dr {personName(doctor)}</p><p className="form-doctor-specialty"><Stethoscope size={13} />{doctor.specialtyLabel}</p></div></div>
    {slots.loading && <LoadingState label="Vérification du créneau…" />}{slots.error && <ErrorState message={slots.error} onRetry={slots.reload} />}
    {!slots.loading && slots.data && !slot && <AuthNotice error>Ce créneau n’est plus disponible. Sélectionnez-en un autre sur la fiche du médecin.</AuthNotice>}
    <Link className="back-link" to={'/medecins/' + doctor.id}>Changer de créneau</Link>
    {slot && <div className="form-slot-card"><p className="form-slot-line"><Calendar size={15} />{formatDate(slot.startsAt, doctor.timezone)}</p><p className="form-slot-line"><Clock size={15} />{formatTime(slot.startsAt, doctor.timezone)} — {formatTime(slot.endsAt, doctor.timezone)}</p><p className="form-slot-line"><MapPin size={15} />{[doctor.address, doctor.city].filter(Boolean).join(', ')}</p></div>}
    <section className="request-info"><div className="section-heading"><h2>Vos informations</h2><Link to="/profil/informations">Modifier</Link></div><p>{personName(account.user)}</p>{account.user.phone && <p>{account.user.phone}</p>}<p>{account.user.email}</p></section>
    <form className="form-fields" onSubmit={send}><div className="form-field"><label htmlFor="motif">Motif (facultatif)</label><textarea id="motif" rows={3} maxLength={1000} value={reason} onChange={event => setReason(event.target.value)} placeholder="Ex. : bilan de santé, renouvellement d’ordonnance…" /><p className="field-hint">{reason.length} / 1000 caractères</p></div>{error && <AuthNotice error>{error}</AuthNotice>}
      <AuthButton type="submit" disabled={busy || slots.loading || Boolean(slots.error) || !slot}>{busy ? 'Envoi en cours…' : 'Demander le rendez-vous'}</AuthButton>
      <p className="form-hint">Votre demande reste en attente jusqu’à la décision du médecin.</p>
    </form>
  </section>;
}
export default function NouvelleDemande() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const doctor = useResource('/doctors/' + id);
  const date = params.get('date');
  const validDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date);
  return <><PageHeader />{doctor.loading && <LoadingState />}{doctor.error && <ErrorState message={doctor.error} onRetry={doctor.reload} />}
    {doctor.data?.doctor && (params.get('slot') && validDate ? <RequestForm key={id + params.toString()} doctor={doctorForView(doctor.data.doctor)} slotId={params.get('slot')} date={date} /> : <section className="form-section"><AuthNotice error>Aucun créneau sélectionné.</AuthNotice><Link to={'/medecins/' + id}>Retour à la fiche du médecin</Link></section>)}
  </>;
}
