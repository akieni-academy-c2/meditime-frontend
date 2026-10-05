import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { PageHeader } from '../components/NavigationUI.jsx';
import BottomSheet from '../components/BottomSheet.jsx';
import { SearchBar } from '../components/SearchBar.jsx';
import { DoctorCard } from '../components/DoctorCard.jsx';
import { LoadingState, EmptyState, ErrorState } from '../components/States.jsx';
import Pagination from '../components/Pagination.jsx';
import { AuthButton } from '../components/AuthUI.jsx';
import { useResource } from '../lib/useResource.js';
import { getDoctorCities, searchDoctors } from '../lib/doctors.js';
import { Switch } from '../components/ui/switch.jsx';

export default function Recherche() {
  const navigate = useNavigate();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [params, setParams] = useSearchParams();
  const query = params.toString();
  const [name, setName] = useState(params.get('q') || '');
  const [city, setCity] = useState(params.get('city') || '');
  const [result, setResult] = useState({ query: null, loading: true, error: '', data: null });
  const [revision, setRevision] = useState(0);
  const specialties = useResource('/specialties');
  const specialtyId = params.get('specialtyId') || '';
  const availableBefore = params.get('availableBefore') || '';
  const [draftSpecialty, setDraftSpecialty] = useState(specialtyId);
  const [draftAvailable, setDraftAvailable] = useState(Boolean(availableBefore));
  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [citiesError, setCitiesError] = useState('');
  function openFilters() {
    setCity(params.get('city') || '');
    setDraftSpecialty(specialtyId);
    setDraftAvailable(Boolean(availableBefore));
    setFiltersOpen(true);
  }
  useEffect(() => {
    if (!filtersOpen) return;
    const controller = new AbortController();
    setCitiesLoading(true); setCitiesError('');
    getDoctorCities({ signal: controller.signal }).then(values => {
      if (!controller.signal.aborted) setCities(values);
    }).catch(error => {
      if (!controller.signal.aborted) setCitiesError(error.message);
    }).finally(() => { if (!controller.signal.aborted) setCitiesLoading(false); });
    return () => controller.abort();
  }, [filtersOpen]);
  const page = Math.max(1, Number(params.get('page')) || 1);
  useEffect(() => { setName(params.get('q') || ''); setCity(params.get('city') || ''); }, [query]);
  useEffect(() => {
    const controller = new AbortController();
    setResult({ query, loading: true, error: '', data: null });
    searchDoctors({ name: params.get('q') || '', city: params.get('city') || '', specialtyId, availableBefore, page, signal: controller.signal })
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
    for (const [key, value] of [['q', name.trim()]]) {
      if (value) next.set(key, value); else next.delete(key);
    }
    setParams(next);
  }
  function applyFilters(event) {
    event.preventDefault();
    const next = new URLSearchParams(params); next.delete('page');
    for (const [key, value] of [['city', city.trim()], ['specialtyId', draftSpecialty], ['availableBefore', draftAvailable ? availableBefore || new Date(Date.now() + 7 * 86400000).toISOString() : '']]) {
      if (value) next.set(key, value); else next.delete(key);
    }
    setParams(next); setFiltersOpen(false);
  }
  const current = result.query === query ? result : { loading: true, data: null, error: '' };
  return <><PageHeader title="Résultats" onBack={() => navigate('/accueil')} action={<button type="button" aria-label="Filtres de recherche" onClick={openFilters}><SlidersHorizontal size={20} /></button>} />
    <form className="search-query" onSubmit={submit}><SearchBar value={name} onChange={setName} placeholder="Modifier ma recherche" /><button type="submit" aria-label="Rechercher"><Search size={19} /></button></form>
    <div className="search-filters"><button type="button" onClick={openFilters}>{params.get('city') || 'Ville'}</button><button type="button" aria-pressed={Boolean(availableBefore)} onClick={() => updateFilter('availableBefore', availableBefore ? '' : new Date(Date.now() + 7 * 86400000).toISOString())}>Disponible sous 7 jours</button>
      <div className="filter-row"><label htmlFor="specialty-filter" className="sr-only">Filtrer par spécialité</label>
        <select id="specialty-filter" className="filter-select" value={specialtyId} onChange={event => updateFilter('specialtyId', event.target.value)}>
          <option value="">Spécialité</option>{specialties.data?.specialties.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </div></div>
    <BottomSheet className="business-sheet search-filter-sheet" open={filtersOpen} onOpenChange={setFiltersOpen} title="Filtres de recherche" footer={<AuthButton type="submit" form="city-search-form">Afficher les résultats</AuthButton>}><form id="city-search-form" onSubmit={applyFilters}>
      <div className="form-field"><label htmlFor="city-filter">Ville</label><input id="city-filter" list="doctor-cities" autoComplete="off" value={city} maxLength={100} placeholder="Toutes les villes" onChange={event => setCity(event.target.value)} /><datalist id="doctor-cities">{cities.map(value => <option key={value} value={value} />)}</datalist>{citiesLoading && <p className="field-hint">Chargement des villes…</p>}{citiesError && <p role="alert" className="field-hint">{citiesError}</p>}</div>
      <div className="form-field"><label htmlFor="sheet-specialty">Spécialité</label><select id="sheet-specialty" className="filter-select" value={draftSpecialty} onChange={event => setDraftSpecialty(event.target.value)}><option value="">Toutes les spécialités</option>{specialties.data?.specialties.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
      <label className="filter-switch" htmlFor="sheet-available">Disponible sous 7 jours<Switch id="sheet-available" checked={draftAvailable} onCheckedChange={setDraftAvailable} /></label>
      <button type="button" className="text-action" onClick={() => { setCity(''); setDraftSpecialty(''); setDraftAvailable(false); }}>Réinitialiser les filtres</button>
    </form></BottomSheet>
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
