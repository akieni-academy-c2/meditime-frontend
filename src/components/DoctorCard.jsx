import { Link } from 'react-router-dom';
import { ChevronRight, MapPin } from 'lucide-react';
import PersonAvatar from './PersonAvatar.jsx';
import { doctorForView } from '../lib/doctors.js';
import { formatCompactDate, formatTime } from '../lib/dates.js';
export function DoctorCard({ doctor, onClick }) {
  const view = doctorForView(doctor);
  const next = view.nextAvailableAt;
  const contents = <><div className="doctor-card-avatar"><PersonAvatar name={[view.firstName, view.lastName].filter(Boolean).join(' ')} avatarUrl={view.photoUrl} /></div>
    <div className="doctor-card-body"><p className="doctor-card-name">Dr {view.firstName} {view.lastName}</p>
      <p className="doctor-card-specialty">{view.specialtyLabel}</p>
      {view.city && <p className="doctor-card-city"><MapPin size={13} aria-hidden="true" />{view.city}</p>}
      {next && <p className="doctor-card-availability">Prochaine dispo : {formatCompactDate(next, view.timezone)} à {formatTime(next, view.timezone)}</p>}
    </div><ChevronRight className="doctor-card-chevron" size={18} aria-hidden="true" /></>;
  if (onClick) return <button type="button" className="doctor-card" onClick={onClick}>{contents}</button>;
  return <Link to={'/medecins/' + view.id} className="doctor-card">{contents}</Link>;
}
export default DoctorCard;
