import { api, ApiError } from './api.js';
const payload = response => response.data ?? response;
export function doctorForView(doctor) {
  const user = doctor.user || doctor;
  return { ...doctor, firstName: user.firstName, lastName: user.lastName,
    photoUrl: user.avatarUrl || doctor.avatarUrl || doctor.photoUrl,
    specialtyLabel: doctor.specialty?.name, consultationDuration: doctor.consultationMinutes,
    nextAvailableAt: doctor.nextAvailableSlot?.startsAt };
}
export async function getSpecialties({ signal } = {}) {
  const data = payload(await api('/specialties', { signal }));
  if (!Array.isArray(data.specialties)) throw new ApiError('La liste des spécialités est illisible.', 200, 'INVALID_RESPONSE');
  return data.specialties;
}
export async function searchDoctors({ name = '', specialtyId = '', city = '', page = 1, limit = 12, signal } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (name.trim()) params.set('q', name.trim());
  if (specialtyId) params.set('specialtyId', specialtyId);
  if (city.trim()) params.set('city', city.trim());
  const data = payload(await api('/doctors?' + params, { signal }));
  if (!Array.isArray(data.doctors) || !data.pagination) throw new ApiError('Les résultats de recherche sont illisibles.', 200, 'INVALID_RESPONSE');
  return { ...data, doctors: data.doctors.map(doctorForView) };
}
export async function getDoctorById(id, { signal } = {}) {
  const data = payload(await api('/doctors/' + encodeURIComponent(id), { signal }));
  if (!data.doctor) throw new ApiError('Le profil médecin est illisible.', 200, 'INVALID_RESPONSE');
  return doctorForView(data.doctor);
}
export async function getDoctorSlots(id, { from, to, signal } = {}) {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  const data = payload(await api('/doctors/' + encodeURIComponent(id) + '/slots?' + params, { signal }));
  if (!Array.isArray(data.slots) || !data.timezone) throw new ApiError('Les créneaux du médecin sont illisibles.', 200, 'INVALID_RESPONSE');
  return data;
}
