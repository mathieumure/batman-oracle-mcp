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
import { crimes as datasetCrimes } from '@batman/data/crimes';

type Crime = (typeof datasetCrimes)[number];

const resourceURI = 'ui://batman/crime-map';
const meta = {
  ui: {
    csp: {
      resourceDomains: ['https://static.wikia.nocookie.net', 'https://*.basemaps.cartocdn.com'],
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
      description: 'Show crimes on a map centered on a given city.',
      inputSchema: {
        city: z.string().describe('City name to center the map on, e.g. "Clermont-Ferrand"'),
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
    async ({ city }) => {
      const center = await geocodeCity(city);

      if (!center) {
        return {
          content: [{ type: 'text', text: `Impossible de localiser "${city}".` }],
          isError: true,
        };
      }

      const crimes = translateCrimesToCenter(datasetCrimes, center);

      return {
        content: [{ type: 'text', text: JSON.stringify({ city, center, crimes }) }],
        structuredContent: { city, center, crimes },
      };
    },
  );
};
