import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { PersonCard } from './CardsUI.jsx';
import { formatCompactDate, formatTime, personName } from '../lib/dates.js';

export default function AppointmentCard({ appointment, doctorView = false, onClick, showReason = true }) {
  const { slot, patient } = appointment;
  const doctor = slot.doctor;
  const person = doctorView ? patient : doctor.user;
  return <PersonCard name={`${doctorView ? '' : 'Dr '}${personName(person)}`} avatarUrl={person.avatarUrl} subtitle={doctorView ? null : doctor.specialty.name} status={appointment.isPast && appointment.status === 'confirmed' ? 'past' : appointment.status} onClick={onClick}>
    <div className="appointment-facts"><p><CalendarDays />{formatCompactDate(slot.startsAt, doctor.timezone)}</p><p><Clock />{formatTime(slot.startsAt, doctor.timezone)}</p>{!doctorView && <p><MapPin />{doctor.practiceName}</p>}</div>
    {doctorView && showReason && appointment.reason && <p className="reason-preview">{appointment.reason}</p>}
  </PersonCard>;
}
