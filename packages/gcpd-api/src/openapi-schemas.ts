const stringArrayQuery = {
  oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
} as const;

const criminalDetailsSchema = {
  type: 'object',
  properties: {
    realName: { type: ['string', 'null'] },
    aliases: { type: 'array', items: { type: 'string' } },
    relatives: { type: 'array', items: { type: 'string' } },
    citizenship: { type: ['string', 'null'] },
    gender: { type: ['string', 'null'] },
    height: { type: ['string', 'null'] },
    weight: { type: ['string', 'null'] },
    eyes: { type: ['string', 'null'] },
    hair: { type: ['string', 'null'] },
    affiliation: { type: 'array', items: { type: 'string' } },
  },
} as const;

const batmanCriminalSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    picture: { type: ['string', 'null'] },
    details: { oneOf: [criminalDetailsSchema, { type: 'null' }] },
  },
  required: ['name', 'picture', 'details'],
} as const;

const crimeSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    location: {
      type: 'object',
      properties: {
        lat: { type: 'number' },
        lng: { type: 'number' },
      },
      required: ['lat', 'lng'],
    },
    occurredAt: { type: 'string', format: 'date-time' },
    suspect: { type: ['string', 'null'] },
    suspectPicture: { type: 'string' },
    forensics: {
      type: 'object',
      properties: {
        molecules: { type: 'array', items: { type: 'string' } },
        fingerprints: { type: 'array', items: { type: 'string' } },
      },
      required: ['molecules', 'fingerprints'],
    },
  },
  required: ['id', 'location', 'occurredAt', 'suspect', 'forensics'],
} as const;

const coordinatesSchema = {
  type: 'object',
  properties: {
    lat: { type: 'number' },
    lng: { type: 'number' },
  },
  required: ['lat', 'lng'],
} as const;

const crimeSceneSchema = {
  type: 'object',
  properties: {
    description: { type: 'string' },
    fingerprintsFound: { type: 'boolean' },
    fingerprintsDetails: { type: ['string', 'null'] },
    bloodTraces: { type: 'boolean' },
    bloodTracesDetails: { type: ['string', 'null'] },
    residues: { type: 'array', items: { type: 'string' } },
    exhibits: { type: 'array', items: { type: 'string' } },
  },
  required: ['description', 'fingerprintsFound', 'fingerprintsDetails', 'bloodTraces', 'bloodTracesDetails', 'residues', 'exhibits'],
} as const;

export const criminalsRouteSchema = {
  description: 'List Batman rogues, optionally filtered by affiliation',
  tags: ['criminals'],
  querystring: {
    type: 'object',
    properties: {
      affiliation: { type: 'string', description: 'Filter criminals by affiliation name' },
    },
  },
  response: {
    200: {
      description: 'List of criminals',
      type: 'array',
      items: batmanCriminalSchema,
    },
  },
} as const;

export const crimesRouteSchema = {
  description: 'List crimes with optional forensic filters, geocoded to a city center',
  tags: ['crimes'],
  querystring: {
    type: 'object',
    properties: {
      city: { type: 'string', description: 'City name used to center the crime map' },
      suspect: { ...stringArrayQuery, description: 'Filter by suspect name' },
      molecule: { ...stringArrayQuery, description: 'Filter by forensic molecule' },
      fingerprint: { ...stringArrayQuery, description: 'Filter by fingerprint id' },
    },
  },
  response: {
    200: {
      description: 'Filtered crimes and map center coordinates',
      type: 'object',
      properties: {
        crimes: { type: 'array', items: crimeSchema },
        center: coordinatesSchema,
      },
      required: ['crimes', 'center'],
    },
  },
} as const;

export const crimeSceneRouteSchema = {
  description: 'Get crime scene overview without sensitive forensic details',
  tags: ['crime-scene'],
  security: [{ bearerAuth: [] }],
  headers: {
    type: 'object',
    properties: {
      authorization: { type: 'string', description: 'Bearer JWT token' },
    },
  },
  response: {
    200: {
      description: 'Crime scene with residues and exhibits redacted',
      ...crimeSceneSchema,
    },
    401: {
      description: 'Missing or invalid bearer token',
      type: 'string',
    },
  },
} as const;

export const crimeSceneForensicsRouteSchema = {
  description: 'Get full crime scene forensics including residues and exhibits',
  tags: ['crime-scene'],
  response: {
    200: {
      description: 'Complete crime scene forensics',
      ...crimeSceneSchema,
    },
  },
} as const;
