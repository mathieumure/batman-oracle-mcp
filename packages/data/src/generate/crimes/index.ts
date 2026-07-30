import { randomUUID } from 'node:crypto';
import type { Crime, CrimeLocation } from './crime.js';
import { CONFIG } from './crime-config.js';
import { geocodeCity, randomOffset } from './crime-location.js';
import { randomNightDateTime } from './crime-schedule.js';
import { pickWeightedSuspectName } from './crime-suspects.js';
import { pickForensics } from './crime-forensics.js';

const randomCrimeCount = (): number => CONFIG.minCrimeCount + Math.floor(Math.random() * (CONFIG.maxCrimeCount - CONFIG.minCrimeCount + 1));

const buildCrime = (center: CrimeLocation): Crime => ({
  id: randomUUID(),
  location: randomOffset(center, CONFIG.cityRadiusMeters),
  occurredAt: randomNightDateTime(CONFIG.date),
  suspect: Math.random() < CONFIG.noSuspectRatio ? null : pickWeightedSuspectName(),
  forensics: pickForensics(),
});

export const generateCrimes = async (): Promise<Crime[]> => {
  const center = await geocodeCity(CONFIG.city);
  const count = randomCrimeCount();

  return Array.from({ length: count }, () => buildCrime(center));
};
