export interface CrimeScene {
  description: string;
  fingerprintsFound: boolean;
  fingerprintsDetails: string | null;
  bloodTraces: boolean;
  bloodTracesDetails: string | null;
  residues: string[];
  exhibits: string[];
}

export const crimeScene: CrimeScene = {
  description:
    "Zénith d'Auvergne, périphérie de Clermont-Ferrand, scène découverte à l'aube. Des traces de pneus crissés marquent le bitume jusqu'à une benne renversée, sans trace de véhicule sur place.",
  fingerprintsFound: true,
  fingerprintsDetails: 'Une empreinte partielle a été relevée sur le rebord de la benne renversée.',
  bloodTraces: true,
  bloodTracesDetails: 'Présence uniquement de traces de sang de la victime Alfred Pennyworth',
  residues: [
    'Résidu de gomme de pneu identifié comme du Michelin, cohérent avec un freinage brutal',
    'Poudre fluorescente violette, non répertoriée dans la base GCPD',
  ],
  exhibits: ['Un gant de cuir noir abandonné près de la benne', 'Une carte à jouer représentant un Joker, glissée sous la benne'],
};
