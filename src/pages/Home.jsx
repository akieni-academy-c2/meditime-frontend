import { Search, Stethoscope } from 'lucide-react';
import SpecialtyIcon from '../components/SpecialtyIcon.jsx';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Home() {
  const { account } = useAuth();
  const name = account.user?.firstName;
  return <>
    <h1>Bonjour{name ? ` ${name}` : ''} !</h1>
    <p className="page-intro">Trouvez un médecin pour votre prochain rendez-vous.</p>
    <Link className="home-search" to="/recherche"><Search size={22} aria-hidden="true" /><span>Médecin, spécialité, ville…</span></Link>
    <section className="home-section" aria-labelledby="specialties-title">
      <div className="section-heading"><h2 id="specialties-title">Spécialités populaires</h2><Link to="/recherche">Voir tout</Link></div>
      <div className="specialty-list">{[['Généraliste', 'general'], ['Dermatologue', 'skin'], ['Pédiatre', 'child'], ['Cardiologue', 'heart']].map(([label, kind]) =>
        <Link key={label} to="/recherche"><SpecialtyIcon kind={kind} /><span>{label}</span></Link>)}</div>
    </section>
    <section className="home-section" aria-labelledby="doctors-title"><h2 id="doctors-title">Médecins disponibles</h2><div className="page-placeholder"><Stethoscope size={32} aria-hidden="true" /><h3>L’annuaire arrive ici</h3><p>Cette section accueillera les médecins et leurs disponibilités. Le contenu est en cours de préparation.</p></div></section>
  </>;
}
