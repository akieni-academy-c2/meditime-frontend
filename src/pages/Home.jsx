import { useState } from 'react';
import BottomSheet from '../components/BottomSheet.jsx';
import { Baby, Heart, Search, Stethoscope, Sun } from 'lucide-react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { useMode } from '../auth/ModeContext.jsx';
import { useResource } from '../lib/useResource.js';
import DoctorCard from '../components/DoctorCard.jsx';
import ResourceState from '../components/ResourceState.jsx';
import { EmptyState } from '../components/CardsUI.jsx';
import HomeDashboard from '../components/HomeDashboard.jsx';

const specialtyIcons = { 'medecine-generale': Stethoscope, dermatologie: Sun, pediatrie: Baby, cardiologie: Heart };
export default function Home() {
  const [allSpecialties, setAllSpecialties] = useState(false);
  const { account } = useAuth();
  const { mode } = useMode();
  const navigate = useNavigate();
  const { dashboard } = useOutletContext();
  const specialties = useResource(mode === 'patient' ? '/specialties' : null);
  const doctors = useResource(mode === 'patient' ? '/doctors?limit=3' : null);
  if (mode === 'doctor') return <><h1>Bonjour Dr {account.user.firstName} !</h1><p className="page-intro">Voici votre activité du jour.</p><HomeDashboard resource={dashboard} doctorView /></>;
  return <><h1>Bonjour {account.user.firstName} !</h1><p className="page-intro">Trouvez un médecin pour votre prochain rendez-vous.</p><Link className="home-search" to="/recherche"><Search size={22} aria-hidden="true" /><span>Médecin, spécialité, ville…</span></Link>
    <section className="home-section"><div className="section-heading"><h2>Spécialités</h2><button type="button" className="text-action" onClick={() => setAllSpecialties(true)}>Voir tout</button></div><ResourceState resource={specialties} />{specialties.data && <div className="specialty-list">{[...specialties.data.specialties].sort((a, b) => { const order = ['medecine-generale', 'dermatologie', 'pediatrie', 'cardiologie']; return (order.indexOf(a.slug) < 0 ? 99 : order.indexOf(a.slug)) - (order.indexOf(b.slug) < 0 ? 99 : order.indexOf(b.slug)); }).slice(0, 4).map(item => { const Icon = specialtyIcons[item.slug] || Stethoscope; return <Link key={item.id} to={`/recherche?specialtyId=${item.id}`}><Icon size={29} aria-hidden="true" /><span>{item.name}</span></Link>; })}</div>}</section>
    <HomeDashboard resource={dashboard} />
    <section className="home-section"><div className="section-heading"><h2>Médecins</h2><Link to="/recherche">Voir tout</Link></div><ResourceState resource={doctors} />{doctors.data && <div className="card-list">{doctors.data.doctors.map(doctor => <DoctorCard key={doctor.id} doctor={doctor} onClick={() => navigate(`/medecins/${doctor.id}`)} />)}{!doctors.data.doctors.length && <EmptyState title="Aucun médecin disponible" description="L’annuaire ne contient aucun médecin pour le moment." />}</div>}</section>
    <BottomSheet open={allSpecialties} onOpenChange={setAllSpecialties} title="Toutes les spécialités" className="business-sheet"><ResourceState resource={specialties} /><div className="all-specialties">{specialties.data?.specialties.map(item => { const Icon = specialtyIcons[item.slug] || Stethoscope; return <Link key={item.id} to={`/recherche?specialtyId=${item.id}`}><Icon size={24} /><span>{item.name}</span></Link>; })}</div></BottomSheet>
  </>;
}
