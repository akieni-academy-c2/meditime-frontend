import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Smartphone } from 'lucide-react';
import { AuthProvider } from './auth/AuthContext.jsx';
import { ModeProvider } from './auth/ModeContext.jsx';
import Profile from './pages/Profile.jsx';
import ProfileForm from './pages/ProfileForm.jsx';
import DoctorProfile from './pages/DoctorProfile.jsx';
import DoctorOnly from './components/DoctorOnly.jsx';
import Search from './pages/Search.jsx';
import DoctorDetail from './pages/DoctorDetail.jsx';
import RequestAppointment from './pages/RequestAppointment.jsx';
import Appointments from './pages/Appointments.jsx';
import AppointmentDetail from './pages/AppointmentDetail.jsx';
import DoctorRequestDetail from './pages/DoctorRequestDetail.jsx';
import Planning from './pages/Planning.jsx';
import WeeklyPlanning from './pages/WeeklyPlanning.jsx';
import Login from './pages/Login.jsx';
import UIKit from './pages/UIKit.jsx';
import { Brand } from './components/Brand.jsx';
import AppShell from './components/AppShell.jsx';
import Home from './pages/Home.jsx';
import Placeholder from './pages/Placeholder.jsx';

export default function App() {
  const location = useLocation();
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 1024px)').matches);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 1024px)');
    const update = () => setMobile(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  if (import.meta.env.DEV && location.pathname === '/ui-kit') return <UIKit />;
  if (!mobile) return <main className="device-message"><Brand /><div className="device-icon"><Smartphone size={40} /></div>
    <h1>MediTime vous accompagne sur mobile</h1><p>L’application est actuellement disponible sur mobile uniquement. Ouvrez cette adresse sur votre téléphone pour continuer.</p>
  </main>;
  return <div className="mobile-app"><AuthProvider><ModeProvider><Routes>
    <Route path="/connexion" element={<main><Login /></main>} />
    <Route element={<AppShell />}>
      <Route path="/accueil" element={<Home />} />
      <Route path="/rendez-vous" element={<Appointments />} />
      <Route path="/rendez-vous/:id" element={<AppointmentDetail />} />
      <Route path="/profil" element={<Profile />} />
      <Route path="/profil/informations" element={<ProfileForm />} />
      <Route path="/profil/completer" element={<ProfileForm onboarding />} />
      <Route element={<DoctorOnly />}>
        <Route path="/profil/medecin" element={<DoctorProfile />} />
        <Route path="/planning" element={<Planning />} />
        <Route path="/planning/configuration" element={<WeeklyPlanning />} />
        <Route path="/demandes" element={<Appointments doctorView />} />
        <Route path="/demandes/:id" element={<DoctorRequestDetail />} />
      </Route>
      <Route path="/recherche" element={<Search />} />
      <Route path="/medecins/:id" element={<DoctorDetail />} />
      <Route path="/medecins/:id/demande" element={<RequestAppointment />} />
    </Route>
    <Route path="*" element={<Navigate to="/connexion" replace />} />
  </Routes></ModeProvider></AuthProvider></div>;
}
