import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
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
  const lastDate = shiftDate(dateInZone(new Date(), doctor.timezone), 55);
  const resource = useResource('/doctors/' + doctor.id + '/slots?' + new URLSearchParams({ from: date, to: shiftDate(date, 6) > lastDate ? lastDate : shiftDate(date, 6) }));
  const selected = resource.data?.slots.find(item => item.id === slot?.id && item.status === 'available');
  return <>
    <section className="doctor-profile"><div className="doctor-identity"><div className="doctor-profile-avatar"><PersonAvatar name={[doctor.firstName, doctor.lastName].join(' ')} avatarUrl={doctor.photoUrl} /></div><div>
      <h1 className="doctor-profile-name">Dr {doctor.firstName} {doctor.lastName}</h1>
      <p className="doctor-profile-specialty">{doctor.specialtyLabel}</p></div></div>
      <div className="doctor-facts"><p><MapPin /><span>{doctor.practiceName}<small>{[doctor.address, doctor.city].filter(Boolean).join(', ')}</small></span></p><p><Clock /><span>Durée de consultation<small>{doctor.consultationDuration} minutes</small></span></p></div>
    </section>
    <section className="doctor-section"><h2 className="doctor-section-title">Choisir une date</h2><DateStrip selectedDate={date} onChange={value => { setDate(value); setSlot(null); }} timezone={doctor.timezone} /><p className="field-hint">Heures du cabinet : {doctor.timezone}</p></section>
    <section className="doctor-section"><h2 className="doctor-section-title">Créneaux disponibles</h2>
      {resource.loading && <LoadingState layout="slots" />}
      {resource.error && <ErrorState message={resource.error} onRetry={resource.reload} />}
      {!resource.loading && resource.data && <SlotPicker slots={resource.data.slots} selectedDate={date} selectedSlot={selected} onSelect={setSlot} timezone={resource.data.timezone} />}
    </section>
    <div className="doctor-confirm"><AuthButton disabled={!selected || resource.loading || Boolean(resource.error)} onClick={() => navigate('/medecins/' + doctor.id + '/demander?' + new URLSearchParams({ slot: selected.id, date }))}>Demander le rendez-vous</AuthButton></div>
  </>;
}
export default function MedecinDetail() {
  const { id } = useParams();
  const resource = useResource('/doctors/' + id);
  return <><PageHeader />{resource.loading && <LoadingState layout="profile" />}{resource.error && <ErrorState message={resource.error} onRetry={resource.reload} />}{resource.data?.doctor && <DoctorContent key={id} doctor={doctorForView(resource.data.doctor)} />}</>;
}
