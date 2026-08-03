import type { BatmanCriminal } from '../generate/criminals/index.js';

const base: BatmanCriminal = {
  name: 'John Doe',
  picture: '',
  details: {
    realName: '',
    aliases: [],
    citizenship: 'European',
    affiliation: ['League of Assassins', 'Volcamp', 'Suicide Squad'],
    relatives: [],
    eyes: null,
    hair: null,
    weight: null,
    height: null,
    gender: null,
  },
};

const FAKE_NAME = {
  'Arnaud Blandamour': 'Arnold Whitelove',
  'Benoit Eymard': 'Baneheart',
  'Camille Petitalot': 'Camara',
  'Christophe Prugnaud': 'Prugnight',
  'Claude Dioudonnat': 'Claude Nocturne',
  'Eric Champion': 'The Champion of Chaos',
  'Guillaume Delaire': 'Delair Fume',
  'Johanna Millet': 'Millefeuille de Minuit',
  'Julien Ribeyre': 'Ribeye Ripper',
  'Jérôme Godard': 'Godhand',
  'Mathieu Chausse': 'La Chasse',
  'Matthieu Vincent': 'Vincent Venom',
  'Mickael Gervais': 'Gervoltage',
  'Olivier Coupelon': 'Le Coupe-Gorge',
  'Paul Pinault': 'Pinault Poison',
  'Pierre Colomb': 'Colombe Noire',
  'Pierre Plagnes': 'Plague Pierre',
  'Rokhaya Cisse': 'Cisse Cyclone',
  'Stéphane Coussy': 'Coussy Contagion',
  'Stéphanie Cluzel-Poughet': "Cluzel l'Éclipse",
  'Sylvain Desgrais': 'Sylvain Silence',
  'Thomas Bailly': 'Bailly Blade',
  'Valérie Servaire': 'Servaire Serpent',
};

export const criminals: BatmanCriminal[] = [
  {
    ...base,
    name: FAKE_NAME['Arnaud Blandamour'] as string,
    picture: 'http://localhost:3000/img/abl.jpg',
  },
  {
    ...base,
    name: FAKE_NAME['Benoit Eymard'] as string,
    picture: 'http://localhost:3000/img/bey.jpg',
  },
  {
    ...base,
    name: FAKE_NAME['Camille Petitalot'] as string,
    picture: 'http://localhost:3000/img/cpe.jpg',
  },
  {
    ...base,
    name: FAKE_NAME['Christophe Prugnaud'] as string,
    picture: 'http://localhost:3000/img/cpr.jpg',
  },
  {
    ...base,
    name: FAKE_NAME['Claude Dioudonnat'] as string,
    picture: 'http://localhost:3000/img/cdi.jpg',
  },
  {
    ...base,
    name: FAKE_NAME['Eric Champion'] as string,
    picture: 'http://localhost:3000/img/ech.jpg',
  },
  {
    ...base,
    name: FAKE_NAME['Guillaume Delaire'] as string,
    picture: 'http://localhost:3000/img/gde.jpg',
  },
  {
    ...base,
    name: FAKE_NAME['Johanna Millet'] as string,
    picture: 'http://localhost:3000/img/jmi.png',
  },
  {
    ...base,
    name: FAKE_NAME['Julien Ribeyre'] as string,
    picture: 'http://localhost:3000/img/jri.jpg',
  },
  {
    ...base,
    name: FAKE_NAME['Jérôme Godard'] as string,
    picture: 'http://localhost:3000/img/jgo.jpg',
  },
  {
    ...base,
    name: FAKE_NAME['Mathieu Chausse'] as string,
    picture: 'http://localhost:3000/img/mch.jpg',
  },
  {
    ...base,
    name: FAKE_NAME['Matthieu Vincent'] as string,
    picture: 'http://localhost:3000/img/mvi.jpg',
  },
  {
    ...base,
    name: FAKE_NAME['Mickael Gervais'] as string,
    picture: 'http://localhost:3000/img/mge.jpg',
  },
  {
    ...base,
    name: FAKE_NAME['Olivier Coupelon'] as string,
    picture: 'http://localhost:3000/img/oco.jpg',
  },
  {
    ...base,
    name: FAKE_NAME['Paul Pinault'] as string,
    picture: 'http://localhost:3000/img/ppi.jpg',
  },
  {
    ...base,
    name: FAKE_NAME['Pierre Colomb'] as string,
    picture: 'http://localhost:3000/img/pco.jpg',
  },
  {
    ...base,
    name: FAKE_NAME['Pierre Plagnes'] as string,
    picture: 'http://localhost:3000/img/ppl.jpg',
  },
  {
    ...base,
    name: FAKE_NAME['Rokhaya Cisse'] as string,
    picture: 'http://localhost:3000/img/rci.jpg',
  },
  {
    ...base,
    name: FAKE_NAME['Stéphane Coussy'] as string,
    picture: 'http://localhost:3000/img/sco.jpg',
  },
  {
    ...base,
    name: FAKE_NAME['Stéphanie Cluzel-Poughet'] as string,
    picture: 'http://localhost:3000/img/scp.jpg',
  },
  {
    ...base,
    name: FAKE_NAME['Sylvain Desgrais'] as string,
    picture: 'http://localhost:3000/img/sde.jpg',
  },
  {
    ...base,
    name: FAKE_NAME['Thomas Bailly'] as string,
    picture: 'http://localhost:3000/img/tba.jpg',
  },
  {
    ...base,
    name: FAKE_NAME['Valérie Servaire'] as string,
    picture: 'http://localhost:3000/img/vse.jpg',
  },
];
