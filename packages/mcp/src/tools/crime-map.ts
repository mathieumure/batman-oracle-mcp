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
import { GCPD_API, PUBLIC_ORIGIN } from '../config.js';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 100;
const MAX_PAGE_SIZE = 200;

const resourceURI = 'ui://batman/crime-map';
const meta = {
  ui: {
    csp: {
      resourceDomains: [PUBLIC_ORIGIN, 'https://static.wikia.nocookie.net', 'https://i.ebayimg.com', 'https://*.basemaps.cartocdn.com'],
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
  suspectPicture: z.string().nullable(),
  forensics: crimeForensicsSchema,
});

type Crime = z.infer<typeof crimeSchema>;

const paginationSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

function paginateCrimes(items: Crime[], page: number, pageSize: number) {
  const total = items.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  return {
    crimes: items.slice(start, start + pageSize),
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1 && totalPages > 0,
    },
  };
}

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
  const url = new URL(GCPD_API + '/crimes');
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
      description:
        'Show paginated crimes on a map centered on a given city. Default page size is 20. When pagination.hasNextPage is true, call again with the next page. Optional GCPD filters: suspect, molecule, fingerprint.',
      inputSchema: {
        city: z.string().describe('City name to center the map on, e.g. "Clermont-Ferrand"'),
        page: z.number().int().min(1).optional().describe('Page number (1-based, default 1)'),
        pageSize: z
          .number()
          .int()
          .min(1)
          .max(MAX_PAGE_SIZE)
          .optional()
          .describe(`Items per page (default ${DEFAULT_PAGE_SIZE}, max ${MAX_PAGE_SIZE})`),
        suspect: z.array(z.string()).optional().describe('Filter by suspect name(s)'),
        molecule: z.array(z.string()).optional().describe('Filter by forensic molecule(s)'),
        fingerprint: z.array(z.string()).optional().describe('Filter by fingerprint id(s)'),
        connectChronologically: z
          .boolean()
          .optional()
          .describe('Connect all crime chronologically, only pass the information if the user explicitly request it'),
      },
      outputSchema: {
        city: z.string(),
        center: crimeLocationSchema,
        crimes: z.array(crimeSchema),
        pagination: paginationSchema,
      },
      _meta: {
        ui: {
          resourceUri: resourceURI,
        },
      },
    },
    async ({ city, page, pageSize, suspect, molecule, fingerprint, connectChronologically }) => {
      const resolvedPage = page ?? DEFAULT_PAGE;
      const resolvedPageSize = pageSize ?? DEFAULT_PAGE_SIZE;
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
      datasetCrimes.forEach((it) => {
        if (it.suspectPicture) {
          it.suspectPicture = rewriteAssetOrigin(it.suspectPicture);
        }
      });
      const translatedCrimes = translateCrimesToCenter(datasetCrimes, center);
      const { crimes, pagination } = paginateCrimes(translatedCrimes, resolvedPage, resolvedPageSize);
      const payload = { city, center, crimes, pagination, connectChronologically };

      return {
        content: [{ type: 'text', text: JSON.stringify(payload) }],
        structuredContent: payload,
      };
    },
  );
};
