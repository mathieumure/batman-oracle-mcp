import { criminals } from '../../../criminals.js';

const NAMED_SUSPECT_WEIGHTS: Record<string, number> = {
  Joker: 0.2,
  "Ra's al Ghul": 0.1,
  Bane: 0.1,
  Riddler: 0.2,
  Penguin: 0.1,
  'Two-Face': 0.1,
  Scarecrow: 0.1,
};

const EXCLUDED_GROUP_NAMES = ['Court of Owls', 'League of Assassins', 'Dark Knights', 'Tweedledum and Tweedledee'];

const namedTotalWeight = Object.values(NAMED_SUSPECT_WEIGHTS).reduce((sum, weight) => sum + weight, 0);

const otherCriminalNames = criminals
  .map((criminal) => criminal.name)
  .filter((name) => !(name in NAMED_SUSPECT_WEIGHTS) && !EXCLUDED_GROUP_NAMES.includes(name));

const otherCriminalWeight = (1 - namedTotalWeight) / otherCriminalNames.length;

const SUSPECT_WEIGHTS: Array<[string, number]> = [
  ...Object.entries(NAMED_SUSPECT_WEIGHTS),
  ...otherCriminalNames.map((name): [string, number] => [name, otherCriminalWeight]),
];

export const pickWeightedSuspectName = (): string => {
  const roll = Math.random();
  let cumulative = 0;

  for (const [name, weight] of SUSPECT_WEIGHTS) {
    cumulative += weight;
    if (roll <= cumulative) {
      return name;
    }
  }

  return SUSPECT_WEIGHTS[SUSPECT_WEIGHTS.length - 1][0];
};
