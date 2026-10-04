// src/pages/Confirmation.jsx
// Page de confirmation après envoi d'une demande (issue #9).

import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { Calendar, CheckCircle2, Clock, MapPin, FileText } from 'lucide-react';
import { AuthButton } from '@/components/AuthUI.jsx';

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

export default function Confirmation() {
  const { code } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const appointment = location.state?.appointment;

  // Si on arrive sans les données → invite à aller sur la liste
  if (!appointment) {
    return (
      <section className="form-section">
        <h1 className="form-title">Demande envoyée</h1>
        <p className="form-hint">
          Votre demande a bien été enregistrée. Consultez la liste de vos
          rendez-vous pour suivre son statut.
        </p>
        <AuthButton onClick={() => navigate('/rendez-vous')}>
          Voir mes rendez-vous
        </AuthButton>
      </section>
    );
  }

  return (
    <section className="confirmation-section">
      {/* Icône de succès */}
      <div className="confirmation-symbol" aria-hidden="true">
        <CheckCircle2 size={48} />
      </div>

      <h1 className="confirmation-title">Demande envoyée !</h1>

      <p className="confirmation-text">
        Votre demande de rendez-vous a bien été envoyée au{' '}
        <strong>{appointment.doctorName}</strong>.
      </p>

      <p className="confirmation-text confirmation-text-muted">
        Vous recevrez une notification dès qu'elle sera confirmée.
      </p>

      {/* Récapitulatif */}
      <div className="confirmation-card">
        <h2 className="confirmation-card-title">Récapitulatif de la demande</h2>

        <p className="confirmation-card-doctor">
          {appointment.doctorName}
        </p>
        <p className="confirmation-card-specialty">
          {appointment.doctorSpecialty}
        </p>

        <div className="confirmation-info">
          <p className="confirmation-line">
            <Calendar size={15} aria-hidden="true" />
            {formatDateLong(appointment.startAt)}
          </p>
          <p className="confirmation-line">
            <Clock size={15} aria-hidden="true" />
            {formatTime(appointment.startAt)} — {formatTime(appointment.endAt)}
          </p>
          <p className="confirmation-line">
            <MapPin size={15} aria-hidden="true" />
            {appointment.address}, {appointment.city}
          </p>
          {appointment.motif && (
            <p className="confirmation-line">
              <FileText size={15} aria-hidden="true" />
              Motif : {appointment.motif}
            </p>
          )}
        </div>

        <div className="confirmation-code">
          <p className="confirmation-code-label">Votre code de suivi</p>
          <p className="confirmation-code-value">{code}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="confirmation-actions">
        <AuthButton onClick={() => navigate('/rendez-vous')}>
          Voir mes rendez-vous
        </AuthButton>
        <AuthButton variant="outline" onClick={() => navigate('/accueil')}>
          Retour à l'accueil
        </AuthButton>
      </div>

      <p className="confirmation-note">
        Conservez votre code de suivi : il vous permet de consulter l'état de
        votre demande sans compte.
      </p>
    </section>
  );
}