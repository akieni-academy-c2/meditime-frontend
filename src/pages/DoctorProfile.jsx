import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { api } from '../lib/api.js';
import { useResource } from '../lib/useResource.js';
import { FormField, SelectField } from '../components/FormsUI.jsx';
import { AuthButton, AuthNotice } from '../components/AuthUI.jsx';
import { PageHeader } from '../components/NavigationUI.jsx';
import PersonAvatar from '../components/PersonAvatar.jsx';
import ResourceState from '../components/ResourceState.jsx';

function DoctorFields({ profile }) {
  const { account } = useAuth();
  const navigate = useNavigate();
  const specialties = useResource('/specialties');
  const [values, setValues] = useState({ specialtyId: profile.specialtyId, practiceName: profile.practiceName || '', address: profile.address || '', city: profile.city || '', postalCode: profile.postalCode || '', timezone: profile.timezone || 'Africa/Brazzaville', consultationMinutes: profile.consultationMinutes });
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
  return <form onSubmit={save}><div className="profile-identity"><PersonAvatar name={`${account.user.firstName || ''} ${account.user.lastName || ''}`} avatarUrl={account.user.avatarUrl} /><p>Photo actuelle du compte</p></div>{specialties.error && <AuthNotice error>{specialties.error}</AuthNotice>}<SelectField label="Spécialité" value={values.specialtyId} onValueChange={value => setValues({ ...values, specialtyId: value })} options={options} /><FormField label="Nom du cabinet" required maxLength={160} {...field('practiceName')} /><FormField label="Adresse du cabinet" required maxLength={240} {...field('address')} /><div className="form-columns"><FormField label="Ville" required {...field('city')} /><FormField label="Code postal (facultatif)" maxLength={20} {...field('postalCode')} /></div><FormField label="Fuseau horaire" required hint="Exemple : Africa/Brazzaville" {...field('timezone')} /><FormField label="Durée d’une consultation (minutes)" type="number" min={5} max={120} step={5} required {...field('consultationMinutes')} />{error && <AuthNotice error>{error}</AuthNotice>}<AuthButton disabled={busy} type="submit">{busy ? 'Enregistrement…' : 'Enregistrer les modifications'}</AuthButton></form>;
}

export default function DoctorProfile() {
  const navigate = useNavigate();
  const profile = useResource('/me/doctor-profile');
  return <><PageHeader title="Informations médecin" onBack={() => navigate('/profil')} /><ResourceState resource={profile} />{profile.data?.doctorProfile && <DoctorFields profile={profile.data.doctorProfile} />}</>;
}
