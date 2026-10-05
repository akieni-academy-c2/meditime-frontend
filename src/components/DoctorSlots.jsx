import { useEffect, useState } from 'react';
import { useResource } from '../lib/useResource.js';
import { dateChoices, dateInZone, formatTime, shiftDate } from '../lib/dates.js';
import { DateStrip, SlotPicker } from './SchedulingUI.jsx';
import { FormField } from './FormsUI.jsx';
import { EmptyState } from './CardsUI.jsx';
import { AuthButton } from './AuthUI.jsx';
import ResourceState from './ResourceState.jsx';

export default function DoctorSlots({ doctor, initialSlotId, initialDate, onChoose, onSelectionChange, actionLabel = 'Demander un rendez-vous' }) {
  const [date, setDate] = useState(() => initialDate || dateInZone(new Date(), doctor.timezone));
  const [selected, setSelected] = useState(initialSlotId || '');
  const slots = useResource(`/doctors/${doctor.id}/slots?from=${date}&to=${date}`);
  const available = slots.data?.slots || [];
  const selection = !slots.loading && available.find(slot => slot.id === selected && slot.status === 'available');
  useEffect(() => { onSelectionChange?.(selection || null); }, [selection, onSelectionChange]);
  const timezone = slots.data?.timezone || doctor.timezone;
  const maxDate = shiftDate(dateInZone(new Date(), doctor.timezone), 55);
  function changeDate(value) { setDate(value); setSelected(''); }
  return <section className="slots-section"><h2>Choisir une date</h2><FormField label="Date de consultation" type="date" min={dateInZone(new Date(), doctor.timezone)} max={shiftDate(dateInZone(new Date(), doctor.timezone), 55)} value={date} onChange={event => { if (event.target.value) changeDate(event.target.value); }} /><DateStrip dates={dateChoices(date).filter(day => day.value <= maxDate)} value={date} onChange={changeDate} /><h2>Créneaux disponibles</h2><p className="field-hint">Heures du cabinet · {timezone}</p><ResourceState resource={slots} />{slots.data && <><SlotPicker slots={available.map(slot => ({ value: slot.id, label: formatTime(slot.startsAt, timezone), disabled: slot.status !== 'available' }))} value={selected} onChange={setSelected} />{!available.length && <EmptyState title="Aucun créneau ce jour" description="Choisissez une autre date." />}</>}{onChoose && <AuthButton disabled={!selection} onClick={() => onChoose(selection)}>{actionLabel}</AuthButton>}</section>;
}
