import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import { useResource } from '../lib/useResource.js';
import { FormField, SelectField } from '../components/FormsUI.jsx';
import { PageHeader } from '../components/NavigationUI.jsx';
import { AuthButton, AuthNotice } from '../components/AuthUI.jsx';
import { EmptyState } from '../components/CardsUI.jsx';
import { Button } from '../components/ui/button.jsx';
import { Switch } from '../components/ui/switch.jsx';
import DoctorCard from '../components/DoctorCard.jsx';
import Pagination from '../components/Pagination.jsx';
import ResourceState from '../components/ResourceState.jsx';
import BottomSheet from '../components/BottomSheet.jsx';

export default function Search() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const query = params.toString();
  const [q, setQ] = useState(params.get('q') || '');
  const [city, setCity] = useState(params.get('city') || '');
  const [specialtyId, setSpecialtyId] = useState(params.get('specialtyId') || 'all');
  const [soon, setSoon] = useState(Boolean(params.get('availableBefore')));
  const [filters, setFilters] = useState(false);
  const specialties = useResource('/specialties');
  const doctors = useResource(`/doctors?${query}${query ? '&' : ''}limit=12`);
  useEffect(() => {
    setQ(params.get('q') || ''); setCity(params.get('city') || ''); setSpecialtyId(params.get('specialtyId') || 'all'); setSoon(Boolean(params.get('availableBefore')));
  }, [query]);
  function apply(event) {
    event?.preventDefault();
    const next = new URLSearchParams();
    if (q.trim()) next.set('q', q.trim());
    if (city.trim()) next.set('city', city.trim());
    if (specialtyId !== 'all') next.set('specialtyId', specialtyId);
    if (soon) next.set('availableBefore', params.get('availableBefore') || new Date(Date.now() + 7 * 86400000).toISOString());
    setParams(next); setFilters(false);
  }
  return <><PageHeader title="Résultats" onBack={() => navigate('/accueil')} action={<Button variant="ghost" aria-label="Filtrer les médecins" onClick={() => setFilters(true)}><SlidersHorizontal /></Button>} />
    <form className="search-form" onSubmit={apply}><FormField label="Médecin ou spécialité" placeholder="Modifier ma recherche" icon={SearchIcon} maxLength={100} value={q} onChange={event => setQ(event.target.value)} /><AuthButton type="submit">Rechercher</AuthButton></form>
    {(params.get('city') || params.get('specialtyId') || params.get('availableBefore')) && <div className="active-filters"><Button variant="outline" onClick={() => { setParams({}); setCity(''); setSpecialtyId('all'); setSoon(false); }}>Effacer les filtres</Button></div>}
    <ResourceState resource={doctors} />{doctors.data && <><p className="results-count" role="status">{doctors.data.pagination.total} médecin(s) trouvé(s)</p><div className="card-list">{doctors.data.doctors.map(doctor => <DoctorCard key={doctor.id} doctor={doctor} onClick={() => navigate(`/medecins/${doctor.id}`)} />)}</div>{!doctors.data.doctors.length && <EmptyState title="Aucun médecin trouvé" description="Essayez un autre nom, une autre spécialité ou retirez les filtres." />}<Pagination pagination={doctors.data.pagination} onPage={page => { const next = new URLSearchParams(params); next.set('page', page); setParams(next); }} /></>}
    <BottomSheet open={filters} onOpenChange={setFilters} title="Filtrer les médecins" description="Affinez votre recherche." footer={<AuthButton onClick={apply}>Afficher les résultats</AuthButton>}>
      <FormField label="Ville" value={city} maxLength={100} onChange={event => setCity(event.target.value)} />{specialties.error && <AuthNotice error>{specialties.error}</AuthNotice>}<SelectField label="Spécialité" value={specialtyId} onValueChange={setSpecialtyId} options={[{ value: 'all', label: 'Toutes les spécialités' }, ...(specialties.data?.specialties || []).map(item => ({ value: item.id, label: item.name }))]} /><label className="filter-switch">Disponibles dans les 7 prochains jours<Switch checked={soon} onCheckedChange={setSoon} aria-label="Disponibles dans les 7 prochains jours" /></label>
    </BottomSheet>
  </>;
}
