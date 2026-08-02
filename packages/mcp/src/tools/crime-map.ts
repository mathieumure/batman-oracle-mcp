import type { Register } from '../types.js';
import {
  registerAppTool,
  registerAppResource,
  RESOURCE_MIME_TYPE,
  type McpUiAppResourceConfig,
} from '@modelcontextprotocol/ext-apps/server';
import { z } from 'zod';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { rewriteAssetOrigin } from '../public-origin.js';
import { PUBLIC_ORIGIN } from '../config.js';

const resourceURI = 'ui://batman/crime-map';
const meta = {
  ui: {
    csp: {
      resourceDomains: [PUBLIC_ORIGIN, 'https://static.wikia.nocookie.net', 'https://*.basemaps.cartocdn.com'],
    },
  },
} satisfies NonNullable<McpUiAppResourceConfig['_meta']>;

const crimeLocationSchema = z.object({ lat: z.number(), lng: z.number() });
const crimeForensicsSchema = z.object({
  molecules: z.array(z.string()),
  fingerprints: z.array(z.string()),
});
const crimeSchema = z.object({
  id: z.string(),
  location: crimeLocationSchema,
  occurredAt: z.string(),
  suspect: z.string().nullable(),
  forensics: crimeForensicsSchema,
});

type Crime = z.infer<typeof crimeSchema>;

type Coordinates = { lat: number; lng: number };

async function geocodeCity(city: string): Promise<Coordinates | undefined> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'batman-oracle-mcp (conference talk demo)' },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return undefined;

    const results = (await response.json()) as Array<{ lat: string; lon: string }>;
    const first = results[0];

    if (!first) return undefined;

    return { lat: parseFloat(first.lat), lng: parseFloat(first.lon) };
  } catch {
    return undefined;
  }
}

function referenceCenterFromCrimes(crimes: Crime[]): Coordinates {
  const sum = crimes.reduce(
    (acc, crime) => ({
      lat: acc.lat + crime.location.lat,
      lng: acc.lng + crime.location.lng,
    }),
    { lat: 0, lng: 0 },
  );
  return { lat: sum.lat / crimes.length, lng: sum.lng / crimes.length };
}

function translateCrimesToCenter(crimes: Crime[], targetCenter: Coordinates): Crime[] {
  if (crimes.length === 0) {
    return [];
  }
  const reference = referenceCenterFromCrimes(crimes);
  const deltaLat = targetCenter.lat - reference.lat;
  const deltaLng = targetCenter.lng - reference.lng;
  return crimes.map((crime) => ({
    ...crime,
    location: {
      lat: crime.location.lat + deltaLat,
      lng: crime.location.lng + deltaLng,
    },
  }));
}

type CrimeMapFilters = {
  suspect?: string[];
  molecule?: string[];
  fingerprint?: string[];
};

function buildCrimesApiUrl(filters: CrimeMapFilters): string {
  const url = new URL('http://localhost:8080/crimes');
  for (const value of filters.suspect ?? []) {
    url.searchParams.append('suspect', value);
  }
  for (const value of filters.molecule ?? []) {
    url.searchParams.append('molecule', value);
  }
  for (const value of filters.fingerprint ?? []) {
    url.searchParams.append('fingerprint', value);
  }
  return url.toString();
}

export const register: Register = (server) => {
  registerAppResource(
    server,
    'batman_crime_map_ui',
    resourceURI,
    {
      mimeType: RESOURCE_MIME_TYPE,
      _meta: meta,
    },
    async () => {
      const html = await readFile(join(import.meta.dirname, '../../../mcp-ui/dist/src/crime-map/index.html'), 'utf-8');
      return {
        contents: [
          {
            uri: resourceURI,
            mimeType: RESOURCE_MIME_TYPE,
            text: rewriteAssetOrigin(html),
            _meta: meta,
          },
        ],
      };
    },
  );

  registerAppTool(
    server,
    'get_crime_map',
    {
      description: 'Show crimes on a map centered on a given city. Optional GCPD filters: suspect, molecule, fingerprint.',
      inputSchema: {
        city: z.string().describe('City name to center the map on, e.g. "Clermont-Ferrand"'),
        suspect: z.array(z.string()).optional().describe('Filter by suspect name(s)'),
        molecule: z.array(z.string()).optional().describe('Filter by forensic molecule(s)'),
        fingerprint: z.array(z.string()).optional().describe('Filter by fingerprint id(s)'),
      },
      outputSchema: {
        city: z.string(),
        center: crimeLocationSchema,
        crimes: z.array(crimeSchema),
      },
      _meta: {
        ui: {
          resourceUri: resourceURI,
        },
      },
    },
    async ({ city, suspect, molecule, fingerprint }) => {
      const center = await geocodeCity(city);

      if (!center) {
        return {
          content: [{ type: 'text', text: `Impossible de localiser "${city}".` }],
          isError: true,
        };
      }

      const response = await fetch(buildCrimesApiUrl({ suspect, molecule, fingerprint }));
      if (!response.ok) {
        return {
          content: [{ type: 'text', text: 'Impossible de récupérer les crimes.' }],
          isError: true,
        };
      }

      const datasetCrimes = (await response.json()) as Crime[];
      const crimes = translateCrimesToCenter(datasetCrimes, center);

      return {
        content: [{ type: 'text', text: JSON.stringify({ city, center, crimes }) }],
        structuredContent: { city, center, crimes },
      };
    },
  );
};
