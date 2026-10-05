import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { dateInZone, dateChoices, shiftDate } from '../lib/dates.js';
export function DateStrip({ selectedDate, onChange, timezone }) {
  const today = dateInZone(new Date(), timezone);
  const [weekStart, setWeekStart] = useState(selectedDate || today);
  function move(days) { const next = shiftDate(weekStart, days) < today ? today : shiftDate(weekStart, days); setWeekStart(next); onChange(next); }
  return <div className="consultation-dates">
    <button type="button" className="consultation-week" onClick={() => move(-5)} disabled={weekStart <= today} aria-label="Dates précédentes"><ChevronLeft size={18} /></button>
    <div className="consultation-days" role="tablist" aria-label="Date de consultation">{dateChoices(weekStart, 5).map(day => <button key={day.value} type="button" role="tab" aria-selected={day.value === selectedDate} className="consultation-day" disabled={day.value < today} onClick={() => onChange(day.value)}><span>{day.day}</span><strong>{day.date}</strong></button>)}</div>
    <button type="button" className="consultation-week" onClick={() => move(5)} disabled={shiftDate(weekStart, 5) > shiftDate(today, 49)} aria-label="Dates suivantes"><ChevronRight size={18} /></button>
  </div>;
}
