import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Smartphone } from 'lucide-react';
import { AuthProvider } from './auth/AuthContext.jsx';
import Login from './pages/Login.jsx';
import UIKit from './pages/UIKit.jsx';
import { Brand } from './components/Brand.jsx';
import AppShell from './components/AppShell.jsx';
import Home from './pages/Home.jsx';
import Placeholder from './pages/Placeholder.jsx';

export default function App() {
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 1024px)').matches);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 1024px)');
    const update = () => setMobile(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  if (!mobile) return <main className="device-message"><Brand /><div className="device-icon"><Smartphone size={40} /></div>
    <h1>MediTime vous accompagne sur mobile</h1><p>L’application est actuellement disponible sur mobile uniquement. Ouvrez cette adresse sur votre téléphone pour continuer.</p>
  </main>;
  return <div className="mobile-app"><AuthProvider><Routes>
    <Route path="/connexion" element={<main><Login /></main>} />
    <Route element={<AppShell />}>
      <Route path="/accueil" element={<Home />} />
      <Route path="/rendez-vous" element={<Placeholder title="Rendez-vous" description="Vos demandes de rendez-vous et leur statut apparaîtront ici." />} />
      <Route path="/profil" element={<Placeholder title="Profil" description="Vos informations personnelles et les paramètres de votre compte seront accessibles ici." profile />} />
      <Route path="/recherche" element={<Placeholder title="Recherche de médecins" description="Vous pourrez rechercher un médecin par spécialité et consulter ses disponibilités." />} />
    </Route>
    {import.meta.env.DEV && <Route path="/ui-kit" element={<UIKit />} />}
    <Route path="*" element={<Navigate to="/connexion" replace />} />
  </Routes></AuthProvider></div>;
}
