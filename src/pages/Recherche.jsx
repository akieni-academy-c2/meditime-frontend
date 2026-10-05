import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar.jsx';
import { DoctorCard } from '../components/DoctorCard.jsx';
import { LoadingState, EmptyState, ErrorState } from '../components/States.jsx';
import Pagination from '../components/Pagination.jsx';
import { AuthButton } from '../components/AuthUI.jsx';
import { useResource } from '../lib/useResource.js';
import { searchDoctors } from '../lib/doctors.js';

export default function Recherche() {
  const [params, setParams] = useSearchParams();
  const query = params.toString();
  const [name, setName] = useState(params.get('q') || '');
  const [city, setCity] = useState(params.get('city') || '');
  const [result, setResult] = useState({ query: null, loading: true, error: '', data: null });
  const [revision, setRevision] = useState(0);
  const specialties = useResource('/specialties');
  const specialtyId = params.get('specialtyId') || '';
  const page = Math.max(1, Number(params.get('page')) || 1);
  useEffect(() => { setName(params.get('q') || ''); setCity(params.get('city') || ''); }, [query]);
  useEffect(() => {
    const controller = new AbortController();
    setResult({ query, loading: true, error: '', data: null });
    searchDoctors({ name: params.get('q') || '', city: params.get('city') || '', specialtyId, page, signal: controller.signal })
      .then(data => { if (!controller.signal.aborted) setResult({ query, loading: false, error: '', data }); })
      .catch(error => { if (!controller.signal.aborted) setResult({ query, loading: false, error: error.message, data: null }); });
    return () => controller.abort();
  }, [query, revision]);
  function updateFilter(key, value) {
    const next = new URLSearchParams(params); next.delete('page');
    if (value) next.set(key, value); else next.delete(key);
    setParams(next);
  }
  function submit(event) {
    event.preventDefault();
    const next = new URLSearchParams(params); next.delete('page');
    for (const [key, value] of [['q', name.trim()], ['city', city.trim()]]) {
      if (value) next.set(key, value); else next.delete(key);
    }
    setParams(next);
  }
  const current = result.query === query ? result : { loading: true, data: null, error: '' };
  return <><h1>Rechercher un médecin</h1><p className="page-intro">Trouvez un professionnel adapté à votre besoin.</p>
    <form onSubmit={submit}><SearchBar value={name} onChange={setName} />
      <div className="filter-row"><label htmlFor="specialty-filter" className="sr-only">Filtrer par spécialité</label>
        <select id="specialty-filter" className="filter-select" value={specialtyId} onChange={event => updateFilter('specialtyId', event.target.value)}>
          <option value="">Toutes les spécialités</option>{specialties.data?.specialties.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </div><div className="form-field"><label htmlFor="city-filter">Ville</label><input id="city-filter" value={city} maxLength={100} onChange={event => setCity(event.target.value)} /></div><AuthButton type="submit">Rechercher</AuthButton>
    </form>
    {specialties.error && <ErrorState message={specialties.error} onRetry={specialties.reload} />}
    <section className="results" aria-live="polite">{current.loading && <LoadingState label="Recherche des médecins…" />}
      {current.error && <ErrorState message={current.error} onRetry={() => setRevision(value => value + 1)} />}
      {current.data && <><p className="results-count">{current.data.pagination.total} médecin(s) trouvé(s)</p>
        {!current.data.doctors.length && <EmptyState title="Aucun médecin trouvé" description="Essayez un autre nom, une autre ville ou une autre spécialité." />}
        <ul className="doctor-list">{current.data.doctors.map(doctor => <li key={doctor.id}><DoctorCard doctor={doctor} /></li>)}</ul>
        <Pagination pagination={current.data.pagination} onPage={value => { const next = new URLSearchParams(params); next.set('page', value); setParams(next); }} />
      </>}
    </section>
  </>;
}
