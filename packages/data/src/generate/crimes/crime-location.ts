import type { CrimeLocation } from './crime.js';

export const geocodeCity = async (city: string): Promise<CrimeLocation> => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'batman-oracle-mcp (crimes dataset generator)' },
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`Nominatim request failed with status ${response.status}`);
  }

  const results = (await response.json()) as Array<{ lat: string; lon: string }>;
  const first = results[0];
  if (!first) {
    throw new Error(`City "${city}" could not be geocoded`);
  }

  return { lat: parseFloat(first.lat), lng: parseFloat(first.lon) };
};

export const randomOffset = (center: CrimeLocation, maxRadiusMeters: number): CrimeLocation => {
  const radius = Math.random() * maxRadiusMeters;
  const angle = Math.random() * 2 * Math.PI;
  const dLat = (radius * Math.cos(angle)) / 111320;
  const dLng = (radius * Math.sin(angle)) / (111320 * Math.cos((center.lat * Math.PI) / 180));

  return { lat: center.lat + dLat, lng: center.lng + dLng };
};
