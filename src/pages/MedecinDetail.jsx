import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Stethoscope, Clock } from 'lucide-react';
import { PageHeader } from '../components/PageHeader.jsx';
import { DateStrip } from '../components/DateStrip.jsx';
import { SlotPicker } from '../components/SlotPicker.jsx';
import { LoadingState, ErrorState } from '../components/States.jsx';
import { AuthButton } from '../components/AuthUI.jsx';
import PersonAvatar from '../components/PersonAvatar.jsx';
import { useResource } from '../lib/useResource.js';
import { doctorForView } from '../lib/doctors.js';
import { dateInZone, shiftDate } from '../lib/dates.js';

function DoctorContent({ doctor }) {
  const navigate = useNavigate();
  const [date, setDate] = useState(() => dateInZone(new Date(), doctor.timezone));
  const [slot, setSlot] = useState(null);
  const resource = useResource('/doctors/' + doctor.id + '/slots?' + new URLSearchParams({ from: date, to: shiftDate(date, 6) }));
  const selected = resource.data?.slots.find(item => item.id === slot?.id && item.status === 'available');
  return <>
    <section className="doctor-profile"><div className="doctor-profile-avatar"><PersonAvatar name={[doctor.firstName, doctor.lastName].join(' ')} avatarUrl={doctor.photoUrl} /></div>
      <h1 className="doctor-profile-name">Dr {doctor.firstName} {doctor.lastName}</h1>
      <p className="doctor-profile-specialty"><Stethoscope size={16} />{doctor.specialtyLabel}</p>
      {doctor.practiceName && <p className="doctor-profile-address">{doctor.practiceName}</p>}
      <p className="doctor-profile-address"><MapPin size={16} />{[doctor.address, doctor.city].filter(Boolean).join(', ')}</p>
      <p className="doctor-profile-duration"><Clock size={16} />Durée de consultation : {doctor.consultationDuration} min</p>
    </section>
    <section className="doctor-section"><h2 className="doctor-section-title">Choisir une date</h2><DateStrip selectedDate={date} onChange={value => { setDate(value); setSlot(null); }} timezone={doctor.timezone} /><p className="field-hint">Heures du cabinet : {doctor.timezone}</p></section>
    <section className="doctor-section"><h2 className="doctor-section-title">Créneaux disponibles</h2>
      {resource.loading && <LoadingState label="Chargement des créneaux…" />}
      {resource.error && <ErrorState message={resource.error} onRetry={resource.reload} />}
      {!resource.loading && resource.data && <SlotPicker slots={resource.data.slots} selectedDate={date} selectedSlot={selected} onSelect={setSlot} timezone={resource.data.timezone} />}
    </section>
    {selected && !resource.loading && !resource.error && <div className="doctor-confirm"><AuthButton onClick={() => navigate('/medecins/' + doctor.id + '/demander?' + new URLSearchParams({ slot: selected.id, date }))}>Demander le rendez-vous</AuthButton></div>}
  </>;
}
export default function MedecinDetail() {
  const { id } = useParams();
  const resource = useResource('/doctors/' + id);
  return <><PageHeader />{resource.loading && <LoadingState label="Chargement du profil…" />}{resource.error && <ErrorState message={resource.error} onRetry={resource.reload} />}{resource.data?.doctor && <DoctorContent key={id} doctor={doctorForView(resource.data.doctor)} />}</>;
}
