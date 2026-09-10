export interface CrimeScene {
  description: string;
  fingerprintsFound: boolean;
  fingerprintsDetails: string | null;
  bloodTraces: boolean;
  bloodTracesDetails: string | null;
  residues: string[];
  exhibits: string[];
}

// export { crimeScene } from './src/specials/volcamp-crime-scene.js'
export { crimeScene } from './src/specials/lyonjs-crime-scene.js'
