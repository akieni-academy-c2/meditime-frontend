import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useResource } from '../lib/useResource.js';
import { PageHeader } from '../components/NavigationUI.jsx';
import { AuthButton, AuthNotice } from '../components/AuthUI.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import { api } from '../lib/api.js';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../components/ui/dialog.jsx';
import AppointmentCard from '../components/AppointmentCard.jsx';
import ResourceState from '../components/ResourceState.jsx';

const reasons = { REQUEST_EXPIRED: 'Le créneau est passé avant qu’une décision soit prise.', SLOT_BLOCKED: 'Le médecin a rendu ce créneau indisponible.', SLOT_TAKEN: 'Ce créneau a été attribué à une autre demande.' };
function CancelRequest({ appointment }) {
  const { notifyDataChanged } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function cancel() {
    if (busy) return;
    setBusy(true); setError('');
    try {
      await api('/appointments/' + appointment.id + '/cancel', { method: 'PATCH', body: {} });
      setOpen(false); notifyDataChanged();
    } catch (err) { setError(err.message); setOpen(false); notifyDataChanged(); }
    finally { setBusy(false); }
  }
  return <>{error && <AuthNotice error>{error}</AuthNotice>}{appointment.status === 'pending' && <AuthButton variant="outline" disabled={busy} onClick={() => setOpen(true)}>Annuler ma demande</AuthButton>}<Dialog open={open} onOpenChange={value => { if (!busy) setOpen(value); }}><DialogContent><DialogTitle>Annuler cette demande ?</DialogTitle><DialogDescription>Le médecin ne pourra plus confirmer cette demande.</DialogDescription><AuthButton disabled={busy} onClick={cancel}>{busy ? 'Annulation…' : 'Annuler la demande'}</AuthButton><AuthButton variant="outline" disabled={busy} onClick={() => setOpen(false)}>Conserver la demande</AuthButton></DialogContent></Dialog></>;
}
export default function AppointmentDetail({ doctorView = false, children }) {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const resource = useResource(`/appointments/${id}`);
  const appointment = resource.data?.appointment;
  const sent = !doctorView && params.get('envoyee') === '1';
  return <><PageHeader title={sent ? 'Récapitulatif de la demande' : 'Détail de la demande'} onBack={() => navigate(doctorView ? '/demandes' : '/rendez-vous')} /><ResourceState resource={resource} />{appointment && <>{sent && <div className="request-success"><div className="success-symbol"><Check size={40} /></div><h1>Demande envoyée !</h1><p>Votre demande a été transmise. Consultez son statut pour suivre la décision du médecin.</p></div>}<AppointmentCard appointment={appointment} doctorView={doctorView} /><section className="request-info"><h2>Motif de la demande</h2><p>{appointment.reason || 'Aucun motif renseigné.'}</p></section>{reasons[appointment.decisionCode] && <p className="field-hint">{reasons[appointment.decisionCode]}</p>}{children?.(appointment, resource.reload)}{!doctorView && <CancelRequest appointment={appointment} />}<AuthButton variant="outline" onClick={resource.reload}>Actualiser le statut</AuthButton>{sent && <><AuthButton onClick={() => navigate('/rendez-vous')}>Voir mes rendez-vous</AuthButton><Link className="text-action" to="/accueil">Retour à l’accueil</Link></>}</>}</>;
}
