// src/lib/appointments.js
// Client API pour les demandes de rendez-vous.
// Utilise le mock tant que le backend n'expose pas les routes.

import { api } from './api.js';
import {
  MOCK_APPOINTMENTS,
  generateTrackingCode,
} from './data/mockAppointments.js';
import { simulateDelay } from './data/mockDoctors.js';

// 👇 Passer à `false` quand le backend #9 sera prêt
const USE_MOCK = true;

// Stockage en mémoire pour simuler la persistance entre les appels
// (perdu au rechargement de la page — c'est OK pour le mock)
let appointmentsStore = [...MOCK_APPOINTMENTS];

/**
 * Crée une nouvelle demande de rendez-vous.
 * @param {{ doctorId: string, slotId: string, patient: object, motif?: string }} payload
 * @returns {Promise<object>} La demande créée avec son code de suivi
 */
export async function createAppointment(payload) {
  if (USE_MOCK) {
    await simulateDelay(400);

    const code = generateTrackingCode();
    const newAppointment = {
      id: `apt-${Date.now()}`,
      code,
      doctorId: payload.doctorId,
      doctorName: payload.doctorName || 'Médecin',
      doctorSpecialty: payload.doctorSpecialty || '',
      startAt: payload.startAt,
      endAt: payload.endAt,
      duration: payload.duration || 30,
      address: payload.address || '',
      city: payload.city || '',
      status: 'EN_ATTENTE',
      patient: payload.patient,
      motif: payload.motif || '',
      createdAt: new Date().toISOString(),
    };

    appointmentsStore = [newAppointment, ...appointmentsStore];
    return newAppointment;
  }

  return api('/appointments', {
    method: 'POST',
    body: payload,
  });
}

/**
 * Récupère la liste des demandes du patient connecté.
 * @returns {Promise<Array>}
 */
export async function listAppointments() {
  if (USE_MOCK) {
    await simulateDelay(300);
    return [...appointmentsStore];
  }
  return api('/appointments');
}

/**
 * Récupère une demande par son code de suivi + téléphone.
 * @param {string} code
 * @param {string} phone
 * @returns {Promise<object|null>}
 */
export async function getAppointmentByCode(code, phone) {
  if (USE_MOCK) {
    await simulateDelay(300);
    const normalizedCode = (code || '').trim().toUpperCase();
    const normalizedPhone = (phone || '').replace(/\s/g, '');
    return (
      appointmentsStore.find(
        (apt) =>
          apt.code.toUpperCase() === normalizedCode &&
          apt.patient.phone.replace(/\s/g, '') === normalizedPhone
      ) || null
    );
  }

  const params = new URLSearchParams({ code, phone });
  return api(`/appointments/track?${params}`);
}

/**
 * Réinitialise le store mock (utile pour les tests).
 */
export function resetMockAppointments() {
  appointmentsStore = [...MOCK_APPOINTMENTS];
}