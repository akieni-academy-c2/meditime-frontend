// src/lib/data/mockAppointments.js
// Demandes fictives pour le développement frontend.
// À remplacer par l'API backend #9 quand elle sera prête.

const now = new Date();

function dateOffset(days, hours = 0, minutes = 0) {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

export const MOCK_APPOINTMENTS = [
  // En attente
  {
    id: 'apt-1',
    code: 'A7K2M9X4',
    doctorId: 'dr-sophie-martin',
    doctorName: 'Dr Sophie Martin',
    doctorSpecialty: 'Médecin généraliste',
    startAt: dateOffset(2, 14, 30),
    endAt: dateOffset(2, 14, 55),
    duration: 25,
    address: '12 Rue de la Roquette',
    city: 'Brazzaville',
    status: 'EN_ATTENTE',
    patient: {
      firstName: 'Claire',
      lastName: 'Dupont',
      phone: '06 12 34 56 78',
      email: 'claire.dupont@example.com',
    },
    motif: 'Bilan de santé',
    createdAt: dateOffset(0, 9, 15),
  },
  // Confirmé
  {
    id: 'apt-2',
    code: 'B3P8N5Q1',
    doctorId: 'dr-thomas-bernard',
    doctorName: 'Dr Thomas Bernard',
    doctorSpecialty: 'Pédiatre',
    startAt: dateOffset(5, 10, 0),
    endAt: dateOffset(5, 10, 30),
    duration: 30,
    address: '5 Avenue des Ternes',
    city: 'Brazzaville',
    status: 'CONFIRMEE',
    patient: {
      firstName: 'Claire',
      lastName: 'Dupont',
      phone: '06 12 34 56 78',
      email: 'claire.dupont@example.com',
    },
    motif: '',
    createdAt: dateOffset(-1, 16, 45),
  },
  // Refusé
  {
    id: 'apt-3',
    code: 'C9D4E7F2',
    doctorId: 'dr-camille-lefevre',
    doctorName: 'Dr Camille Lefèvre',
    doctorSpecialty: 'Cardiologue',
    startAt: dateOffset(-3, 9, 30),
    endAt: dateOffset(-3, 10, 10),
    duration: 40,
    address: 'Clinique Saint-Antoine',
    city: 'Pointe-Noire',
    status: 'REFUSEE',
    patient: {
      firstName: 'Claire',
      lastName: 'Dupont',
      phone: '06 12 34 56 78',
      email: 'claire.dupont@example.com',
    },
    motif: '',
    createdAt: dateOffset(-5, 11, 0),
  },
  // Passé
  {
    id: 'apt-4',
    code: 'D1A6B2C8',
    doctorId: 'dr-julien-moreau',
    doctorName: 'Dr Julien Moreau',
    doctorSpecialty: 'Dentiste',
    startAt: dateOffset(-10, 15, 0),
    endAt: dateOffset(-10, 15, 30),
    duration: 30,
    address: 'Cabinet du Centre',
    city: 'Brazzaville',
    status: 'PASSE',
    patient: {
      firstName: 'Claire',
      lastName: 'Dupont',
      phone: '06 12 34 56 78',
      email: 'claire.dupont@example.com',
    },
    motif: '',
    createdAt: dateOffset(-15, 8, 30),
  },
];

// Génère un code de suivi non devinable (8 caractères alphanumériques)
export function generateTrackingCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sans I, O, 0, 1 (confusion)
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}