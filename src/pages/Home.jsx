import { Baby, Heart, Search, Stethoscope, Sun } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { useMode } from '../auth/ModeContext.jsx';
import { useResource } from '../lib/useResource.js';
import DoctorCard from '../components/DoctorCard.jsx';
import ResourceState from '../components/ResourceState.jsx';
import { EmptyState } from '../components/CardsUI.jsx';

const specialtyIcons = { 'medecine-generale': Stethoscope, dermatologie: Sun, pediatrie: Baby, cardiologie: Heart };
export default function Home() {
  const { account } = useAuth();
  const { mode } = useMode();
  const navigate = useNavigate();
  const specialties = useResource(mode === 'patient' ? '/specialties' : null);
  const doctors = useResource(mode === 'patient' ? '/doctors?limit=3' : null);
  if (mode === 'doctor') return <><h1>Bonjour Dr {account.user.firstName} !</h1><p className="page-intro">Votre accueil médecin sera raccordé aux compteurs serveur dans le lot dédié.</p><Link className="home-search" to="/demandes">Voir les demandes</Link><Link className="home-search" to="/planning">Voir le planning</Link></>;
  return <><h1>Bonjour {account.user.firstName} !</h1><p className="page-intro">Trouvez un médecin pour votre prochain rendez-vous.</p><Link className="home-search" to="/recherche"><Search size={22} aria-hidden="true" /><span>Médecin, spécialité, ville…</span></Link>
    <section className="home-section"><div className="section-heading"><h2>Spécialités</h2><Link to="/recherche">Voir tout</Link></div><ResourceState resource={specialties} />{specialties.data && <div className="specialty-list">{specialties.data.specialties.slice(0, 4).map(item => { const Icon = specialtyIcons[item.slug] || Stethoscope; return <Link key={item.id} to={`/recherche?specialtyId=${item.id}`}><Icon size={29} aria-hidden="true" /><span>{item.name}</span></Link>; })}</div>}</section>
    <section className="home-section"><div className="section-heading"><h2>Médecins</h2><Link to="/recherche">Voir tout</Link></div><ResourceState resource={doctors} />{doctors.data && <div className="card-list">{doctors.data.doctors.map(doctor => <DoctorCard key={doctor.id} doctor={doctor} onClick={() => navigate(`/medecins/${doctor.id}`)} />)}{!doctors.data.doctors.length && <EmptyState title="Aucun médecin disponible" description="L’annuaire ne contient aucun médecin pour le moment." />}</div>}</section>
  </>;
}
