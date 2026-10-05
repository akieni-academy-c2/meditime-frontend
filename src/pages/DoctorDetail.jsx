import { useNavigate, useParams } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';
import { useResource } from '../lib/useResource.js';
import { personName } from '../lib/dates.js';
import { PageHeader } from '../components/NavigationUI.jsx';
import PersonAvatar from '../components/PersonAvatar.jsx';
import DoctorSlots from '../components/DoctorSlots.jsx';
import ResourceState from '../components/ResourceState.jsx';

export default function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const resource = useResource(`/doctors/${id}`);
  const doctor = resource.data?.doctor;
  return <><PageHeader title="Fiche médecin" fallback="/recherche" /><ResourceState resource={resource} />{doctor && <><div className="doctor-identity"><PersonAvatar name={personName(doctor.user)} avatarUrl={doctor.user.avatarUrl} /><div><h1>Dr {personName(doctor.user)}</h1><p className="page-intro">{doctor.specialty.name}</p></div></div><div className="doctor-facts"><p><MapPin /><span><strong>{doctor.practiceName}</strong><small>{doctor.address}, {doctor.city} {doctor.postalCode}</small></span></p><p><Clock /><span>Durée d’une consultation<small>{doctor.consultationMinutes} minutes</small></span></p></div><DoctorSlots key={doctor.id} doctor={doctor} onChoose={slot => navigate(`/medecins/${doctor.id}/demande?slot=${slot.id}&date=${encodeURIComponent(slot.startsAt)}`)} /></>}</>;
}
