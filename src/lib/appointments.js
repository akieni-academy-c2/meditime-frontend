import { api, ApiError } from './api.js';
const payload = response => response.data ?? response;
export async function createAppointment({ slotId, reason }) {
  const data = payload(await api('/appointments', { method: 'POST', body: { slotId, ...(reason?.trim() && { reason: reason.trim() }) } }));
  if (!data.appointment) throw new ApiError('La réponse ne contient pas la demande enregistrée.', 200, 'INVALID_RESPONSE');
  return data.appointment;
}
export async function listAppointments({ status = 'pending', page = 1, limit = 12, signal } = {}) {
  const data = payload(await api('/me/appointments?' + new URLSearchParams({ status, page, limit }), { signal }));
  if (!Array.isArray(data.appointments) || !data.pagination) throw new ApiError('La liste des demandes est illisible.', 200, 'INVALID_RESPONSE');
  return data;
}
export async function getAppointment(id, { signal } = {}) {
  const data = payload(await api('/appointments/' + encodeURIComponent(id), { signal }));
  if (!data.appointment) throw new ApiError('Le détail de la demande est illisible.', 200, 'INVALID_RESPONSE');
  return data.appointment;
}
