// src/components/SlotPicker.jsx
// Grille de créneaux horaires disponibles pour une date donnée.

import { EmptyState } from './States.jsx';

function formatTime(isoDate) {
  return new Date(isoDate).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function SlotPicker({ slots, selectedDate, selectedSlot, onSelect }) {
  const daySlots = slots
    .filter((slot) => isSameDay(new Date(slot.startAt), selectedDate))
    .sort((a, b) => new Date(a.startAt) - new Date(b.startAt));

  if (daySlots.length === 0) {
    return (
      <EmptyState
        title="Aucun créneau disponible"
        description="Essayez une autre date dans le calendrier."
      />
    );
  }

  return (
    <div className="slot-grid" role="list">
      {daySlots.map((slot) => {
        const isSelected = selectedSlot?.id === slot.id;
        return (
          <button
            key={slot.id}
            type="button"
            role="listitem"
            className="slot-button"
            data-selected={isSelected}
            disabled={!slot.available}
            onClick={() => onSelect(slot)}
            aria-pressed={isSelected}
            aria-label={`Créneau ${formatTime(slot.startAt)} à ${formatTime(slot.endAt)}`}
          >
            {formatTime(slot.startAt)}
          </button>
        );
      })}
    </div>
  );
}