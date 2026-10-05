// src/pages/MedecinDetail.jsx
// Fiche médecin + créneaux disponibles (issue #8).

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Stethoscope, UserRound, Clock, Building2 } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader.jsx';
import { DateStrip } from '@/components/DateStrip.jsx';
import { SlotPicker } from '@/components/SlotPicker.jsx';
import { LoadingState, ErrorState, EmptyState } from '@/components/States.jsx';
import { AuthButton } from '@/components/AuthUI.jsx';
import { getDoctorById, getDoctorSlots } from '@/lib/doctors.js';

export default function MedecinDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    Promise.all([getDoctorById(id), getDoctorSlots(id)])
      .then(([doctorData, slotsData]) => {
        if (cancelled) return;
        if (!doctorData) {
          setError('Médecin introuvable.');
          setDoctor(null);
          setSlots([]);
          return;
        }
        setDoctor(doctorData);
        setSlots(slotsData);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Une erreur est survenue.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  function handleDateChange(date) {
    setSelectedDate(date);
    setSelectedSlot(null);
  }

 function handleConfirm() {
  if (!selectedSlot) return;
  navigate(`/medecins/${id}/demander`, {
    state: { slot: selectedSlot },
  });
}

  return (
    <>
      <PageHeader showActions />

      {loading && <LoadingState label="Chargement du profil…" />}

      {!loading && error && (
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      )}

      {!loading && !error && doctor && (
        <>
          {/* Profil médecin */}
          <section className="doctor-profile">
            <div className="doctor-profile-avatar" aria-hidden="true">
              {doctor.photoUrl ? (
                <img src={doctor.photoUrl} alt="" />
              ) : (
                <UserRound size={40} />
              )}
            </div>
            <h1 className="doctor-profile-name">
              Dr {doctor.firstName} {doctor.lastName}
            </h1>
            <p className="doctor-profile-specialty">
              <Stethoscope size={16} aria-hidden="true" />
              {doctor.specialtyLabel}
            </p>
            <p className="doctor-profile-address">
              <MapPin size={16} aria-hidden="true" />
              {doctor.address}, {doctor.city}
            </p>
            <p className="doctor-profile-duration">
              <Clock size={16} aria-hidden="true" />
              Durée de consultation : {doctor.consultationDuration} min
            </p>
          </section>

          {/* Choix de la date */}
          <section className="doctor-section">
            <h2 className="doctor-section-title">Choisir une date</h2>
            <DateStrip selectedDate={selectedDate} onChange={handleDateChange} />
          </section>

          {/* Créneaux disponibles */}
          <section className="doctor-section">
            <h2 className="doctor-section-title">Créneaux disponibles</h2>
            <SlotPicker
              slots={slots}
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              onSelect={setSelectedSlot}
            />
          </section>

          {/* Bouton de confirmation */}
          {selectedSlot && (
            <div className="doctor-confirm">
                <AuthButton onClick={handleConfirm}>
                  Demander le rendez-vous
                </AuthButton>
            </div>
          )}

        </>
      )}
    </>
  );
}