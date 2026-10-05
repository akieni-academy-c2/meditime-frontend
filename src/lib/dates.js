export const defaultZone = 'Africa/Brazzaville';
export function dateInZone(value = new Date(), timezone = defaultZone) {
  const parts = new Intl.DateTimeFormat('en', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(value));
  const part = type => parts.find(item => item.type === type).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}
export function formatDate(value, timezone = defaultZone) {
  return new Intl.DateTimeFormat('fr', { timeZone: timezone, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value));
}
export function formatTime(value, timezone = defaultZone) {
  return new Intl.DateTimeFormat('fr', { timeZone: timezone, hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}
export function formatCompactDate(value, timezone = defaultZone) {
  const date = new Date(value);
  const sameYear = dateInZone(date, timezone).slice(0, 4) === dateInZone(new Date(), timezone).slice(0, 4);
  return new Intl.DateTimeFormat('fr', { timeZone: timezone, weekday: 'short', day: 'numeric', month: 'short', ...(sameYear ? {} : { year: 'numeric' }) }).format(date);
}
export function shiftDate(date, days) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}
export function dateChoices(from, count = 7) {
  return Array.from({ length: count }, (_, i) => {
    const value = shiftDate(from, i);
    const instant = `${value}T12:00:00Z`;
    return { value, day: new Intl.DateTimeFormat('fr', { weekday: 'short', timeZone: 'UTC' }).format(new Date(instant)), date: new Intl.DateTimeFormat('fr', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(instant)), label: formatDate(instant, 'UTC') };
  });
}
export const personName = user => [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Nom non renseigné';
