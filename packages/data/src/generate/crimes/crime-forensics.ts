import { randomUUID } from 'node:crypto';
import type { CrimeForensics } from './crime.js';

const MOLECULE_POOL = [
  'Nicotine',
  'Ethanol',
  'Cyanide',
  'Adrenaline',
  'Cocaine',
  'Chloroform',
  'Arsenic',
  'Nitroglycerin',
  'Potassium Chloride',
  'Sodium Pentothal',
  'Joker Venom',
  'Fear Toxin',
  "Bane's Venom",
  "Ivy's Pheromones",
  'Mad Hatter Mind-Control Serum',
  'Titan Formula',
  'Electrum',
  'Man-Bat Serum',
  'Clayface Compound',
  'Freeze Cryo-Serum',
];

const pickRandomUniqueSubset = <T>(pool: T[], min: number, max: number): T[] => {
  const size = min + Math.floor(Math.random() * (max - min + 1));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, size);
};

const generateFingerprintId = (): string => `FP-${randomUUID().slice(0, 6)}`;

export const pickForensics = (): CrimeForensics => {
  const fingerprintCount = 1 + Math.floor(Math.random() * 5);

  return {
    molecules: pickRandomUniqueSubset(MOLECULE_POOL, 1, 4),
    fingerprints: Array.from({ length: fingerprintCount }, generateFingerprintId),
  };
};
