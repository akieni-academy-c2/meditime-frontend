// src/components/DoctorCard.jsx
// Carte d'un médecin dans une liste (recherche, home, etc.)

import { Link } from 'react-router-dom';
import { MapPin, Stethoscope, UserRound } from 'lucide-react';

function formatNextAvailability(isoDate) {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const time = date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return isToday ? `Disponible aujourd'hui à ${time}` : `Prochaine dispo : ${time}`;
}

export function DoctorCard({ doctor }) {
  const nextLabel = formatNextAvailability(doctor.nextAvailableAt);

  return (
    <Link to={`/medecins/${doctor.id}`} className="doctor-card">
      <div className="doctor-card-avatar" aria-hidden="true">
        {doctor.photoUrl ? (
          <img src={doctor.photoUrl} alt="" />
        ) : (
          <UserRound size={28} />
        )}
      </div>

      <div className="doctor-card-body">
        <p className="doctor-card-name">
          Dr {doctor.firstName} {doctor.lastName}
        </p>
        <p className="doctor-card-specialty">
          <Stethoscope size={14} aria-hidden="true" />
          {doctor.specialtyLabel}
        </p>
        <p className="doctor-card-city">
          <MapPin size={14} aria-hidden="true" />
          {doctor.city}
        </p>
        {nextLabel && <p className="doctor-card-availability">{nextLabel}</p>}
      </div>
    </Link>
  );
}