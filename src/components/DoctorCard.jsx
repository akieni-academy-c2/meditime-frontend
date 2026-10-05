import { Link } from 'react-router-dom';
import { MapPin, Stethoscope } from 'lucide-react';
import PersonAvatar from './PersonAvatar.jsx';
import { doctorForView } from '../lib/doctors.js';
import { formatDate, formatTime } from '../lib/dates.js';
export function DoctorCard({ doctor, onClick }) {
  const view = doctorForView(doctor);
  const next = view.nextAvailableAt;
  const contents = <><div className="doctor-card-avatar"><PersonAvatar name={[view.firstName, view.lastName].filter(Boolean).join(' ')} avatarUrl={view.photoUrl} /></div>
    <div className="doctor-card-body"><p className="doctor-card-name">Dr {view.firstName} {view.lastName}</p>
      <p className="doctor-card-specialty"><Stethoscope size={14} aria-hidden="true" />{view.specialtyLabel}</p>
      <p className="doctor-card-city"><MapPin size={14} aria-hidden="true" />{view.practiceName ? view.practiceName + ' · ' : ''}{view.city}</p>
      {next && <p className="doctor-card-availability">Prochaine disponibilité : {formatDate(next, view.timezone)} à {formatTime(next, view.timezone)}</p>}
    </div></>;
  if (onClick) return <button type="button" className="doctor-card" onClick={onClick}>{contents}</button>;
  return <Link to={'/medecins/' + view.id} className="doctor-card">{contents}</Link>;
}
export default DoctorCard;
