// src/lib/doctors.js
// Client API pour les médecins.
// Utilise le mock tant que le backend n'expose pas les routes.

import { api } from './api.js';
import { MOCK_DOCTORS, MOCK_SPECIALTIES, simulateDelay } from './data/mockDoctors.js';
import { MOCK_SLOTS } from './data/mockSlots.js';

// 👇 Passer à `false` quand le backend #6 sera prêt
const USE_MOCK = true;

/**
 * Récupère la liste des spécialités.
 * @returns {Promise<Array<{slug: string, label: string}>>}
 */
export async function getSpecialties() {
  if (USE_MOCK) {
    await simulateDelay(150);
    return MOCK_SPECIALTIES;
  }
  return api('/specialties');
}

/**
 * Recherche des médecins selon des critères.
 * @param {{ name?: string, specialty?: string, city?: string }} filters
 * @returns {Promise<Array>}
 */
export async function searchDoctors({ name = '', specialty = '', city = '' } = {}) {
  if (USE_MOCK) {
    await simulateDelay(300);
    return MOCK_DOCTORS.filter((doctor) => {
      const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
      const matchesName = !name || fullName.includes(name.toLowerCase());
      const matchesSpecialty = !specialty || doctor.specialty === specialty;
      const matchesCity = !city || doctor.city.toLowerCase().includes(city.toLowerCase());
      return matchesName && matchesSpecialty && matchesCity;
    });
  }

  const params = new URLSearchParams();
  if (name) params.set('name', name);
  if (specialty) params.set('specialty', specialty);
  if (city) params.set('city', city);

  const query = params.toString();
  return api(`/doctors${query ? `?${query}` : ''}`);
}

/**
 * Récupère un médecin par son ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getDoctorById(id) {
  if (USE_MOCK) {
    await simulateDelay(200);
    return MOCK_DOCTORS.find((doctor) => doctor.id === id) || null;
  }
  return api(`/doctors/${id}`);
}

/**
 * Récupère les créneaux disponibles d'un médecin.
 * @param {string} id
 * @returns {Promise<Array>}
 */
export async function getDoctorSlots(id) {
  if (USE_MOCK) {
    await simulateDelay(250);
    return MOCK_SLOTS;
  }
  return api(`/doctors/${id}/slots`);
}