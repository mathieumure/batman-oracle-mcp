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

const resourceURI = 'ui://batman/villains-map';
const meta = {
  ui: {
    csp: {
      resourceDomains: ['https://static.wikia.nocookie.net', 'https://*.basemaps.cartocdn.com'],
    },
  },
} satisfies NonNullable<McpUiAppResourceConfig['_meta']>;

const MAX_RADIUS_METERS = 400;

const villains = [
  {
    name: 'Joker',
    picture: 'https://static.wikia.nocookie.net/marvel_dc/images/4/41/Batman_Vol_2_23.1_The_Joker_Textless.jpg',
  },
  {
    name: 'Bane',
    picture: 'https://static.wikia.nocookie.net/marvel_dc/images/b/b0/Batman_Vol_3_18_Textless.jpg',
  },
];

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

function randomOffset(center: Coordinates, maxRadiusMeters: number): Coordinates {
  const radius = Math.random() * maxRadiusMeters;
  const angle = Math.random() * 2 * Math.PI;
  const dLat = (radius * Math.cos(angle)) / 111320;
  const dLng = (radius * Math.sin(angle)) / (111320 * Math.cos((center.lat * Math.PI) / 180));

  return { lat: center.lat + dLat, lng: center.lng + dLng };
}

export const register: Register = (server) => {
  registerAppResource(
    server,
    'batman_villains_map_ui',
    resourceURI,
    {
      mimeType: RESOURCE_MIME_TYPE,
      _meta: meta,
    },
    async () => {
      const html = await readFile(join(import.meta.dirname, '../../../mcp-ui/dist/src/villains-map/index.html'), 'utf-8');
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
    'localize_villains',
    {
      description: 'Locate all known villains scattered around a given city on a map.',
      inputSchema: {
        city: z.string().describe('City name to center the map on, e.g. "Clermont-Ferrand"'),
      },
      outputSchema: {
        city: z.string(),
        center: z.object({ lat: z.number(), lng: z.number() }),
        villains: z.array(
          z.object({
            name: z.string(),
            picture: z.url(),
            lat: z.number(),
            lng: z.number(),
          }),
        ),
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

      const locatedVillains = villains.map((villain) => ({
        ...villain,
        ...randomOffset(center, MAX_RADIUS_METERS),
      }));

      return {
        content: [{ type: 'text', text: JSON.stringify({ city, center, villains: locatedVillains }) }],
        structuredContent: { city, center, villains: locatedVillains },
      };
    },
  );
};
