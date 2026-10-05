import { EmptyState } from './States.jsx';
import { dateInZone, formatTime } from '../lib/dates.js';
export function SlotPicker({ slots, selectedDate, selectedSlot, onSelect, timezone }) {
  const daySlots = slots.filter(slot => dateInZone(slot.startsAt, timezone) === selectedDate).sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
  if (!daySlots.length) return <EmptyState title="Aucun créneau disponible" description="Essayez une autre date dans le calendrier." />;
  return <div className="slot-grid">{daySlots.map(slot => <button key={slot.id} type="button" className="slot-button" data-selected={selectedSlot?.id === slot.id} disabled={slot.status !== 'available'} onClick={() => onSelect(slot)} aria-pressed={selectedSlot?.id === slot.id} aria-label={'Créneau ' + formatTime(slot.startsAt, timezone) + ' à ' + formatTime(slot.endsAt, timezone)}>{formatTime(slot.startsAt, timezone)}</button>)}</div>;
}
