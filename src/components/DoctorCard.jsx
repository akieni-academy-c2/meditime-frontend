import { PersonCard } from './CardsUI.jsx';
import { formatDate, formatTime, personName } from '../lib/dates.js';

export default function DoctorCard({ doctor, onClick }) {
  const next = doctor.nextAvailableSlot;
  return <PersonCard name={`Dr ${personName(doctor.user)}`} avatarUrl={doctor.user?.avatarUrl} subtitle={doctor.specialty?.name} onClick={onClick}>
    <p>{doctor.practiceName} · {doctor.city}</p>
    {next && <span className="next-available">Prochaine disponibilité : {formatDate(next.startsAt, doctor.timezone)} à {formatTime(next.startsAt, doctor.timezone)}</span>}
  </PersonCard>;
}
