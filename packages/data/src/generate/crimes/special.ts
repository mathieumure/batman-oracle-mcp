import type { Crime, CrimeLocation } from './crime.js';
import { geocodeCity } from './crime-location.js';
import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';

const BASE_CRIME: Crime = {
  suspect: null,
  id: '',
  location: {
    lat: 0,
    lng: 0,
  },
  occurredAt: '',
  forensics: {
    molecules: ['Joker Venom', 'Clayface Compound', 'Man-Bat Serum', "Bane's Venom", "Ivy's Pheromones", 'Freeze Cryo-Serum'],
    fingerprints: [],
  },
} as const;

const parsePath = (pathData: string): [number, number][] => {
  const tokens = pathData.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) ?? [];
  let index = 0;
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;
  const points: [number, number][] = [];
  const readNumber = () => parseFloat(tokens[index++]);
  while (index < tokens.length) {
    const command = tokens[index++].toUpperCase();
    if (command === 'Z') {
      x = startX;
      y = startY;
      points.push([x, y]);
      continue;
    }
    if (command === 'M') {
      x = readNumber();
      y = readNumber();
      startX = x;
      startY = y;
      points.push([x, y]);
    } else if (command === 'L') {
      x = readNumber();
      y = readNumber();
      points.push([x, y]);
    } else if (command === 'H') {
      x = readNumber();
      points.push([x, y]);
    } else if (command === 'V') {
      y = readNumber();
      points.push([x, y]);
    }
  }
  return points;
};

const svgToLocation = (x: number, y: number, mapCenter: CrimeLocation, viewBox: number): CrimeLocation => {
  const viewBoxHalf = viewBox / 2;
  const metersPerUnit = 4000 / viewBoxHalf;
  const dx = x - viewBoxHalf;
  const dy = y - viewBoxHalf;
  const dLat = (-dy * metersPerUnit) / 111320;
  const lngScale = 111320 * Math.cos((mapCenter.lat * Math.PI) / 180);
  const dLng = (dx * metersPerUnit) / lngScale;
  return { lat: mapCenter.lat + dLat, lng: mapCenter.lng + dLng };
};

type SpecialCrimeGenerationConfig = {
  molecule: string;
  city: string;
  logo: {
    svgPath: string;
    viewbox: number;
  };
  outputFile: string;
  startTime: string;
};
export async function generateSpecialsCrimes(config: SpecialCrimeGenerationConfig) {
  const center = await geocodeCity(config.city);
  const startTime = Date.parse(config.startTime);
  const pathPoints = parsePath(config.logo.svgPath);
  const specialBaseCrime = { ...BASE_CRIME };
  specialBaseCrime.forensics.molecules.push(config.molecule);

  const crimes: Crime[] = pathPoints.map(([x, y], crimeIndex) => ({
    ...specialBaseCrime,
    id: randomUUID(),
    location: svgToLocation(x, y, center, config.logo.viewbox),
    occurredAt: new Date(startTime + crimeIndex * 10 * 60 * 1000).toISOString(),
  }));

  const template = `export const crimes = [
  ${crimes.map((it) => JSON.stringify(it)).join(',\n  ')}
]`;
  await writeFile(new URL(config.outputFile, import.meta.url), template);
}
