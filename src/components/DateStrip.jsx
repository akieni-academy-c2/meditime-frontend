// src/components/DateStrip.jsx
// Carrousel horizontal de dates (7 jours visibles).

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const JOURS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  result.setHours(0, 0, 0, 0);
  return result;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function DateStrip({ selectedDate, onChange }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fenêtre de 7 jours à partir du dimanche de la semaine actuelle
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date(today);
    d.setDate(d.getDate() - d.getDay()); // ramène au dimanche
    return d;
  });

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const canGoPrev = weekStart > today;
  const canGoNext = addDays(weekStart, 7) <= addDays(today, 56); // 8 semaines

  return (
    <div className="date-strip">
      <button
        type="button"
        className="date-strip-nav"
        onClick={() => setWeekStart(addDays(weekStart, -7))}
        disabled={!canGoPrev}
        aria-label="Semaine précédente"
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>

      <div className="date-strip-days" role="tablist">
        {days.map((day) => {
          const isPast = day < today;
          const isSelected = isSameDay(day, selectedDate);
          return (
            <button
              key={day.toISOString()}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className="date-strip-day"
              data-selected={isSelected}
              disabled={isPast}
              onClick={() => onChange(day)}
            >
              <span className="date-strip-day-name">{JOURS[day.getDay()]}</span>
              <span className="date-strip-day-number">{day.getDate()}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="date-strip-nav"
        onClick={() => setWeekStart(addDays(weekStart, 7))}
        disabled={!canGoNext}
        aria-label="Semaine suivante"
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </div>
  );
}