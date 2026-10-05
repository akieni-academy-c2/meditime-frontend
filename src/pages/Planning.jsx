import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Settings, Plus, CalendarDays, Clock, ChevronRight } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';
import { api } from '../lib/api.js';
import { useResource } from '../lib/useResource.js';
import { dateChoices, dateInZone, formatCompactDate, formatTime, personName, shiftDate } from '../lib/dates.js';
import { exceptionLabels, minuteLabel } from '../lib/planning.js';
import { PageHeader } from '../components/NavigationUI.jsx';
import { FormField } from '../components/FormsUI.jsx';
import { DateStrip } from '../components/SchedulingUI.jsx';
import { EmptyState } from '../components/CardsUI.jsx';
import { AuthButton, AuthNotice } from '../components/AuthUI.jsx';
import { Button } from '../components/ui/button.jsx';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../components/ui/dialog.jsx';
import PersonAvatar from '../components/PersonAvatar.jsx';
import ResourceState from '../components/ResourceState.jsx';
import PlanningExceptionSheet from '../components/PlanningExceptionSheet.jsx';

function PlanningCalendar({ doctor }) {
  const navigate = useNavigate();
  const { notifyDataChanged } = useAuth();
  const [query] = useSearchParams();
  const [date, setDate] = useState(() => {
    const requested = query.get('date');
    const valid = /^\d{4}-\d{2}-\d{2}$/.test(requested || '') && Number.isFinite(Date.parse(`${requested}T12:00:00Z`));
    return valid ? requested : dateInZone(new Date(), doctor.timezone);
  });
  const [sheet, setSheet] = useState(false);
  const [remove, setRemove] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const resource = useResource(`/me/doctor/planning?from=${date}&to=${date}`);
  const availability = useResource('/me/doctor/availability');
  const weekday = (new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7;
  const weekStart = shiftDate(date, -weekday);
  const ranges = availability.data?.ranges.filter(range => range.weekday === weekday + 1);
  const today = dateInZone(new Date(), doctor.timezone);
  const maxDate = shiftDate(today, 55);
  function saved(message) { setNotice(message); setError(''); notifyDataChanged(); }
  async function deleteException() {
    if (!remove || busy) return;
    setBusy(true); setError(''); setNotice('');
    try { await api(`/me/doctor/exceptions/${remove.id}`, { method: 'DELETE' }); setRemove(null); saved('L’exception a été supprimée.'); }
    catch (err) { setError(err.message); setRemove(null); } finally { setBusy(false); }
  }
  return <><PageHeader title="Mon planning" action={<Button variant="outline" onClick={() => navigate('/planning/configuration')}><Settings size={16} />Configurer</Button>} /><div className="planning-date-heading"><h2>{date === today ? 'Aujourd’hui, ' : ''}{formatCompactDate(`${date}T12:00:00Z`, 'UTC')}</h2><details><summary aria-label="Changer la date du planning"><CalendarDays size={20} /></summary><FormField label="Date du planning" type="date" value={date} max={maxDate} onChange={event => { if (event.target.value) { setDate(event.target.value); setNotice(''); setError(''); event.target.closest('details').open = false; } }} /></details></div><p className="page-intro">Vos rendez-vous et disponibilités</p><DateStrip dates={dateChoices(weekStart).filter(day => day.value <= maxDate)} value={date} onChange={setDate} /><button type="button" className="recurring-summary" onClick={() => navigate('/planning/configuration')}><Clock size={23} /><span><strong>Horaires récurrents</strong><small>{ranges ? ranges.length ? ranges.map(range => `${minuteLabel(range.startMinute)} – ${minuteLabel(range.endMinute)}`).join(' · ') : 'Indisponible' : 'Consulter mes horaires'}<br />Consultations de {doctor.consultationMinutes} minutes</small></span><ChevronRight size={18} /></button>{availability.error && <AuthNotice error>{availability.error}</AuthNotice>}<button type="button" className="day-edit-action" disabled={date < today || date > maxDate} onClick={() => setSheet(true)}>Modifier pour cette journée</button>{notice && <AuthNotice>{notice}</AuthNotice>}{error && <AuthNotice error>{error}</AuthNotice>}<ResourceState resource={resource} />{resource.data && <><ol className="planning-agenda">{resource.data.slots.map(slot => <li key={slot.id}><time>{formatTime(slot.startsAt, resource.data.timezone)}</time>{slot.appointment ? <button type="button" onClick={() => navigate(`/demandes/${slot.appointment.id}`)}><PersonAvatar name={personName(slot.appointment.patient)} avatarUrl={slot.appointment.patient.avatarUrl} /><span><strong>{personName(slot.appointment.patient)}</strong><small>{slot.appointment.reason || 'Rendez-vous confirmé'}</small></span></button> : <div className={slot.status === 'available' ? 'agenda-free' : 'agenda-blocked'}><span>{slot.status === 'available' ? 'Créneau disponible' : slot.status === 'blocked' ? 'Créneau indisponible' : 'Créneau occupé'}</span>{slot.status === 'available' && date >= today && <button type="button" aria-label={`Modifier la journée, créneau ${formatTime(slot.startsAt, doctor.timezone)}`} onClick={() => setSheet(true)}><Plus size={18} /></button>}</div>}</li>)}</ol>{!resource.data.slots.length && <EmptyState title="Aucun créneau ce jour" description="Configurez vos horaires ou ajoutez une plage exceptionnelle." />}<section className="exceptions-list"><h2 className="subheading">Exceptions de la journée</h2>{resource.data.exceptions.map(exception => <div key={exception.id}><span>{exceptionLabels[exception.type]}{exception.type !== 'BLOCK_DAY' && <small>{minuteLabel(exception.startMinute)} – {minuteLabel(exception.endMinute)}</small>}</span><Button variant="outline" disabled={date < today || busy} onClick={() => setRemove(exception)}>Supprimer</Button></div>)}{!resource.data.exceptions.length && <p className="field-hint">Aucune exception pour cette date.</p>}</section></>}
    <PlanningExceptionSheet key={date} open={sheet} onOpenChange={setSheet} date={date} consultationMinutes={doctor.consultationMinutes} onSaved={saved} /><Dialog open={Boolean(remove)} onOpenChange={value => { if (!busy && !value) setRemove(null); }}><DialogContent><DialogTitle>Supprimer cette exception ?</DialogTitle><DialogDescription>Les disponibilités seront recalculées selon vos horaires et les autres exceptions. Le serveur protège les demandes existantes.</DialogDescription><AuthButton disabled={busy} onClick={deleteException}>{busy ? 'Suppression…' : 'Supprimer l’exception'}</AuthButton><AuthButton variant="outline" disabled={busy} onClick={() => setRemove(null)}>Annuler</AuthButton></DialogContent></Dialog>
  </>;
}
export default function Planning() {
  const profile = useResource('/me/doctor-profile');
  return <><ResourceState resource={profile} />{profile.data?.doctorProfile && <PlanningCalendar doctor={profile.data.doctorProfile} />}</>;
}
