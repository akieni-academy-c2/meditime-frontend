import { Outlet } from 'react-router-dom';
import { useMode } from '../auth/ModeContext.jsx';
import { AuthNotice } from './AuthUI.jsx';

export default function DoctorOnly() {
  const { mode, allowedModes } = useMode();
  if (!allowedModes.includes('doctor')) return <AuthNotice error>Votre compte n’est pas habilité à accéder à cet espace médecin.</AuthNotice>;
  if (mode !== 'doctor') return <AuthNotice>Activez le mode médecin depuis Profil pour accéder à cet écran.</AuthNotice>;
  return <Outlet />;
}
