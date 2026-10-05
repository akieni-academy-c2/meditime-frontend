// src/pages/MesRendezVous.jsx
// Liste des demandes de rendez-vous du patient (issue #9).

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge.jsx';
import { LoadingState, EmptyState, ErrorState } from '@/components/States.jsx';
import { listAppointments } from '@/lib/appointments.js';

// Onglets : valeur interne = statuts correspondants
const TABS = [
  { key: 'EN_ATTENTE', label: 'En attente', statuses: ['EN_ATTENTE'] },
  { key: 'CONFIRMEE', label: 'Confirmés', statuses: ['CONFIRMEE'] },
  { key: 'REFUSEE', label: 'Déclinés', statuses: ['REFUSEE', 'ANNULEE'] },
  { key: 'PASSE', label: 'Passés', statuses: ['PASSE'] },
];

function formatDateShort(isoDate) {
  return new Date(isoDate).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(isoDate) {
  return new Date(isoDate).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MesRendezVous() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('EN_ATTENTE');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    listAppointments()
      .then((data) => {
        if (!cancelled) setAppointments(data);
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
  }, []);

  // Compte par onglet
  const counts = useMemo(() => {
    const result = {};
    TABS.forEach((tab) => {
      result[tab.key] = appointments.filter((apt) =>
        tab.statuses.includes(apt.status)
      ).length;
    });
    return result;
  }, [appointments]);

  // Filtre selon l'onglet actif
  const visible = useMemo(() => {
    const tab = TABS.find((t) => t.key === activeTab);
    if (!tab) return [];
    return appointments
      .filter((apt) => tab.statuses.includes(apt.status))
      .sort((a, b) => new Date(b.startAt) - new Date(a.startAt));
  }, [appointments, activeTab]);

  return (
    <>
      <h1>Mes rendez-vous</h1>
      <p className="page-intro">
        Retrouvez ici vos demandes et leur statut.
      </p>

      {/* Onglets */}
      <div className="tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            className="tab-button"
            data-active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label} ({counts[tab.key]})
          </button>
        ))}
      </div>

      {/* États */}
      {loading && <LoadingState label="Chargement de vos rendez-vous…" />}

      {!loading && error && (
        <ErrorState
          message={error}
          onRetry={() => window.location.reload()}
        />
      )}

      {!loading && !error && visible.length === 0 && (
        <EmptyState
          title="Aucun rendez-vous ici"
          description="Vos demandes apparaîtront dans cet onglet une fois créées."
        />
      )}

      {/* Liste */}
      {!loading && !error && visible.length > 0 && (
        <ul className="appointment-list">
          {visible.map((apt) => (
            <li key={apt.id}>
              <Link
                to={`/rendez-vous/suivi/${apt.code}`}
                className="appointment-card"
              >
                <div className="appointment-card-header">
                  <p className="appointment-doctor">{apt.doctorName}</p>
                  <StatusBadge status={apt.status} />
                </div>
                <p className="appointment-specialty">{apt.doctorSpecialty}</p>
                <p className="appointment-line">
                  <Calendar size={14} aria-hidden="true" />
                  {formatDateShort(apt.startAt)}
                </p>
                <p className="appointment-line">
                  <Clock size={14} aria-hidden="true" />
                  {formatTime(apt.startAt)}
                </p>
                <p className="appointment-line">
                  <MapPin size={14} aria-hidden="true" />
                  {apt.address}, {apt.city}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}