// src/pages/NouvelleDemande.jsx
// Formulaire de demande de rendez-vous (issue #9).

import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, UserRound, Stethoscope, ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader.jsx';
import { AuthButton, AuthNotice } from '@/components/AuthUI.jsx';
import { getDoctorById } from '@/lib/doctors.js';
import { createAppointment } from '@/lib/appointments.js';

function formatDateLong(isoDate) {
  return new Date(isoDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatTime(isoDate) {
  return new Date(isoDate).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function NouvelleDemande() {
  const { id: doctorId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Le créneau est transmis via l'état de navigation
  const slot = location.state?.slot || null;

  const [doctor, setDoctor] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    motif: '',
  });

  // Charger le médecin
  useEffect(() => {
    let cancelled = false;
    if (!doctorId) return;
    setLoadingDoctor(true);
    getDoctorById(doctorId)
      .then((data) => {
        if (!cancelled) setDoctor(data);
      })
      .catch(() => {
        if (!cancelled) setError('Impossible de charger le médecin.');
      })
      .finally(() => {
        if (!cancelled) setLoadingDoctor(false);
      });
    return () => {
      cancelled = true;
    };
  }, [doctorId]);

  // Si pas de créneau sélectionné → retour
  if (!slot) {
    return (
      <>
        <PageHeader />
        <section className="form-section">
          <AuthNotice error>
            Aucun créneau sélectionné. Revenez à la fiche du médecin.
          </AuthNotice>
          <Link to={`/medecins/${doctorId}`} className="back-link">
            <ArrowLeft size={16} aria-hidden="true" />
            Retour à la fiche du médecin
          </Link>
        </section>
      </>
    );
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    if (!form.firstName.trim()) return 'Le prénom est obligatoire.';
    if (!form.lastName.trim()) return 'Le nom est obligatoire.';
    if (!form.phone.trim()) return 'Le téléphone est obligatoire.';
    const cleanedPhone = form.phone.replace(/\s/g, '');
    if (!/^[0-9+\-() ]{8,}$/.test(cleanedPhone)) {
      return 'Numéro de téléphone invalide.';
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return 'Adresse email invalide.';
    }
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const appointment = await createAppointment({
        doctorId,
        doctorName: doctor ? `Dr ${doctor.firstName} ${doctor.lastName}` : 'Médecin',
        doctorSpecialty: doctor?.specialtyLabel || '',
        startAt: slot.startAt,
        endAt: slot.endAt,
        duration: slot.duration || doctor?.consultationDuration || 30,
        address: doctor?.address || '',
        city: doctor?.city || '',
        patient: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
        },
        motif: form.motif.trim(),
      });

      // Redirection vers la page de confirmation
      navigate(`/rendez-vous/confirmation/${appointment.code}`, {
        state: { appointment },
        replace: true,
      });
    } catch (err) {
      setError(err?.message || "L'envoi a échoué. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader />

      <section className="form-section">
        <h1 className="form-title">Demander un rendez-vous</h1>

        {/* Récap du médecin */}
        {loadingDoctor && <p className="form-hint">Chargement…</p>}
        {!loadingDoctor && doctor && (
          <div className="form-doctor-card">
            <div className="form-doctor-avatar" aria-hidden="true">
              {doctor.photoUrl ? (
                <img src={doctor.photoUrl} alt="" />
              ) : (
                <UserRound size={28} />
              )}
            </div>
            <div>
              <p className="form-doctor-name">
                Dr {doctor.firstName} {doctor.lastName}
              </p>
              <p className="form-doctor-specialty">
                <Stethoscope size={13} aria-hidden="true" />
                {doctor.specialtyLabel}
              </p>
            </div>
          </div>
        )}

        {/* Récap du créneau */}
        <div className="form-slot-card">
          <p className="form-slot-line">
            <Calendar size={15} aria-hidden="true" />
            {formatDateLong(slot.startAt)}
          </p>
          <p className="form-slot-line">
            <Clock size={15} aria-hidden="true" />
            {formatTime(slot.startAt)} — {formatTime(slot.endAt)}
          </p>
          {doctor && (
            <p className="form-slot-line">
              <MapPin size={15} aria-hidden="true" />
              {doctor.address}, {doctor.city}
            </p>
          )}
        </div>

        {/* Formulaire */}
        <form className="form-fields" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="firstName">Prénom *</label>
            <input
              id="firstName"
              type="text"
              value={form.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              required
              autoComplete="given-name"
            />
          </div>

          <div className="form-field">
            <label htmlFor="lastName">Nom *</label>
            <input
              id="lastName"
              type="text"
              value={form.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              required
              autoComplete="family-name"
            />
          </div>

          <div className="form-field">
            <label htmlFor="phone">Téléphone *</label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              required
              autoComplete="tel"
              placeholder="06 12 34 56 78"
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email (facultatif)</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              autoComplete="email"
              placeholder="vous@email.com"
            />
          </div>

          <div className="form-field">
            <label htmlFor="motif">Motif (facultatif)</label>
            <textarea
              id="motif"
              rows={3}
              value={form.motif}
              onChange={(e) => updateField('motif', e.target.value)}
              placeholder="Ex : bilan de santé, renouvellement d'ordonnance…"
            />
          </div>

          {error && <AuthNotice error>{error}</AuthNotice>}

          <AuthButton type="submit" disabled={submitting}>
            {submitting ? 'Envoi en cours…' : 'Demander le rendez-vous'}
          </AuthButton>

          <p className="form-hint">
            ⚠️ Votre demande sera **en attente** — elle ne sera confirmée qu'après
            décision du médecin.
          </p>
        </form>
      </section>
    </>
  );
}