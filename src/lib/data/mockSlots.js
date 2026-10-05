// src/lib/data/mockSlots.js
// Données fictives de créneaux pour le développement frontend.
// À remplacer par l'API backend #7 quand elle sera prête.

// Génère des créneaux pour les 7 prochains jours à partir d'aujourd'hui
export function generateMockSlots() {
  const slots = [];
  const now = new Date();
  const DURATIONS = [30, 30, 30, 45]; // durées variées pour simuler

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const day = new Date(now);
    day.setDate(now.getDate() + dayOffset);
    day.setHours(0, 0, 0, 0);

    // Horaires d'ouverture du cabinet : 9h - 12h, 14h - 17h
    const hours = [
      { start: 9, end: 12 },
      { start: 14, end: 17 },
    ];

    hours.forEach(({ start, end }, blockIndex) => {
      let cursor = new Date(day);
      cursor.setHours(start, 0, 0, 0);

      let slotIndex = 0;
      while (cursor.getHours() < end) {
        const duration = DURATIONS[slotIndex % DURATIONS.length];
        const slotEnd = new Date(cursor.getTime() + duration * 60 * 1000);

        // Simuler des créneaux déjà pris (30% de chance)
        const taken = (dayOffset * 7 + blockIndex * 3 + slotIndex) % 3 === 0;

        slots.push({
          id: `${day.toISOString().slice(0, 10)}-${cursor.toISOString().slice(11, 16)}`,
          startAt: cursor.toISOString(),
          endAt: slotEnd.toISOString(),
          duration,
          available: !taken,
        });

        cursor = slotEnd;
        slotIndex++;
      }
    });
  }

  return slots;
}

export const MOCK_SLOTS = generateMockSlots();