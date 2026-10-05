import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Clock, Info, ChevronRight } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';
import { api } from '../lib/api.js';
import { useResource } from '../lib/useResource.js';
import { minuteLabel, parseMinute, weekdays } from '../lib/planning.js';
import { PageHeader } from '../components/NavigationUI.jsx';
import { FormField, NativeSelectField } from '../components/FormsUI.jsx';
import { AuthButton, AuthNotice } from '../components/AuthUI.jsx';
import { Switch } from '../components/ui/switch.jsx';
import BottomSheet from '../components/BottomSheet.jsx';
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
  const [editing, setEditing] = useState(null);
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
  return <><form className="weekly-form" onSubmit={save}><h2 className="subheading">Disponibilités récurrentes</h2><p className="page-intro">Définissez vos horaires de consultation chaque semaine.</p><fieldset disabled={busy}><div className="duration-setting"><Clock size={21} /><NativeSelectField label="Durée d’une consultation" value={duration} onChange={event => setDuration(event.target.value)} options={durations.map(value => ({ value: String(value), label: `${value} minutes` }))} /></div><div className="weekly-summary">{days.map((day, i) => <div className="weekly-summary-day" key={day.day}><strong>{day.day}</strong><Switch checked={day.enabled} onCheckedChange={enabled => update(i, { enabled, ranges: enabled && !day.ranges.length ? [{ start: '09:00', end: '12:00' }] : day.ranges })} aria-label={`Disponibilités du ${day.day.toLowerCase()}`} /><button type="button" className="weekly-times" onClick={() => setEditing(i)} aria-label={`Modifier les horaires du ${day.day}`}><span>{day.enabled ? day.ranges.map((range, j) => <span className="time-chip" key={j}>{range.start} – {range.end}</span>) : 'Indisponible'}</span>{day.enabled ? <Plus size={16} /> : <ChevronRight size={16} />}</button></div>)}</div></fieldset><p className="planning-note"><Info size={18} /><span>Vous pouvez modifier une journée ponctuellement depuis votre planning. Heures du cabinet : {availability.timezone}.</span></p>{error && <AuthNotice error>{error}</AuthNotice>}<AuthButton disabled={busy} type="submit">{busy ? 'Enregistrement…' : 'Enregistrer les disponibilités'}</AuthButton></form>
    <BottomSheet open={editing !== null} onOpenChange={open => { if (!open) setEditing(null); }} title={editing !== null ? `Horaires du ${days[editing].day.toLowerCase()}` : 'Horaires'} description="Ces plages seront enregistrées avec votre planning hebdomadaire." footer={<AuthButton type="button" onClick={() => setEditing(null)}>Terminer</AuthButton>}>
      {editing !== null && <div className="weekly-range-editor">{days[editing].ranges.map((range, j) => <div className="range-editor" key={j}><FormField label={`Début ${j + 1}`} type="time" value={range.start} onChange={event => changeRange(editing, j, 'start', event.target.value)} /><FormField label={`Fin ${j + 1}`} placeholder="17:00" inputMode="numeric" value={range.end} onChange={event => changeRange(editing, j, 'end', event.target.value)} /><Button variant="ghost" type="button" aria-label={`Supprimer la plage ${j + 1}`} onClick={() => update(editing, { ranges: days[editing].ranges.filter((_, index) => index !== j) })}><Trash2 size={18} /></Button></div>)}<Button variant="outline" type="button" onClick={() => update(editing, { enabled: true, ranges: [...days[editing].ranges, { start: '09:00', end: '12:00' }] })}><Plus size={18} />Ajouter une plage</Button><p className="field-hint">Pour une fin à minuit, saisissez 24:00.</p></div>}
    </BottomSheet></>;
}
export default function WeeklyPlanning() {
  const navigate = useNavigate();
  const resource = useResource('/me/doctor/availability');
  return <><PageHeader title="Configurer mon planning" fallback="/planning" /><ResourceState resource={resource} />{resource.data && <WeeklyForm availability={resource.data} />}</>;
}
