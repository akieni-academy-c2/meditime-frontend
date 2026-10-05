import { useState } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, UserRound } from 'lucide-react';
import { PageHeader } from '../components/PageHeader.jsx';
import { AuthButton, AuthNotice } from '../components/AuthUI.jsx';
import { LoadingState, ErrorState } from '../components/States.jsx';
import { DateStrip } from '../components/DateStrip.jsx';
import { SlotPicker } from '../components/SlotPicker.jsx';
import BottomSheet from '../components/BottomSheet.jsx';
import ProfileForm from './ProfileForm.jsx';
import PersonAvatar from '../components/PersonAvatar.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import { useResource } from '../lib/useResource.js';
import { createAppointment } from '../lib/appointments.js';
import { doctorForView } from '../lib/doctors.js';
import { dateInZone, personName, shiftDate } from '../lib/dates.js';

function RequestForm({ doctor, slotId, date }) {
  const { account, notifyDataChanged } = useAuth();
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileBusy, setProfileBusy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(date || dateInZone(new Date(), doctor.timezone));
  const [selectedId, setSelectedId] = useState(slotId);
  const lastDate = shiftDate(dateInZone(new Date(), doctor.timezone), 55);
  const slots = useResource('/doctors/' + doctor.id + '/slots?' + new URLSearchParams({ from: selectedDate, to: shiftDate(selectedDate, 6) > lastDate ? lastDate : shiftDate(selectedDate, 6) }));
  const slot = slots.data?.slots.find(item => item.id === selectedId && item.status === 'available' && dateInZone(item.startsAt, doctor.timezone) === selectedDate);
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
  return <section className="form-section request-form">
    <div className="form-doctor-card"><div className="form-doctor-identity"><div className="form-doctor-avatar"><PersonAvatar name={personName(doctor)} avatarUrl={doctor.photoUrl} /></div><div><p className="form-doctor-name">Dr {personName(doctor)}</p><p className="form-doctor-specialty">{doctor.specialtyLabel}</p></div></div><p className="form-slot-line"><MapPin size={18} /><span>{doctor.practiceName}<small>{[doctor.address, doctor.city].filter(Boolean).join(', ')}</small></span></p></div>
    <h2 className="subheading">Choisir un créneau</h2><DateStrip selectedDate={selectedDate} timezone={doctor.timezone} onChange={value => { setSelectedDate(value); setSelectedId(null); setError(''); }} />
    {slots.loading && <LoadingState layout="slots" />}{slots.error && <ErrorState message={slots.error} onRetry={slots.reload} />}
    {!slots.loading && slots.data && selectedId && !slot && <AuthNotice error>Ce créneau n’est plus disponible. Choisissez-en un autre.</AuthNotice>}
    {!slots.loading && slots.data && <SlotPicker slots={slots.data.slots} selectedDate={selectedDate} selectedSlot={slot} onSelect={value => setSelectedId(value.id)} timezone={doctor.timezone} />}
    <section className="request-information"><div className="section-heading"><h2>Vos informations</h2><button type="button" className="section-action" onClick={() => setProfileOpen(true)}>Modifier</button></div><div className="request-contact"><p><UserRound />{personName(account.user)}</p>{account.user.phone && <p><Phone />{account.user.phone}</p>}<p><Mail />{account.user.email}</p></div></section>
    <BottomSheet className="business-sheet profile-edit-sheet" open={profileOpen} onOpenChange={value => { if (!profileBusy) setProfileOpen(value); }} title="Vos informations"><ProfileForm embedded onSaved={() => setProfileOpen(false)} onBusyChange={setProfileBusy} /></BottomSheet>
    <form className="form-fields" onSubmit={send}><div className="form-field"><label htmlFor="motif">Motif <span>(facultatif)</span></label><textarea id="motif" rows={2} maxLength={1000} value={reason} onChange={event => setReason(event.target.value)} placeholder="Ex. : bilan de santé, renouvellement d’ordonnance…" /></div>{error && <AuthNotice error>{error}</AuthNotice>}
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
  return <><PageHeader title="Demander un rendez-vous" fallback={'/medecins/' + id} />{doctor.loading && <LoadingState />}{doctor.error && <ErrorState message={doctor.error} onRetry={doctor.reload} />}
    {doctor.data?.doctor && (params.get('slot') && validDate ? <RequestForm key={id + params.toString()} doctor={doctorForView(doctor.data.doctor)} slotId={params.get('slot')} date={date} /> : <section className="form-section"><AuthNotice error>Aucun créneau sélectionné.</AuthNotice><Link to={'/medecins/' + id}>Retour à la fiche du médecin</Link></section>)}
  </>;
}
