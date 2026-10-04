export const weekdays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
export const minuteLabel = minute => `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;
export function parseMinute(value) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$|^24:00$/.test(value)) return NaN;
  const [hour, minute] = value.split(':').map(Number);
  return hour * 60 + minute;
}
export const exceptionLabels = { BLOCK_DAY: 'Journée indisponible', BLOCK_INTERVAL: 'Plage indisponible', ADD_INTERVAL: 'Plage exceptionnelle' };
