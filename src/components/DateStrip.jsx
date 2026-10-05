import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { dateInZone, dateChoices, shiftDate } from '../lib/dates.js';
export function DateStrip({ selectedDate, onChange, timezone }) {
  const today = dateInZone(new Date(), timezone);
  const lastDate = shiftDate(today, 55);
  const [weekStart, setWeekStart] = useState(() => {
    const date = selectedDate || today;
    const weekday = (new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7;
    return shiftDate(date, -weekday);
  });
  function move(days) { const next = shiftDate(weekStart, days); setWeekStart(next); onChange(next < today ? today : next); }
  return <div className="consultation-dates">
    <button type="button" className="consultation-week" onClick={() => move(-7)} disabled={weekStart <= today} aria-label="Semaine précédente"><ChevronLeft size={18} /></button>
    <div className="consultation-days" role="tablist" aria-label="Date de consultation">{dateChoices(weekStart, 7).map(day => <button key={day.value} type="button" role="tab" aria-selected={day.value === selectedDate} className="consultation-day" disabled={day.value < today || day.value > lastDate} onClick={() => onChange(day.value)}><span>{day.day}</span><strong>{day.date}</strong></button>)}</div>
    <button type="button" className="consultation-week" onClick={() => move(7)} disabled={shiftDate(weekStart, 7) > lastDate} aria-label="Semaine suivante"><ChevronRight size={18} /></button>
  </div>;
}
