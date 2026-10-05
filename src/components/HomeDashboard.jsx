import { CalendarDays, ClipboardList, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatCompactDate } from '../lib/dates.js';
import { EmptyState } from './CardsUI.jsx';
import AppointmentCard from './AppointmentCard.jsx';
import ResourceState from './ResourceState.jsx';


export default function HomeDashboard({ resource, doctorView = false }) {
  const navigate = useNavigate();
  const data = resource.data;
  const list = doctorView ? '/demandes' : '/rendez-vous';
  return <section className="home-section"><div className="section-heading"><h2>{doctorView ? 'Votre journée' : 'Mes rendez-vous'}</h2></div><ResourceState resource={resource} />{data && <>
    {doctorView ? <Link className="day-summary" to={`/planning?date=${data.date}`}><CalendarDays /><span><strong>{formatCompactDate(`${data.date}T12:00:00Z`, 'UTC')}</strong><small>{data.counts.today} rendez-vous aujourd’hui</small></span><ChevronRight size={18} /></Link> : <div className="patient-counts"><Link to={`${list}?status=confirmed`}>{data.counts.confirmed} confirmés</Link><Link to={`${list}?status=pending`}>{data.counts.pending} en attente</Link></div>}
    <div className="section-heading"><h2>{doctorView ? 'Prochain rendez-vous' : 'À venir'}</h2><Link to={doctorView ? '/planning' : list}>Voir tout</Link></div><div className="card-list">{data.upcoming.slice(0, doctorView ? 1 : 3).map(appointment => <AppointmentCard key={appointment.id} appointment={appointment} doctorView={doctorView} onClick={() => navigate(`${list}/${appointment.id}`)} />)}{!data.upcoming.length && <EmptyState title="Aucun rendez-vous confirmé à venir" description="Les demandes en attente restent dans votre suivi jusqu’à la décision du médecin." />}</div>
    {doctorView && <><section className="home-section"><div className="section-heading"><h2>Demandes en attente</h2><Link to="/demandes?status=pending">Voir toutes</Link></div><Link className="pending-summary" to="/demandes?status=pending"><ClipboardList size={30} /><span><strong>{data.counts.pending} demande(s)</strong><small>en attente de réponse</small></span><ChevronRight size={18} /></Link></section><section className="home-section"><h2 className="subheading">Accès rapide</h2><div className="dashboard-actions"><Link to="/planning"><CalendarDays size={22} /><span><strong>Planning</strong><small>Voir mon agenda</small></span><ChevronRight size={16} /></Link><Link to="/demandes?status=pending"><ClipboardList size={22} /><span><strong>Demandes</strong><small>{data.counts.pending} en attente</small></span><ChevronRight size={16} /></Link></div></section></>}
  </>}</section>;
}
