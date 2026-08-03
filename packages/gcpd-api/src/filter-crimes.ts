import type { Crime } from '@batman/data/src/generate/crimes/crime.js';

export type CrimeFilters = {
  suspects: string[];
  molecules: string[];
  fingerprints: string[];
  city: string;
};

const toStringArray = (value: unknown): string[] => {
  if (value === undefined) {
    return [];
  }
  if (typeof value === 'string') {
    return value.length > 0 ? [value] : [];
  }
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && item.length > 0);
  }
  return [];
};

export const parseCrimeQuery = (query: Record<string, unknown>): CrimeFilters => ({
  suspects: toStringArray(query.suspect),
  molecules: toStringArray(query.molecule),
  fingerprints: toStringArray(query.fingerprint),
  city: query.city as string,
});

const hasAnyFilter = (filters: CrimeFilters): boolean =>
  filters.suspects.length > 0 || filters.molecules.length > 0 || filters.fingerprints.length > 0;

export const filterCrimes = (crimes: Crime[], filters: CrimeFilters): Crime[] => {
  if (!hasAnyFilter(filters)) {
    return crimes;
  }

  return crimes.filter((crime) => {
    if (filters.suspects.length > 0) {
      if (crime.suspect === null || !filters.suspects.includes(crime.suspect)) {
        return false;
      }
    }

    if (filters.molecules.length > 0) {
      const matchesMolecule = filters.molecules.some((molecule) => crime.forensics.molecules.includes(molecule));
      if (!matchesMolecule) {
        return false;
      }
    }

    if (filters.fingerprints.length > 0) {
      const matchesFingerprint = filters.fingerprints.some((fingerprint) => crime.forensics.fingerprints.includes(fingerprint));
      if (!matchesFingerprint) {
        return false;
      }
    }

    return true;
  });
};
