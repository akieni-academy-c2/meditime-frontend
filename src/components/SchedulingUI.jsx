import { Clock, Check, X, CalendarDays } from 'lucide-react';
import { Switch } from './ui/switch.jsx';

const statuses = { pending: ['En attente', Clock], confirmed: ['Confirmé', Check], declined: ['Décliné', X], past: ['Passé', Check], available: ['Disponible', CalendarDays] };
export function StatusBadge({ status }) {
  const [label, Icon] = statuses[status] || statuses.pending;
  return <span className={`status-badge status-${status}`}><Icon size={14} aria-hidden="true" />{label}</span>;
}

export function DateStrip({ dates, value, onChange }) {
  return <div className="date-strip" role="group" aria-label="Choisir une date">{dates.map(date => <button type="button" key={date.value} aria-label={date.label} aria-pressed={value === date.value} onClick={() => onChange(date.value)}><span>{date.day}</span><strong>{date.date}</strong></button>)}</div>;
}

export function SlotPicker({ slots, value, onChange }) {
  return <div className="slot-grid" role="group" aria-label="Choisir un créneau">{slots.map(slot => <button type="button" key={slot.value} disabled={slot.disabled} aria-pressed={value === slot.value} onClick={() => onChange(slot.value)}>{slot.label}</button>)}</div>;
}

export function ScheduleDay({ day, enabled, onEnabledChange, children }) {
  return <div className="schedule-day"><strong>{day}</strong><Switch checked={enabled} onCheckedChange={onEnabledChange} aria-label={`Disponibilités du ${day.toLowerCase()}`} />{enabled ? <div>{children}</div> : <span>Indisponible</span>}</div>;
}

export function AgendaList({ entries, onSelect }) {
  return <ol className="agenda-list">{entries.map(entry => <li key={entry.id}><time>{entry.time}</time><button type="button" className={entry.available ? 'agenda-available' : ''} onClick={() => onSelect(entry)}><strong>{entry.title}</strong>{entry.description && <small>{entry.description}</small>}</button></li>)}</ol>;
}

export function FilterChips({ options, value, onChange, label = 'Filtrer' }) {
  return <div className="filter-chips" role="group" aria-label={label}>{options.map(option => <button type="button" key={option.value} aria-pressed={value === option.value} onClick={() => onChange(option.value)}>{option.label}</button>)}</div>;
}
