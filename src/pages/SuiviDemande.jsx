import { Navigate, useParams } from 'react-router-dom';
import AppointmentDetail from './AppointmentDetail.jsx';
export default function SuiviDemande() {
  const { id } = useParams();
  return id ? <AppointmentDetail /> : <Navigate to="/rendez-vous" replace />;
}
