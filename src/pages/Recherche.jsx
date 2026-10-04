// src/pages/Recherche.jsx
// Page de recherche des médecins (issue #7).

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '@/components/SearchBar.jsx';
import { DoctorCard } from '@/components/DoctorCard.jsx';
import { LoadingState, EmptyState, ErrorState } from '@/components/States.jsx';
import { getSpecialties, searchDoctors } from '@/lib/doctors.js';

export default function Recherche() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [name, setName] = useState(searchParams.get('name') || '');
  const [specialty, setSpecialty] = useState(searchParams.get('specialty') || '');

  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Charger les spécialités une seule fois
  useEffect(() => {
    let cancelled = false;
    getSpecialties()
      .then((data) => {
        if (!cancelled) setSpecialties(data);
      })
      .catch(() => {
        if (!cancelled) setSpecialties([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Rechercher les médecins à chaque changement de filtre
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    // Sync URL
    const params = new URLSearchParams();
    if (name) params.set('name', name);
    if (specialty) params.set('specialty', specialty);
    setSearchParams(params, { replace: true });

    searchDoctors({ name, specialty })
      .then((data) => {
        if (!cancelled) setDoctors(data);
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
  }, [name, specialty, setSearchParams]);

  function retry() {
    setError('');
    setLoading(true);
    searchDoctors({ name, specialty })
      .then(setDoctors)
      .catch((err) => setError(err?.message || 'Une erreur est survenue.'))
      .finally(() => setLoading(false));
  }

  return (
    <>
      <h1>Rechercher un médecin</h1>
      <p className="page-intro">
        Trouvez un professionnel adapté à votre besoin.
      </p>

      <SearchBar value={name} onChange={setName} />

      <div className="filter-row">
        <label htmlFor="specialty-filter" className="sr-only">
          Filtrer par spécialité
        </label>
        <select
          id="specialty-filter"
          className="filter-select"
          value={specialty}
          onChange={(event) => setSpecialty(event.target.value)}
        >
          <option value="">Toutes les spécialités</option>
          {specialties.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <section className="results" aria-live="polite">
        {loading && <LoadingState label="Recherche des médecins…" />}

        {!loading && error && (
          <ErrorState message={error} onRetry={retry} />
        )}

        {!loading && !error && doctors.length === 0 && (
          <EmptyState
            title="Aucun médecin trouvé"
            description="Essayez avec un autre nom ou une autre spécialité."
          />
        )}

        {!loading && !error && doctors.length > 0 && (
          <>
            <p className="results-count">
              {doctors.length} médecin{doctors.length > 1 ? 's' : ''} trouvé
              {doctors.length > 1 ? 's' : ''}
            </p>
            <ul className="doctor-list">
              {doctors.map((doctor) => (
                <li key={doctor.id}>
                  <DoctorCard doctor={doctor} />
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  );
}