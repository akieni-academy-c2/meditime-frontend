import { useEffect, useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { ChevronRight } from 'lucide-react';
import { getDoctorCities } from '../lib/doctors.js';
import { api } from '../lib/api.js';
import { useResource } from '../lib/useResource.js';
import { FormField, NativeSelectField } from '../components/FormsUI.jsx';
import { AuthButton, AuthNotice } from '../components/AuthUI.jsx';
import { PageHeader } from '../components/NavigationUI.jsx';
import PersonAvatar from '../components/PersonAvatar.jsx';
import ResourceState from '../components/ResourceState.jsx';

function DoctorFields({ profile }) {
  const { account } = useAuth();
  const navigate = useNavigate();
  const specialties = useResource('/specialties');
  const [values, setValues] = useState({ specialtyId: profile.specialtyId, practiceName: profile.practiceName || '', address: profile.address || '', city: profile.city || '', postalCode: profile.postalCode || '', timezone: profile.timezone || 'Africa/Brazzaville', consultationMinutes: profile.consultationMinutes });
  const [cities, setCities] = useState([profile.city].filter(Boolean));
  const [citiesError, setCitiesError] = useState('');
  const [cabinetOpen, setCabinetOpen] = useState(false);
  const cabinetId = useId();
  useEffect(() => {
    const controller = new AbortController();
    getDoctorCities({ signal: controller.signal }).then(items => setCities([...new Set([profile.city, ...items].filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr')))).catch(err => { if (!controller.signal.aborted) setCitiesError(err.message); });
    return () => controller.abort();
  }, [profile.city]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const field = key => ({ value: values[key], onChange: event => setValues({ ...values, [key]: event.target.value }) });
  async function save(event) {
    event.preventDefault(); if (busy) return;
    setBusy(true); setError('');
    try { await api('/me/doctor-profile', { method: 'PATCH', body: { ...values, postalCode: values.postalCode.trim() || null, consultationMinutes: Number(values.consultationMinutes) } }); navigate('/profil'); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  const options = specialties.data?.specialties?.map(item => ({ value: item.id, label: item.name })) || [{ value: profile.specialtyId, label: profile.specialty?.name || 'Spécialité actuelle' }];
  return <form className="doctor-settings-form" onSubmit={save}><div className="profile-photo"><p>Photo de profil</p><div className="profile-identity"><PersonAvatar name={`${account.user.firstName || ''} ${account.user.lastName || ''}`} avatarUrl={account.user.avatarUrl} /><p>Photo actuelle du compte</p></div></div>{specialties.error && <AuthNotice error>{specialties.error}</AuthNotice>}<NativeSelectField label="Spécialité" required {...field('specialtyId')} options={options} /><FormField label="Nom du cabinet" required maxLength={160} {...field('practiceName')} /><FormField label="Adresse du cabinet" required maxLength={240} {...field('address')} /><div className="form-columns"><NativeSelectField label="Ville" required {...field('city')} options={cities.map(city => ({ value: city, label: city }))} /><FormField label="Code postal (facultatif)" maxLength={20} {...field('postalCode')} /></div><section className="cabinet-options"><button className="cabinet-toggle" type="button" aria-expanded={cabinetOpen} aria-controls={cabinetId} onClick={() => setCabinetOpen(value => !value)}><ChevronRight size={14} />Paramètres du cabinet</button><div id={cabinetId} className="cabinet-collapse" data-open={cabinetOpen} inert={!cabinetOpen}><div><FormField label="Fuseau horaire" required hint="Exemple : Africa/Brazzaville" {...field('timezone')} /><FormField label="Durée d’une consultation (minutes)" type="number" min={5} max={120} step={5} required {...field('consultationMinutes')} /></div></div></section>{citiesError && <AuthNotice error>{citiesError}</AuthNotice>}{error && <AuthNotice error>{error}</AuthNotice>}<AuthButton disabled={busy} type="submit">{busy ? 'Enregistrement…' : 'Enregistrer les modifications'}</AuthButton></form>;
}

export default function DoctorProfile() {
  const navigate = useNavigate();
  const profile = useResource('/me/doctor-profile');
  return <><PageHeader title="Informations médecin" fallback="/profil" /><ResourceState resource={profile} />{profile.data?.doctorProfile && <DoctorFields profile={profile.data.doctorProfile} />}</>;
}
