// src/lib/data/mockDoctors.js
// Données fictives pour le développement frontend.
// À remplacer par de vrais appels API quand le backend #6 sera prêt.
// Source : maquettes MediTime + scénario de démo.

export const MOCK_SPECIALTIES = [
  { slug: 'generaliste', label: 'Généraliste' },
  { slug: 'dermatologue', label: 'Dermatologue' },
  { slug: 'pediatre', label: 'Pédiatre' },
  { slug: 'cardiologue', label: 'Cardiologue' },
  { slug: 'dentiste', label: 'Dentiste' },
  { slug: 'gynecologue', label: 'Gynécologue' },
];

export const MOCK_DOCTORS = [
  {
    id: 'dr-sophie-martin',
    firstName: 'Sophie',
    lastName: 'Martin',
    specialty: 'generaliste',
    specialtyLabel: 'Médecin généraliste',
    city: 'Brazzaville',
    address: '12 Rue de la Roquette',
    consultationDuration: 25,
    photoUrl: null,
    nextAvailableAt: '2026-05-14T14:30:00.000Z',
  },
  {
    id: 'dr-thomas-bernard',
    firstName: 'Thomas',
    lastName: 'Bernard',
    specialty: 'pediatre',
    specialtyLabel: 'Pédiatre',
    city: 'Brazzaville',
    address: '5 Avenue des Ternes',
    consultationDuration: 30,
    photoUrl: null,
    nextAvailableAt: '2026-05-14T16:00:00.000Z',
  },
  {
    id: 'dr-camille-lefevre',
    firstName: 'Camille',
    lastName: 'Lefèvre',
    specialty: 'cardiologue',
    specialtyLabel: 'Cardiologue',
    city: 'Pointe-Noire',
    address: 'Clinique Saint-Antoine',
    consultationDuration: 40,
    photoUrl: null,
    nextAvailableAt: '2026-05-15T09:00:00.000Z',
  },
  {
    id: 'dr-julien-moreau',
    firstName: 'Julien',
    lastName: 'Moreau',
    specialty: 'dentiste',
    specialtyLabel: 'Dentiste',
    city: 'Brazzaville',
    address: 'Cabinet du Centre',
    consultationDuration: 30,
    photoUrl: null,
    nextAvailableAt: '2026-05-15T10:30:00.000Z',
  },
  {
    id: 'dr-emilie-dubois',
    firstName: 'Émilie',
    lastName: 'Dubois',
    specialty: 'dermatologue',
    specialtyLabel: 'Dermatologue',
    city: 'Brazzaville',
    address: '24 Rue des Lilas',
    consultationDuration: 20,
    photoUrl: null,
    nextAvailableAt: '2026-05-16T11:00:00.000Z',
  },
  {
    id: 'dr-nadege-itoua',
    firstName: 'Nadège',
    lastName: 'Itoua',
    specialty: 'gynecologue',
    specialtyLabel: 'Gynécologue',
    city: 'Pointe-Noire',
    address: 'Cabinet Maternité',
    consultationDuration: 45,
    photoUrl: null,
    nextAvailableAt: null,
  },
];

// Simulation d'un délai réseau (300 ms) pour tester les états de chargement
export function simulateDelay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}