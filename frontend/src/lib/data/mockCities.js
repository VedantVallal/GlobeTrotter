import citiesData from './citiesData.json';

// Classic ID Aliases for backwards compatibility with initial seed trips
const ID_ALIASES = {
  'city-001': 'Goa',
  'city-002': 'Paris',
  'city-003': 'Tokyo',
  'city-004': 'Santorini',
  'city-005': 'Dubai',
  'city-006': 'Kyoto',
  'city-007': 'Bali (Ubud / Seminyak)',
  'city-008': 'Barcelona',
};

// Map all 276 famous cities
export const mockCities = citiesData.map((c) => {
  // Check if this city matches any legacy alias
  for (const [legacyId, aliasName] of Object.entries(ID_ALIASES)) {
    if (c.name.toLowerCase() === aliasName.toLowerCase() || c.name.toLowerCase().includes(aliasName.toLowerCase())) {
      return {
        ...c,
        legacyId,
      };
    }
  }
  return c;
});

// Fast lookup maps
export const citiesById = new Map();
export const citiesByName = new Map();

for (const city of mockCities) {
  citiesById.set(city.id, city);
  citiesByName.set(city.name.toLowerCase(), city);
  if (city.legacyId) {
    citiesById.set(city.legacyId, city);
  }
}

export function getCity(idOrName) {
  if (!idOrName) return null;
  const lower = String(idOrName).toLowerCase();
  return citiesById.get(idOrName) || citiesByName.get(lower) || null;
}
