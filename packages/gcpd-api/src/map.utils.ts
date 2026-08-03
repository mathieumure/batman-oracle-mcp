import type { Crime } from '@batman/data/crimes.js';

type Coordinates = { lat: number; lng: number };

export async function geocodeCity(city: string): Promise<Coordinates | undefined> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'batman-oracle-mcp (conference talk demo)' },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return undefined;

    const results = (await response.json()) as Array<{ lat: string; lon: string }>;
    const first = results[0];

    if (!first) return undefined;

    return { lat: parseFloat(first.lat), lng: parseFloat(first.lon) };
  } catch {
    return undefined;
  }
}

function referenceCenterFromCrimes(crimes: Crime[]): Coordinates {
  const sum = crimes.reduce(
    (acc, crime) => ({
      lat: acc.lat + crime.location.lat,
      lng: acc.lng + crime.location.lng,
    }),
    { lat: 0, lng: 0 },
  );
  return { lat: sum.lat / crimes.length, lng: sum.lng / crimes.length };
}

export function translateCrimesToCenter(crimes: Crime[], targetCenter: Coordinates): Crime[] {
  if (crimes.length === 0) {
    return [];
  }
  const reference = referenceCenterFromCrimes(crimes);
  const deltaLat = targetCenter.lat - reference.lat;
  const deltaLng = targetCenter.lng - reference.lng;
  return crimes.map((crime) => ({
    ...crime,
    location: {
      lat: crime.location.lat + deltaLat,
      lng: crime.location.lng + deltaLng,
    },
  }));
}
