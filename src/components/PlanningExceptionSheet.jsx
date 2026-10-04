import { useState } from 'react';
import { api } from '../lib/api.js';
import { parseMinute } from '../lib/planning.js';
import BottomSheet from './BottomSheet.jsx';
import { AuthButton, AuthNotice } from './AuthUI.jsx';
import { FormField, SelectField } from './FormsUI.jsx';

export default function PlanningExceptionSheet({ open, onOpenChange, date, consultationMinutes, onSaved }) {
  const [type, setType] = useState('ADD_INTERVAL');
  const [start, setStart] = useState('17:30');
  const [end, setEnd] = useState('19:00');
  const [duration, setDuration] = useState(String(consultationMinutes));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function save(event) {
    event.preventDefault(); if (busy) return;
    const body = { date, type };
    if (type !== 'BLOCK_DAY') {
      body.startMinute = parseMinute(start); body.endMinute = parseMinute(end);
      if (!Number.isFinite(body.startMinute) || !Number.isFinite(body.endMinute) || body.startMinute >= body.endMinute) { setError('Vérifiez les horaires : la fin doit suivre le début.'); return; }
    }
    if (type === 'ADD_INTERVAL') body.consultationMinutes = Number(duration);
    setBusy(true); setError('');
    try { await api('/me/doctor/exceptions', { method: 'POST', body }); onOpenChange(false); onSaved('La modification a été enregistrée.'); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  const durations = [...new Set([15, 25, 30, 45, 60, consultationMinutes])].sort((a, b) => a - b);
  return <BottomSheet open={open} onOpenChange={value => { if (!busy) { setError(''); onOpenChange(value); } }} title="Modifier pour cette journée" description={date} footer={<AuthButton disabled={busy} type="submit" form="planning-exception-form">{busy ? 'Enregistrement…' : 'Enregistrer la modification'}</AuthButton>}><form id="planning-exception-form" onSubmit={save}><fieldset disabled={busy} className="sheet-options"><legend>Modification</legend>{[['BLOCK_DAY', 'Rendre la journée indisponible'], ['ADD_INTERVAL', 'Ajouter une plage exceptionnelle'], ['BLOCK_INTERVAL', 'Retirer une plage de créneaux']].map(([value, label]) => <label key={value}><input type="radio" name="exception-type" checked={type === value} onChange={() => setType(value)} />{label}</label>)}{type !== 'BLOCK_DAY' && <div className="form-columns"><FormField label="Heure de début" type="time" required value={start} onChange={event => setStart(event.target.value)} /><FormField label="Heure de fin" required placeholder="19:00" inputMode="numeric" value={end} onChange={event => setEnd(event.target.value)} /></div>}{type === 'ADD_INTERVAL' && <SelectField label="Durée des consultations" value={duration} onValueChange={setDuration} options={durations.map(value => ({ value: String(value), label: `${value} minutes` }))} />}</fieldset>{type !== 'ADD_INTERVAL' && <p className="field-hint">Un blocage décline les demandes en attente concernées. Un rendez-vous confirmé empêche le blocage de son créneau.</p>}{error && <AuthNotice error>{error}</AuthNotice>}</form></BottomSheet>;
}
