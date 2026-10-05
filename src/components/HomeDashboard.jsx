import { CalendarDays, ClipboardList, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { dateChoices, formatDate } from '../lib/dates.js';
import { DateStrip } from './SchedulingUI.jsx';
import { EmptyState } from './CardsUI.jsx';
import AppointmentCard from './AppointmentCard.jsx';
import ResourceState from './ResourceState.jsx';
import { Button } from './ui/button.jsx';

export default function HomeDashboard({ resource, doctorView = false }) {
  const navigate = useNavigate();
  const data = resource.data;
  const list = doctorView ? '/demandes' : '/rendez-vous';
  return <section className="home-section"><div className="section-heading"><h2>{doctorView ? 'Votre journée' : 'Mes rendez-vous'}</h2><Button variant="ghost" onClick={resource.reload} disabled={resource.loading}>Actualiser</Button></div><ResourceState resource={resource} />{data && <>
    {doctorView && <><p className="dashboard-date">{formatDate(`${data.date}T12:00:00Z`, 'UTC')} · {data.timezone}</p><DateStrip dates={dateChoices(data.date)} value={data.date} onChange={date => navigate(`/planning?date=${date}`)} /></>}
    <div className="dashboard-counts"><Link to={doctorView ? `/planning?date=${data.date}` : `${list}?status=confirmed`}><CalendarDays size={22} /><strong>{doctorView ? data.counts.today : data.counts.confirmed}</strong><span>{doctorView ? 'Rendez-vous aujourd’hui' : 'Rendez-vous confirmés'}</span></Link><Link to={`${list}?status=pending`}><ClipboardList size={22} /><strong>{data.counts.pending}</strong><span>{doctorView ? 'Demandes à traiter' : 'Demandes en attente'}</span></Link></div>
    <div className="section-heading"><h2>{doctorView ? 'Prochain rendez-vous' : 'À venir'}</h2><Link to={doctorView ? '/planning' : list}>Voir tout</Link></div><div className="card-list">{data.upcoming.slice(0, doctorView ? 1 : 3).map(appointment => <AppointmentCard key={appointment.id} appointment={appointment} doctorView={doctorView} onClick={() => navigate(`${list}/${appointment.id}`)} />)}{!data.upcoming.length && <EmptyState title="Aucun rendez-vous confirmé à venir" description="Les demandes en attente restent dans votre suivi jusqu’à la décision du médecin." />}</div>
    {doctorView && <section className="home-section"><h2 className="subheading">Actions rapides</h2><div className="dashboard-actions"><Link to="/planning/configuration"><Settings size={22} /><span>Configurer mon planning</span></Link><Link to="/demandes?status=pending"><ClipboardList size={22} /><span>Traiter les demandes</span></Link></div></section>}
  </>}</section>;
}
