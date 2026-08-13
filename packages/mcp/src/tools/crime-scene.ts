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
import { GCPDClient } from '../api/gcpd.api.js';

const resourceURI = 'ui://batman/crime-scene';
const meta = {
  ui: {
    csp: {
      resourceDomains: [process.env.MCP_ORIGIN],
    },
  },
} satisfies NonNullable<McpUiAppResourceConfig['_meta']>;

export const register: Register = (server) => {
  registerAppResource(
    server,
    'batman_crime_scene_ui',
    resourceURI,
    {
      mimeType: RESOURCE_MIME_TYPE,
      _meta: meta,
    },
    async () => {
      const html = await readFile(join(import.meta.dirname, '../../../mcp-ui/dist/src/crime-scene/index.html'), 'utf-8');
      return {
        contents: [
          {
            uri: resourceURI,
            mimeType: RESOURCE_MIME_TYPE,
            text: html,
            _meta: meta,
          },
        ],
      };
    },
  );

  registerAppTool(
    server,
    'get_crime_scene',
    {
      description:
        'Get the forensic report for the current crime scene from the GCPD: fingerprints, blood traces, lab residue analysis, and exhibits found on site.',
      outputSchema: {
        description: z.string(),
        fingerprintsFound: z.boolean(),
        fingerprintsDetails: z.string().nullable(),
        bloodTraces: z.boolean(),
        bloodTracesDetails: z.string().nullable(),
        residues: z.array(z.string()),
        exhibits: z.array(z.string()),
      },
      _meta: {
        ui: {
          resourceUri: resourceURI,
        },
      },
    },
    async ({ authInfo }) => {
      const crimeScene = await GCPDClient.getCrimeScene(authInfo?.token as string);

      return {
        content: [{ type: 'text', text: JSON.stringify(crimeScene) }],
        structuredContent: { ...crimeScene },
      };
    },
  );

  server.registerResource('batman_crime_scene_forensics_exhibits', `forensics:/exhibits`, { mimeType: 'application/json' }, async () => {
    const crimeScene = await GCPDClient.getCrimeSceneWithForensic();
    return {
      contents: [
        {
          uri: `forensics:/exhibits`,
          mimeType: 'application/json',
          text: JSON.stringify(crimeScene.exhibits),
        },
      ],
    };
  });

  server.registerResource('batman_crime_scene_forensics_residues', `forensics:/residues`, { mimeType: 'application/json' }, async () => {
    const crimeScene = await GCPDClient.getCrimeSceneWithForensic();
    return {
      contents: [
        {
          uri: `forensics:/residues`,
          mimeType: 'application/json',
          text: JSON.stringify(crimeScene.residues),
        },
      ],
    };
  });
};
