import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { dateInZone, dateChoices, shiftDate } from '../lib/dates.js';
export function DateStrip({ selectedDate, onChange, timezone }) {
  const today = dateInZone(new Date(), timezone);
  const [weekStart, setWeekStart] = useState(today);
  return <div className="date-strip">
    <button type="button" className="date-strip-nav" onClick={() => setWeekStart(shiftDate(weekStart, -7))} disabled={weekStart <= today} aria-label="Semaine précédente"><ChevronLeft size={18} /></button>
    <div className="date-strip-days" role="tablist" aria-label="Date de consultation">{dateChoices(weekStart).map(day => <button key={day.value} type="button" role="tab" aria-selected={day.value === selectedDate} className="date-strip-day" data-selected={day.value === selectedDate} disabled={day.value < today} onClick={() => onChange(day.value)}><span className="date-strip-day-name">{day.day}</span><span className="date-strip-day-number">{Number(day.value.slice(-2))}</span></button>)}</div>
    <button type="button" className="date-strip-nav" onClick={() => setWeekStart(shiftDate(weekStart, 7))} disabled={shiftDate(weekStart, 7) > shiftDate(today, 49)} aria-label="Semaine suivante"><ChevronRight size={18} /></button>
  </div>;
}
