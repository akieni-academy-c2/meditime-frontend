import { useNavigate, useSearchParams } from 'react-router-dom';
import { useResource } from '../lib/useResource.js';
import { FilterChips } from '../components/SchedulingUI.jsx';
import { EmptyState } from '../components/CardsUI.jsx';
import AppointmentCard from '../components/AppointmentCard.jsx';
import Pagination from '../components/Pagination.jsx';
import ResourceState from '../components/ResourceState.jsx';
import { RefreshCw } from 'lucide-react';

const filters = [{ value: 'pending', label: 'En attente' }, { value: 'confirmed', label: 'Confirmés' }, { value: 'declined', label: 'Déclinés' }, { value: 'cancelled', label: 'Annulés' }, { value: 'past', label: 'Passés' }];
export default function Appointments({ doctorView = false }) {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const status = filters.some(item => item.value === params.get('status')) ? params.get('status') : 'pending';
  const page = Math.max(1, Number(params.get('page')) || 1);
  const resource = useResource(`${doctorView ? '/me/doctor/appointments' : '/me/appointments'}?status=${status}&page=${page}&limit=12`);
  return <><header className="list-page-title"><h1>{doctorView ? 'Demandes' : 'Mes rendez-vous'}</h1><button type="button" aria-label="Actualiser les demandes" disabled={resource.loading} onClick={resource.reload}><RefreshCw size={18} /></button></header><FilterChips label="Statut des demandes" options={filters} value={status} onChange={value => setParams({ status: value })} /><ResourceState resource={resource} />{resource.data && <><p className="results-count" role="status">{resource.data.pagination.total} demande(s)</p><div className="card-list">{resource.data.appointments.map(appointment => <AppointmentCard key={appointment.id} appointment={appointment} doctorView={doctorView} onClick={() => navigate(`${doctorView ? '/demandes' : '/rendez-vous'}/${appointment.id}`)} />)}</div>{!resource.data.appointments.length && <EmptyState title="Aucune demande dans cette catégorie" description="Les demandes correspondant à ce statut apparaîtront ici." />}<Pagination pagination={resource.data.pagination} onPage={value => setParams({ status, page: value })} /></>}</>;
}
