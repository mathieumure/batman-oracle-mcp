import type {CrimeScene} from "../../crime-scene.js";

export const crimeScene: CrimeScene = {
    description:
        "La Bastide, scène découverte à l'aube. Des nombreuses traces de nourritures sont présentes, rendant l'analyse environmentale complexe.",
    fingerprintsFound: true,
    fingerprintsDetails: 'Une empreinte partielle a été relevée sur le rebord de la benne renversée.',
    bloodTraces: true,
    bloodTracesDetails: 'Présence uniquement de traces de sang de la victime Alfred Pennyworth',
    residues: [
        'Résidu de vin identifiée comme du Chateau Petrus, cohérent avec les traces rouges retrouvée sur la scène de crime',
        'Poudre fluorescente violette, non répertoriée dans la base GCPD',
    ],
    exhibits: ['Un gant de cuir noir abandonné près de la benne', 'Une carte à jouer représentant un Joker, glissée sous la benne'],
};
