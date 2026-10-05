import { useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { api } from '../lib/api.js';
import AppointmentDetail from './AppointmentDetail.jsx';
import { AuthButton, AuthNotice } from '../components/AuthUI.jsx';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../components/ui/dialog.jsx';

function DecisionActions({ appointment, onResult, onError }) {
  const [choice, setChoice] = useState(null);
  const [busy, setBusy] = useState(false);
  async function decide() {
    if (busy || !choice) return;
    setBusy(true); onError('');
    try {
      const data = await api(`/appointments/${appointment.id}/${choice}`, { method: 'POST', body: {} });
      setChoice(null); onResult(data.appointment);
    } catch (err) { setChoice(null); onError(err.message, true); }
    finally { setBusy(false); }
  }
  if (appointment.status !== 'pending') return <p className="field-hint">Cette demande ne peut plus être confirmée ou déclinée.</p>;
  return <div className="decision-actions"><AuthButton disabled={busy} onClick={() => setChoice('accept')}>Confirmer la demande</AuthButton><AuthButton variant="outline" disabled={busy} onClick={() => setChoice('decline')}>Décliner</AuthButton><Dialog open={Boolean(choice)} onOpenChange={value => { if (!busy && !value) setChoice(null); }}><DialogContent><DialogTitle>{choice === 'accept' ? 'Confirmer ce rendez-vous ?' : 'Décliner cette demande ?'}</DialogTitle><DialogDescription>{choice === 'accept' ? 'La confirmation attribue ce créneau à ce patient. Le serveur contrôle sa disponibilité.' : 'Le patient verra la décision dans le suivi de sa demande.'}</DialogDescription><AuthButton disabled={busy} onClick={decide}>{busy ? 'Enregistrement…' : choice === 'accept' ? 'Confirmer' : 'Décliner la demande'}</AuthButton><AuthButton variant="outline" disabled={busy} onClick={() => setChoice(null)}>Annuler</AuthButton></DialogContent></Dialog></div>;
}
export default function DoctorRequestDetail() {
  const { notifyDataChanged } = useAuth();
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  return <>{error && <AuthNotice error>{error}</AuthNotice>}{notice && <AuthNotice>{notice}</AuthNotice>}<AppointmentDetail doctorView>{appointment => <DecisionActions appointment={appointment} onResult={result => { setError(''); setNotice(result.status === 'confirmed' ? 'Le rendez-vous est confirmé.' : result.status === 'declined' ? 'La demande est déclinée.' : 'La demande a été mise à jour.'); notifyDataChanged(); }} onError={(message, refresh) => { setError(message); setNotice(''); if (refresh) notifyDataChanged(); }} />}</AppointmentDetail></>;
}
