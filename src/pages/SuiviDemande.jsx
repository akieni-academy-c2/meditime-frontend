// src/pages/SuiviDemande.jsx
// Suivi d'une demande par code + téléphone (issue #9, RG-14).

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, Search } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge.jsx';
import { AuthButton, AuthNotice } from '@/components/AuthUI.jsx';
import { getAppointmentByCode } from '@/lib/appointments.js';

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

function getStatusMessage(status) {
  switch (status) {
    case 'EN_ATTENTE':
      return 'Le médecin n’a pas encore répondu. Ce n’est pas encore un rendez-vous confirmé.';
    case 'CONFIRMEE':
      return 'Votre rendez-vous est confirmé.';
    case 'REFUSEE':
      return 'Votre demande a été refusée par le médecin.';
    case 'ANNULEE':
      return 'Cette demande a été annulée.';
    case 'PASSE':
      return 'Ce rendez-vous est passé.';
    default:
      return '';
  }
}

export default function SuiviDemande() {
  const { code: codeFromUrl } = useParams();

  const [code, setCode] = useState(codeFromUrl || '');
  const [phone, setPhone] = useState('');
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(event) {
    event.preventDefault();
    setError('');
    setAppointment(null);

    if (!code.trim() || !phone.trim()) {
      setError('Code et téléphone sont obligatoires.');
      return;
    }

    setLoading(true);
    try {
      const result = await getAppointmentByCode(code, phone);
      if (!result) {
        setError('Code ou numéro de téléphone incorrect.');
      } else {
        setAppointment(result);
      }
    } catch (err) {
      setError(err?.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1>Suivre ma demande</h1>
      <p className="page-intro">
        Saisissez votre code de suivi et votre numéro de téléphone.
      </p>

      {/* Formulaire de recherche */}
      <form className="form-fields" onSubmit={handleSearch} noValidate>
        <div className="form-field">
          <label htmlFor="code">Code de suivi</label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="A7K2M9X4"
            maxLength={8}
            autoComplete="off"
          />
        </div>

        <div className="form-field">
          <label htmlFor="phone">Téléphone</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="06 12 34 56 78"
            autoComplete="tel"
          />
        </div>

        {error && <AuthNotice error>{error}</AuthNotice>}

        <AuthButton type="submit" disabled={loading}>
          <Search size={18} aria-hidden="true" />
          {loading ? 'Recherche…' : 'Rechercher ma demande'}
        </AuthButton>
      </form>

      {/* Résultat */}
      {appointment && (
        <section className="suivi-result">
          <div className="suivi-header">
            <p className="suivi-doctor">{appointment.doctorName}</p>
            <StatusBadge status={appointment.status} />
          </div>

          <p className="suivi-specialty">{appointment.doctorSpecialty}</p>

          <div className="suivi-info">
            <p className="suivi-line">
              <Calendar size={15} aria-hidden="true" />
              {formatDateLong(appointment.startAt)}
            </p>
            <p className="suivi-line">
              <Clock size={15} aria-hidden="true" />
              {formatTime(appointment.startAt)} — {formatTime(appointment.endAt)}
            </p>
            <p className="suivi-line">
              <MapPin size={15} aria-hidden="true" />
              {appointment.address}, {appointment.city}
            </p>
          </div>

          <AuthNotice>{getStatusMessage(appointment.status)}</AuthNotice>
        </section>
      )}
    </>
  );
}