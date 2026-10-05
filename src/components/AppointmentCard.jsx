import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { PersonCard } from './CardsUI.jsx';
import { formatDate, formatTime, personName } from '../lib/dates.js';

export default function AppointmentCard({ appointment, doctorView = false, onClick }) {
  const { slot, patient } = appointment;
  const doctor = slot.doctor;
  const person = doctorView ? patient : doctor.user;
  return <PersonCard name={`${doctorView ? '' : 'Dr '}${personName(person)}`} avatarUrl={person.avatarUrl} subtitle={doctorView ? appointment.reason || 'Motif non renseigné' : doctor.specialty.name} status={appointment.isPast && appointment.status === 'confirmed' ? 'past' : appointment.status} onClick={onClick}>
    <div className="appointment-facts"><p><CalendarDays />{formatDate(slot.startsAt, doctor.timezone)}</p><p><Clock />{formatTime(slot.startsAt, doctor.timezone)}</p><p><MapPin />{doctor.practiceName}</p></div>
  </PersonCard>;
}
