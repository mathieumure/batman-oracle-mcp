export interface CrimeLocation {
  lat: number;
  lng: number;
}

export interface CrimeForensics {
  molecules: string[];
  fingerprints: string[];
}

export interface Crime {
  id: string;
  location: CrimeLocation;
  occurredAt: string;
  suspect: string | null;
  forensics: CrimeForensics;
}
