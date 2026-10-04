import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';
import { api } from '../lib/api.js';
import { useResource } from '../lib/useResource.js';
import { minuteLabel, parseMinute, weekdays } from '../lib/planning.js';
import { PageHeader } from '../components/NavigationUI.jsx';
import { FormField, SelectField } from '../components/FormsUI.jsx';
import { AuthButton, AuthNotice } from '../components/AuthUI.jsx';
import { ScheduleDay } from '../components/SchedulingUI.jsx';
import { Button } from '../components/ui/button.jsx';
import ResourceState from '../components/ResourceState.jsx';

function WeeklyForm({ availability }) {
  const navigate = useNavigate();
  const { notifyDataChanged } = useAuth();
  const [days, setDays] = useState(() => weekdays.map((day, i) => {
    const ranges = availability.ranges.filter(range => range.weekday === i + 1).map(range => ({ start: minuteLabel(range.startMinute), end: minuteLabel(range.endMinute) }));
    return { day, enabled: ranges.length > 0, ranges };
  }));
  const [duration, setDuration] = useState(String(availability.consultationMinutes));
  const [savedDuration, setSavedDuration] = useState(availability.consultationMinutes);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const update = (index, value) => setDays(current => current.map((day, i) => i === index ? { ...day, ...value } : day));
  function changeRange(dayIndex, rangeIndex, key, value) {
    update(dayIndex, { ranges: days[dayIndex].ranges.map((range, i) => i === rangeIndex ? { ...range, [key]: value } : range) });
  }
  async function save(event) {
    event.preventDefault(); if (busy) return;
    const ranges = days.flatMap((day, i) => day.enabled ? day.ranges.map(range => ({ weekday: i + 1, startMinute: parseMinute(range.start), endMinute: parseMinute(range.end) })) : []);
    if (days.some(day => day.enabled && !day.ranges.length) || ranges.some(range => !Number.isFinite(range.startMinute) || !Number.isFinite(range.endMinute) || range.startMinute >= range.endMinute)) { setError('Chaque journée active doit avoir une plage valide, avec une fin après le début.'); return; }
    if (ranges.length > 28) { setError('Le planning accepte au maximum 28 plages par semaine.'); return; }
    setBusy(true); setError(''); let durationSaved = false;
    try {
      if (Number(duration) !== savedDuration) {
        await api('/me/doctor-profile', { method: 'PATCH', body: { consultationMinutes: Number(duration) } });
        setSavedDuration(Number(duration)); durationSaved = true;
      }
      await api('/me/doctor/availability', { method: 'PUT', body: { ranges } });
      notifyDataChanged(); navigate('/planning');
    } catch (err) { setError(`${durationSaved ? 'La durée a été enregistrée, mais les horaires n’ont pas pu être enregistrés. ' : ''}${err.message}`); }
    finally { setBusy(false); }
  }
  const durations = Array.from(new Set([15, 25, 30, 45, 60, availability.consultationMinutes])).sort((a, b) => a - b);
  return <form onSubmit={save}><h2 className="subheading">Disponibilités récurrentes</h2><p className="page-intro">Définissez vos horaires de consultation chaque semaine. Fuseau du cabinet : {availability.timezone}.</p><fieldset disabled={busy}><SelectField label="Durée d’une consultation" value={duration} onValueChange={setDuration} options={durations.map(value => ({ value: String(value), label: `${value} minutes` }))} /><div className="weekly-days">{days.map((day, i) => <ScheduleDay key={day.day} day={day.day} enabled={day.enabled} onEnabledChange={enabled => update(i, { enabled })}>{day.enabled && <div className="weekly-ranges">{day.ranges.map((range, j) => <div className="range-editor" key={j}><FormField label={`Début ${day.day} ${j + 1}`} type="time" required value={range.start} onChange={event => changeRange(i, j, 'start', event.target.value)} /><FormField label={`Fin ${day.day} ${j + 1}`} required placeholder="17:00" inputMode="numeric" value={range.end} onChange={event => changeRange(i, j, 'end', event.target.value)} /><Button variant="ghost" type="button" aria-label={`Supprimer la plage ${j + 1} du ${day.day}`} onClick={() => update(i, { ranges: day.ranges.filter((_, index) => index !== j) })}><Trash2 size={18} /></Button></div>)}<Button variant="outline" type="button" onClick={() => update(i, { ranges: [...day.ranges, { start: '09:00', end: '12:00' }] })}><Plus size={18} />Ajouter une plage</Button></div>}</ScheduleDay>)}</div></fieldset><p className="field-hint">Les changements ne doivent pas déplacer une demande existante. Une durée différente peut être refusée si des créneaux futurs existent. La fin de journée peut être saisie comme 24:00.</p>{error && <AuthNotice error>{error}</AuthNotice>}<AuthButton disabled={busy} type="submit">{busy ? 'Enregistrement…' : 'Enregistrer les disponibilités'}</AuthButton></form>;
}
export default function WeeklyPlanning() {
  const navigate = useNavigate();
  const resource = useResource('/me/doctor/availability');
  return <><PageHeader title="Configurer mon planning" onBack={() => navigate('/planning')} /><ResourceState resource={resource} />{resource.data && <WeeklyForm availability={resource.data} />}</>;
}
