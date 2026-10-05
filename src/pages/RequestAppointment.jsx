import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { api } from '../lib/api.js';
import { useResource } from '../lib/useResource.js';
import { dateInZone, personName } from '../lib/dates.js';
import { PageHeader } from '../components/NavigationUI.jsx';
import { FormField } from '../components/FormsUI.jsx';
import { AuthButton, AuthNotice } from '../components/AuthUI.jsx';
import DoctorCard from '../components/DoctorCard.jsx';
import DoctorSlots from '../components/DoctorSlots.jsx';
import ResourceState from '../components/ResourceState.jsx';

function RequestForm({ doctor }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { account } = useAuth();
  const [selection, setSelection] = useState(null);
  const [reason, setReason] = useState('');
  const [revision, setRevision] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const requestedDate = params.get('date');
  const initialDate = requestedDate && Number.isFinite(Date.parse(requestedDate)) ? dateInZone(requestedDate, doctor.timezone) : undefined;
  async function send(event) {
    event.preventDefault(); if (!selection || busy) return;
    setBusy(true); setError('');
    try {
      const data = await api('/appointments', { method: 'POST', body: { slotId: selection.id, ...(reason.trim() && { reason: reason.trim() }) } });
      navigate(`/rendez-vous/${data.appointment.id}?envoyee=1`, { replace: true });
    } catch (err) {
      setError(err.message);
      if (err.status === 409) { setSelection(null); setRevision(value => value + 1); }
    } finally { setBusy(false); }
  }
  return <><DoctorCard doctor={doctor} /><DoctorSlots key={revision} doctor={doctor} initialDate={initialDate} initialSlotId={revision ? '' : params.get('slot')} onSelectionChange={setSelection} /><section className="request-info"><div className="section-heading"><h2>Vos informations</h2><Link to="/profil/informations">Modifier</Link></div><p>{personName(account.user)}</p>{account.user.phone && <p>{account.user.phone}</p>}<p>{account.user.email}</p></section><form onSubmit={send}><FormField label="Motif (facultatif)" multiline maxLength={1000} placeholder="Ex. : bilan de santé, renouvellement d’ordonnance…" value={reason} onChange={event => setReason(event.target.value)} hint={`${reason.length} / 1000 caractères`} />{error && <AuthNotice error>{error}</AuthNotice>}<AuthButton type="submit" disabled={!selection || busy}>{busy ? 'Envoi…' : 'Demander le rendez-vous'}</AuthButton><p className="field-hint">Votre demande attendra la confirmation du médecin.</p></form></>;
}
export default function RequestAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = useResource(`/doctors/${id}`);
  return <><PageHeader title="Demander un rendez-vous" onBack={() => navigate(`/medecins/${id}`)} /><ResourceState resource={doctor} />{doctor.data?.doctor && <RequestForm key={id} doctor={doctor.data.doctor} />}</>;
}
